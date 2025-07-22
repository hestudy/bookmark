import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { fileTypeFromStream } from 'file-type';

export const downloadAndUploadMedia = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await fetch(args.url);
    if (res.body) {
      const fileType = await fileTypeFromStream(res.body);
      if (fileType?.mime.includes('image')) {
        const blob = await res.blob();
        const mediaId = await ctx.storage.store(blob);
        return mediaId;
      }
    }
  },
});
