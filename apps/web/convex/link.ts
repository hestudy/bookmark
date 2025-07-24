import { getAuthUserId } from '@convex-dev/auth/server';
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import {
  mediaWorkpool,
  scrapeWorkpool,
  searchIndexWorkpool,
} from './utils/workpool';

export const getLinkPage = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const links = await ctx.db
      .query('links')
      .filter((q) => q.eq(q.field('userId'), userId))
      .order('desc')
      .paginate(args.paginationOpts);

    const linksWithMedia = await Promise.all(
      links.page.map(async (link) => {
        const { content, html, ...props } = link;
        return {
          ...props,
          imageUrl: link.image
            ? await ctx.storage.getUrl(link.image)
            : undefined,
          faviconUrl: link.favicon
            ? await ctx.storage.getUrl(link.favicon)
            : undefined,
        };
      }),
    );

    return {
      ...links,
      page: linksWithMedia,
    };
  },
});

export const getLink = query({
  args: {
    linkId: v.id('links'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const result = await ctx.db
      .query('links')
      .filter((q) => q.eq(q.field('_id'), args.linkId))
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    return {
      ...result,
    };
  },
});

export const addLink = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const existingLink = await ctx.db
      .query('links')
      .filter((q) => q.eq(q.field('url'), args.url))
      .first();
    if (!!existingLink) {
      return existingLink._id;
    }

    const linkId = await ctx.db.insert('links', {
      ...args,
      userId,
    });

    const poolId = await scrapeWorkpool.enqueueAction(
      ctx,
      internal.link.getLinkMetaData,
      {
        linkId,
        url: args.url,
        userId,
      },
    );

    await ctx.db.patch(linkId, {
      poolId,
    });

    return linkId;
  },
});

export const deleteLink = mutation({
  args: {
    linkId: v.id('links'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const link = await ctx.db
      .query('links')
      .filter((q) => q.eq(q.field('_id'), args.linkId))
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    if (!link) {
      throw new Error('Link not found');
    }

    await searchIndexWorkpool.enqueueAction(
      ctx,
      internal.search.deleteDocument,
      {
        linkId: args.linkId,
      },
    );

    return await ctx.db.delete(args.linkId);
  },
});

export const updateLink = mutation({
  args: {
    linkId: v.id('links'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const link = await ctx.db
      .query('links')
      .filter((q) => q.eq(q.field('_id'), args.linkId))
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    if (!link) {
      throw new Error('Link not found');
    }

    return await ctx.db.patch(args.linkId, {
      title: args.title,
      description: args.description,
    });
  },
});

export const scrapyLink = mutation({
  args: {
    linkId: v.id('links'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    await scrapeWorkpool.enqueueMutation(
      ctx,
      internal.link.internalScrapyLink,
      {
        linkId: args.linkId,
        userId,
      },
    );
  },
});

export const internalScrapyLink = internalMutation({
  args: {
    linkId: v.id('links'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query('links')
      .filter((q) => q.eq(q.field('_id'), args.linkId))
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first();

    if (!link) {
      throw new Error('Link not found');
    }

    const poolId = await scrapeWorkpool.enqueueAction(
      ctx,
      internal.link.getLinkMetaData,
      {
        linkId: args.linkId,
        url: link.url,
        userId: args.userId,
      },
    );

    await ctx.db.patch(link._id, {
      poolId,
    });

    return true;
  },
});

export const internalUpdateLink = internalMutation({
  args: {
    linkId: v.id('links'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    domain: v.optional(v.string()),
    content: v.optional(v.string()),
    html: v.optional(v.string()),
    textContent: v.optional(v.string()),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const {
      linkId,
      title,
      description,
      domain,
      content,
      html,
      textContent,
      userId,
    } = args;

    await searchIndexWorkpool.enqueueAction(ctx, internal.search.addDocument, {
      linkId,
      title,
      description,
      content,
      userId,
    });

    return await ctx.db.patch(linkId, {
      title,
      description,
      domain,
      content,
      html,
      textContent,
    });
  },
});

export const getLinkMetaData = internalAction({
  args: {
    linkId: v.id('links'),
    url: v.string(),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { linkId, url } = args;
    const res = await ctx.runAction(internal.scrapy.scrapyUrl, { url });

    if (res.image) {
      await mediaWorkpool.enqueueAction(ctx, internal.media.saveLinkImage, {
        linkId,
        url: res.image,
      });
    }

    if (res.favicon) {
      await mediaWorkpool.enqueueAction(ctx, internal.media.saveLinkFavicon, {
        linkId,
        url: res.favicon,
      });
    }

    await ctx.runMutation(internal.link.internalUpdateLink, {
      linkId,
      title: res.title,
      description: res.description,
      domain: res.domain,
      content: res.contentMarkdown,
      html: res.article?.content || undefined,
      textContent: res.article?.textContent || undefined,
      userId: args.userId,
    });
  },
});

export const scrapyAllLink = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const links = await ctx.db
      .query('links')
      .filter((q) => q.eq(q.field('userId'), userId));

    for await (const link of links) {
      await scrapeWorkpool.enqueueMutation(
        ctx,
        internal.link.internalScrapyLink,
        {
          linkId: link._id,
          userId,
        },
      );
    }
  },
});

export const getMoreLink = internalQuery({
  args: {
    linkIds: v.array(v.id('links')),
  },
  handler: async (ctx, args) => {
    const links = await Promise.all(
      args.linkIds.map(async (linkId) => await ctx.db.get(linkId)),
    );
    return links;
  },
});
