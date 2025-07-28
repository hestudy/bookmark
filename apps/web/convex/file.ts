import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import z from 'zod';
import { api } from './_generated/api';
import { action } from './_generated/server';
import { karakeepWorkpool } from './utils/workpool';

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

const karakeepSchema = z.object({
  bookmarks: z.array(
    z.object({
      content: z.object({
        url: z.url(),
      }),
    }),
  ),
});

export const importKarakeep = action({
  args: {
    fileId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('Not authenticated');
    }

    const json = await ctx.runAction(api.file.fileContext, {
      fileId: args.fileId,
    });
    const parsed = karakeepSchema.parse(json);
    for await (const bookmark of parsed.bookmarks) {
      await karakeepWorkpool.enqueueMutation(ctx, api.link.addLink, {
        url: bookmark.content.url,
        userId,
      });
    }
  },
});
