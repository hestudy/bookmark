import { v } from 'convex/values';
import { internalAction } from './_generated/server';

export const addDocument = internalAction({
  args: {
    linkId: v.id('links'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    
  },
});
