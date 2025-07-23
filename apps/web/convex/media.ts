import { v } from 'convex/values';
import { internalAction, internalMutation } from './_generated/server';
import { client } from './utils/client';
import { internal } from './_generated/api';

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

export const updateLinkImage = internalMutation({
  args: {
    linkId: v.id('links'),
    image: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.linkId, {
      image: args.image,
    });
  },
});

export const saveLinkImage = internalAction({
  args: {
    linkId: v.id('links'),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const mediaId = await ctx.runAction(internal.media.downloadAndUploadMedia, {
      url: args.url,
    });
    await ctx.runMutation(internal.media.updateLinkImage, {
      linkId: args.linkId,
      image: mediaId,
    });
  },
});

export const updateLinkFavicon = internalMutation({
  args: {
    linkId: v.id('links'),
    favicon: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.linkId, {
      favicon: args.favicon,
    });
  },
});

export const saveLinkFavicon = internalAction({
  args: {
    linkId: v.id('links'),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const mediaId = await ctx.runAction(internal.media.downloadAndUploadMedia, {
      url: args.url,
    });
    await ctx.runMutation(internal.media.updateLinkFavicon, {
      linkId: args.linkId,
      favicon: mediaId,
    });
  },
});
