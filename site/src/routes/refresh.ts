import type { Context } from "hono";
import type { AppEnv } from "../env";
import { refreshAll } from "../scraper/refresh-all";
import { refreshGuide } from "../scraper/refresh-guide";
import { TRACKED_GUIDES } from "../scraper/tracked-guides";

const encoder = new TextEncoder();

const secretsMatch = (provided: string, expected: string) => {
  const a = encoder.encode(provided);
  const b = encoder.encode(expected);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
};

export const refresh = async (c: Context<AppEnv>) => {
  if (!c.env.INBOUND_SECRET) return c.json({ error: "Refresh is not configured" }, 503);
  const provided = c.req.header("x-inbound-secret") ?? c.req.query("key") ?? "";
  if (!secretsMatch(provided, c.env.INBOUND_SECRET)) return c.json({ error: "Unauthorised" }, 401);

  const basePath = c.req.query("path");
  if (!basePath) return c.json({ results: await refreshAll(c.env) });

  if (!TRACKED_GUIDES.some((guide) => guide.basePath === basePath)) {
    return c.json({ error: `Not a tracked guide: ${basePath}` }, 400);
  }
  const { outcome, stored } = await refreshGuide(c.env, basePath);
  return c.json({ results: [{ basePath, outcome, checkedAt: stored.checkedAt, hash: stored.hash }] });
};
