import { GOVUK_ORIGIN, USER_AGENT } from "./constants";
import { parseContentItem } from "./parse-content-item";
import { sanitiseHtml } from "./sanitise-html";
import type { Guide } from "./types";

export const fetchGuide = async (basePath: string): Promise<Guide> => {
  const response = await fetch(`${GOVUK_ORIGIN}/api/content${basePath}`, {
    headers: { "user-agent": USER_AGENT, accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GOV.UK Content API returned ${response.status} for ${basePath}`);
  const raw = parseContentItem(await response.json(), basePath);
  const parts = await Promise.all(
    raw.parts.map(async (part) => ({ slug: part.slug, title: part.title, html: await sanitiseHtml(part.body) })),
  );
  return { ...raw, parts };
};
