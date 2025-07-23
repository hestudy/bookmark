import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { client } from './utils/client';

export const downloadAndUploadMedia = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await client.scrapy.scrapyMedia.$get({
      query: {
        url: args.url,
      },
    });
    const blob = await res.blob();
    const mediaId = await ctx.storage.store(blob);
    return mediaId;
  },
});
