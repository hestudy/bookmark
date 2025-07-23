import { v } from 'convex/values';
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from './_generated/server';
import { meiliClient } from './utils/meiliClient';
import { getAuthUserId } from '@convex-dev/auth/server';
import { api, internal } from './_generated/api';

const linkIndex = meiliClient.index('links');

export const addDocument = internalAction({
  args: {
    linkId: v.id('links'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await linkIndex.addDocuments([
      {
        id: args.linkId.toString(),
        title: args.title,
        description: args.description,
        content: args.content,
      },
    ]);
  },
});

export const searchLink = action({
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
    });

    return Promise.all(
      res.hits.map(async (hit) => {
        // return await api.link.getLink({
        // });
      }),
    );
  },
});
