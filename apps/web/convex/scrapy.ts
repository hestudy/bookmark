'use node';

import { v } from 'convex/values';
import { BookmarkFunction } from 'function';
import { hc } from 'hono/client';
import puppeteer from 'puppeteer-core';
import { internalAction } from './_generated/server';

const client = hc<BookmarkFunction>(
  process.env.FUNCTION_URL || 'http://localhost:3001',
);

export const scrapyUrl = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (_, args) => {
    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSERWSENDPOINT,
    });
    const page = await browser.newPage();
    await page.goto(args.url);
    const title = await page.title();
    const description = await page.$eval(
      'meta[name="description"]',
      (element) => element.getAttribute('content'),
    );

    const screenshot = await page.screenshot({
      path: 'screenshot.png',
      encoding: 'base64',
      fullPage: true,
    });

    await page.close();
    return { title, description, screenshot };
  },
});

export const newScrapyUrl = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await client.posts.$post({
      json: {
        url: args.url,
      },
    });
    const json = await res.json();

    return json;
  },
});
