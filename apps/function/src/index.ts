import { serve } from "@hono/node-server";
import { Hono } from "hono";
import scrapy from "./scrapy.js";

const app = new Hono();

const router = app.route("/scrapy", scrapy);

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
