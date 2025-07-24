import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';
import { Doc } from './_generated/dataModel';
import { action, internalAction } from './_generated/server';
import { meiliClient } from './utils/meiliClient';

const linkIndex = meiliClient.index('links');

export const addDocument = internalAction({
  args: {
    linkId: v.id('links'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await linkIndex.addDocuments(
      [
        {
          id: args.linkId.toString(),
          title: args.title,
          description: args.description,
          content: args.content,
          userId: args.userId.toString(),
        },
      ],
      {
        primaryKey: 'id',
      },
    );
  },
});

export const deleteDocument = internalAction({
  args: {
    linkId: v.id('links'),
  },
  handler: async (ctx, args) => {
    return await linkIndex.deleteDocuments({
      filter: `id = ${args.linkId.toString()}`,
    });
  },
});

export const deleteAllDocument = internalAction({
  handler: async (ctx) => {
    return await linkIndex.deleteAllDocuments();
  },
});

export const updateFilterAttr = internalAction({
  handler: async () => {
    return await linkIndex.updateFilterableAttributes(['userId', 'id']);
  },
});

export const searchLinks = action({
  args: {
    keyword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const res = await linkIndex.search(args.keyword, {
      limit: 100,
      filter: `userId = ${userId.toString()}`,
    });

    const links: (Doc<'links'> | null)[] = await ctx.runQuery(
      internal.link.getMoreLink,
      {
        linkIds: res.hits.map((hit) => hit.id),
      },
    );

    return links.map((d) => {
      const { content, html, textContent, ...props } = d!;

      return props;
    });
  },
});
