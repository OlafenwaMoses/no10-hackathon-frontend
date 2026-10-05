import type { Guide, PartChange } from "./types";

export const diffParts = (
  previous: Guide,
  previousHashes: Record<string, string>,
  next: Guide,
  nextHashes: Record<string, string>,
): PartChange[] => {
  const changes: PartChange[] = [];
  for (const part of next.parts) {
    const before = previousHashes[part.slug];
    if (before === undefined) changes.push({ slug: part.slug, title: part.title, change: "added" });
    else if (before !== nextHashes[part.slug]) changes.push({ slug: part.slug, title: part.title, change: "updated" });
  }
  for (const part of previous.parts) {
    if (nextHashes[part.slug] === undefined) changes.push({ slug: part.slug, title: part.title, change: "removed" });
  }
  return changes;
};
