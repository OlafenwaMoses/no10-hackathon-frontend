import { sha256 } from "./hash";
import type { Guide } from "./types";

export const hashGuide = async (guide: Guide) => {
  const partEntries = await Promise.all(
    guide.parts.map(async (part) => [part.slug, await sha256(`${part.title}\n${part.html}`)] as const),
  );
  const partHashes = Object.fromEntries(partEntries);
  const hash = await sha256(JSON.stringify([guide.title, partEntries]));
  return { hash, partHashes };
};
