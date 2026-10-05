import type { Context } from "hono";
import type { AppEnv } from "../env";
import { GuidePage } from "../pages/visas/GuidePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ServerErrorPage } from "../pages/ServerErrorPage";
import { loadGuide } from "../scraper/load-guide";
import { findTrackedGuide } from "../scraper/tracked-guides";

export const getGuide = async (c: Context<AppEnv>) => {
  const tracked = findTrackedGuide(c.req.param("guide") ?? "");
  if (!tracked) return c.html(<NotFoundPage path={c.req.path} />, 404);

  try {
    const { stored, changes } = await loadGuide(c.env, c.executionCtx, tracked.basePath);
    const partSlug = c.req.param("part");
    const part = partSlug ? stored.guide.parts.find((item) => item.slug === partSlug) : stored.guide.parts[0];
    if (!part) return c.html(<NotFoundPage path={c.req.path} />, 404);
    if (partSlug && part.slug === stored.guide.parts[0]?.slug) return c.redirect(`/visas/${tracked.slug}`, 301);
    return c.html(<GuidePage tracked={tracked} stored={stored} changes={changes} part={part} path={c.req.path} />);
  } catch (error) {
    console.error(error);
    return c.html(
      <ServerErrorPage
        path={c.req.path}
        heading="Sorry, we could not load this guide"
        message={`We could not reach GOV.UK just now. You can read the ${tracked.name} guide directly at https://www.gov.uk${tracked.basePath}.`}
      />,
      503,
    );
  }
};
