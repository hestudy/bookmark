import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { client } from './utils/client';

export const scrapyUrl = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await client.scrapy.scrapyUrl.$post({
      json: {
        url: args.url,
      },
    });
    const json = await res.json();

    return json;
  },
});
