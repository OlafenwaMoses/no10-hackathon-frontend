import { changesKey, guideKey, STALE_AFTER_MS } from "./constants";
import { refreshGuide } from "./refresh-guide";
import type { GuideChange, StoredGuide } from "./types";

const isStale = (stored: StoredGuide) => Date.now() - Date.parse(stored.checkedAt) > STALE_AFTER_MS;

type WaitUntil = { waitUntil(promise: Promise<unknown>): void };

export const loadGuide = async (env: CloudflareBindings, ctx: WaitUntil, basePath: string) => {
  const [cached, changes] = await Promise.all([
    env.CONTENT.get<StoredGuide>(guideKey(basePath), "json"),
    env.CONTENT.get<GuideChange[]>(changesKey(basePath), "json"),
  ]);
  if (cached) {
    if (isStale(cached)) ctx.waitUntil(refreshGuide(env, basePath).catch((error) => console.error(error)));
    return { stored: cached, changes: changes ?? [] };
  }
  const { stored } = await refreshGuide(env, basePath);
  return { stored, changes: changes ?? [] };
};
