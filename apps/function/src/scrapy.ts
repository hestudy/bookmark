import { zValidator } from "@hono/zod-validator";
import { Defuddle } from "defuddle/node";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import puppeteer from "puppeteer-core";
import z from "zod";

const scrapy = new Hono()
  .post(
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
  )
  .get(
    "/scrapyMedia",
    zValidator(
      "query",
      z.object({
        url: z.url(),
      })
    ),
    async (c) => {
      const validated = c.req.valid("query");
      const res = await fetch(validated.url);
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return stream(c, async (stream) => {
        await stream.write(buffer);
      });
    }
  );

export default scrapy;
