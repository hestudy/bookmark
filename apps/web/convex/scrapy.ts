import { v } from 'convex/values';
import { BookmarkFunction } from 'function';
import { hc } from 'hono/client';
import { internalAction } from './_generated/server';

const client = hc<BookmarkFunction>(
  process.env.FUNCTION_URL || 'http://localhost:3001',
);

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
