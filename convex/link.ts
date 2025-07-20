import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const addLink = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }
    const linkId = await ctx.db.insert('links', {
      ...args,
      userId,
    });

    return linkId;
  },
});
