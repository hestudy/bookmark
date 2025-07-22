import { zValidator } from "@hono/zod-validator";
import { Defuddle } from "defuddle/node";
import { Hono } from "hono";
import { JSDOM } from "jsdom";
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
    const dom = await JSDOM.fromURL(validated.url);
    const result = await Defuddle(dom, validated.url, {
      separateMarkdown: true,
    });
    return c.json(result);
  }
);

export default scrapy;
