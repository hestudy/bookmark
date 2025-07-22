import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { JSDOM } from "jsdom";
import { Defuddle } from "defuddle/node";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const router = app.post(
  "/posts",
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
      debug: true,
      markdown: true,
    });
    return c.json(result);
  }
);

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export type BookmarkFunction = typeof router;
