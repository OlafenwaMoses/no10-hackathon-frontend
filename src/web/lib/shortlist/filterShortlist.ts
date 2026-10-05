import type { Rag, ShortlistItem, ShortlistStage } from "@api-types";
import tabForStage from "./tabForStage";
import type { ShortlistTab } from "./shortlistTabs";

export type ShortlistFilters = {
  tab?: ShortlistTab;
  q?: string;
  manager?: string;
  stage?: ShortlistStage;
  rag?: Rag;
};

export default function filterShortlist(items: ShortlistItem[], filters: ShortlistFilters) {
  const tab = filters.tab ?? "active";
  const query = filters.q?.trim().toLowerCase();
  return items.filter((item) => {
    if (tabForStage(item.stage) !== tab) return false;
    if (filters.stage && tab === "active" && item.stage !== filters.stage) return false;
    if (filters.manager && item.accountManager !== filters.manager) return false;
    if (filters.rag && item.successRag !== filters.rag) return false;
    if (!query) return true;
    return [
      item.candidate.name,
      item.candidate.organisation,
      item.candidate.title,
      item.accountManager,
      item.relationshipHolder,
      item.nextStep,
      item.outcome,
      item.failureReason,
    ].some((value) => value?.toLowerCase().includes(query));
  });
}
