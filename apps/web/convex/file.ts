import { v } from 'convex/values';
import { action } from './_generated/server';

export const fileContext = action({
  args: {
    fileId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.fileId);
    if (url) {
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text);
      return json;
    }
  },
});

export const importKarakeep = action({
  args: {
    fileId: v.id('_storage'),
  },
  handler: async (ctx, args) => {},
});
