import { getAuthUserId } from '@convex-dev/auth/server';
import { Workpool } from '@convex-dev/workpool';
import { v } from 'convex/values';
import { components, internal } from './_generated/api';
import {
  internalAction,
  internalMutation,
  mutation,
} from './_generated/server';

const pool = new Workpool(components.scrapeWorkpool, { maxParallelism: 1 });

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

    await pool.enqueueAction(ctx, internal.link.getLinkMetaData, {
      linkId,
      url: args.url,
    });

    return linkId;
  },
});

export const updateLink = internalMutation({
  args: {
    linkId: v.id('links'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { linkId, title, description } = args;
    return await ctx.db.patch(linkId, {
      title,
      description,
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
