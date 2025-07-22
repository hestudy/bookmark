import { getAuthUserId } from '@convex-dev/auth/server';
import { Workpool } from '@convex-dev/workpool';
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { components, internal } from './_generated/api';
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from './_generated/server';

const pool = new Workpool(components.scrapeWorkpool, { maxParallelism: 1 });

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

    const linksWithScreenshot = await Promise.all(
      links.page.map(async (link) => {
        return {
          ...link,
        };
      }),
    );

    return {
      ...links,
      page: linksWithScreenshot,
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

    const poolId = await pool.enqueueAction(
      ctx,
      internal.link.getLinkMetaData,
      {
        linkId,
        url: args.url,
      },
    );

    await ctx.db.patch(linkId, {
      poolId,
    });

    return linkId;
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

    const link = await ctx.db
      .query('links')
      .filter((q) => q.eq(q.field('_id'), args.linkId))
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    if (!link) {
      throw new Error('Link not found');
    }

    const poolId = await pool.enqueueAction(
      ctx,
      internal.link.getLinkMetaData,
      {
        linkId: args.linkId,
        url: link.url,
      },
    );

    await ctx.db.patch(link._id, {
      poolId,
    });

    return true;
  },
});

export const updateLink = internalMutation({
  args: {
    linkId: v.id('links'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    domain: v.optional(v.string()),
    content: v.optional(v.string()),
    html: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { linkId, title, description, domain, content, html } = args;
    return await ctx.db.patch(linkId, {
      title,
      description,
      domain,
      content,
      html,
    });
  },
});

export const getLinkMetaData = internalAction({
  args: {
    linkId: v.id('links'),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const { linkId, url } = args;
    const res = await ctx.runAction(internal.scrapy.scrapyUrl, { url });
    await ctx.runMutation(internal.link.updateLink, {
      linkId,
      title: res.title,
      description: res.description!,
    });
  },
});
