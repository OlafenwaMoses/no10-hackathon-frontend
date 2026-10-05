import { refreshGuide } from "./refresh-guide";
import { TRACKED_GUIDES } from "./tracked-guides";

export const refreshAll = async (env: CloudflareBindings) => {
  const results = await Promise.allSettled(TRACKED_GUIDES.map((guide) => refreshGuide(env, guide.basePath)));
  return results.map((result, index) => ({
    basePath: TRACKED_GUIDES[index]?.basePath ?? "",
    outcome: result.status === "fulfilled" ? result.value.outcome : "failed",
    error: result.status === "rejected" ? String(result.reason) : undefined,
  }));
};
