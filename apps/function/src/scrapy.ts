import { zValidator } from "@hono/zod-validator";
import { Defuddle } from "defuddle/node";
import { Hono } from "hono";
import puppeteer from "puppeteer-core";
import z from "zod";

const scrapy = new Hono().post(
  "/scrapyUrl",
  zValidator(
    "json",
    z.object({
      url: z.url(),
    })
  ),
  async (c) => {
    const validated = c.req.valid("json");
    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSERWSENDPOINT,
    });
    const page = await browser.newPage();
    await page.goto(validated.url);

    const dom = await page.evaluate(() => {
      return document.documentElement.outerHTML;
    });

    const result = await Defuddle(dom, undefined, {
      separateMarkdown: true,
    });
    return c.json(result);
  }
);

export default scrapy;
