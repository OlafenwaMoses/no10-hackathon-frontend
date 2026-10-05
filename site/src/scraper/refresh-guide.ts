import { changesKey, guideKey, MAX_CHANGES } from "./constants";
import { diffParts } from "./diff-parts";
import { fetchGuide } from "./fetch-guide";
import { hashGuide } from "./hash-guide";
import type { GuideChange, RefreshResult, StoredGuide } from "./types";

export const refreshGuide = async (env: CloudflareBindings, basePath: string): Promise<RefreshResult> => {
  const [guide, previous] = await Promise.all([
    fetchGuide(basePath),
    env.CONTENT.get<StoredGuide>(guideKey(basePath), "json"),
  ]);
  const { hash, partHashes } = await hashGuide(guide);
  const now = new Date().toISOString();

  if (!previous) {
    const stored: StoredGuide = { guide, hash, partHashes, fetchedAt: now, checkedAt: now };
    await env.CONTENT.put(guideKey(basePath), JSON.stringify(stored));
    return { basePath, outcome: "created", stored };
  }

  if (previous.hash === hash) {
    const stored: StoredGuide = { ...previous, guide, checkedAt: now };
    await env.CONTENT.put(guideKey(basePath), JSON.stringify(stored));
    return { basePath, outcome: "unchanged", stored };
  }

  const change: GuideChange = {
    detectedAt: now,
    publicUpdatedAt: guide.publicUpdatedAt,
    parts: diffParts(previous.guide, previous.partHashes, guide, partHashes),
  };
  const history = (await env.CONTENT.get<GuideChange[]>(changesKey(basePath), "json")) ?? [];
  const stored: StoredGuide = { guide, hash, partHashes, fetchedAt: now, checkedAt: now };
  await Promise.all([
    env.CONTENT.put(guideKey(basePath), JSON.stringify(stored)),
    env.CONTENT.put(changesKey(basePath), JSON.stringify([change, ...history].slice(0, MAX_CHANGES))),
  ]);
  return { basePath, outcome: "changed", stored };
};
