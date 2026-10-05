export type GuidePart = { slug: string; title: string; html: string };

export type Guide = {
  basePath: string;
  title: string;
  description: string;
  publicUpdatedAt: string;
  parts: GuidePart[];
};

export type StoredGuide = {
  guide: Guide;
  hash: string;
  partHashes: Record<string, string>;
  fetchedAt: string;
  checkedAt: string;
};

export const PART_CHANGE_KINDS = ["added", "removed", "updated"] as const;

export type PartChange = { slug: string; title: string; change: (typeof PART_CHANGE_KINDS)[number] };

export type GuideChange = { detectedAt: string; publicUpdatedAt: string; parts: PartChange[] };

export type RefreshOutcome = "created" | "unchanged" | "changed";

export type RefreshResult = { basePath: string; outcome: RefreshOutcome; stored: StoredGuide };
