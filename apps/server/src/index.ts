import { createContext } from "@chronicles-of-all-creation/api/context";
import { appRouter } from "@chronicles-of-all-creation/api/routers/index";
import { env } from "@chronicles-of-all-creation/env/server";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { trpcServer } from "@hono/trpc-server";
import { readFileSync } from "node:fs";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

// Docker WORKDIR=/app — same layout as the Coolify Bun+turbo images
const webDistRoot = "apps/web/dist";

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/healthz", (c) => c.json({ ok: true }));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

app.use("/*", serveStatic({ root: webDistRoot }));

// SPA fallback for TanStack Router client routes (/quests, etc.)
app.get("/*", (c) => {
  const html = readFileSync(`${webDistRoot}/index.html`, "utf8");
  return c.html(html);
});

serve(
  {
    fetch: app.fetch,
    port,
    hostname,
  },
  (info) => {
    console.log(`Server listening on http://${hostname}:${info.port}`);
    console.log(`Serving web assets from ${webDistRoot}`);
  },
);
