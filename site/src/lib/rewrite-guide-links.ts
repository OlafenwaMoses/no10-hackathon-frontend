import { TRACKED_GUIDES } from "../scraper/tracked-guides";
import type { Guide } from "../scraper/types";

const GOVUK_LINK = /href="https:\/\/www\.gov\.uk(\/[^"#?]*)(#[^"]*)?"/g;

export const rewriteGuideLinks = (html: string, guide: Guide, slug: string) => {
  const partSlugs = new Set(guide.parts.map((part) => part.slug));
  return html.replace(GOVUK_LINK, (match, path: string, hash: string | undefined) => {
    const anchor = hash ?? "";
    if (path === guide.basePath) return `href="/visas/${slug}${anchor}"`;
    const prefix = `${guide.basePath}/`;
    if (path.startsWith(prefix) && partSlugs.has(path.slice(prefix.length))) {
      return `href="/visas/${slug}/${path.slice(prefix.length)}${anchor}"`;
    }
    const tracked = TRACKED_GUIDES.find((item) => item.basePath === path);
    return tracked ? `href="/visas/${tracked.slug}${anchor}"` : match;
  });
};
