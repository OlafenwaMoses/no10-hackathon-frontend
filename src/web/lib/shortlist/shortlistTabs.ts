import type { ShortlistStage } from "@api-types";

export const SHORTLIST_TABS = ["active", "closed", "failed"] as const;
export type ShortlistTab = (typeof SHORTLIST_TABS)[number];

export const SHORTLIST_TAB_LABELS: Record<ShortlistTab, string> = {
  active: "Active",
  closed: "Closed",
  failed: "Failed",
};

export const ACTIVE_STAGES = ["pending", "cleared", "account_managed"] as const satisfies readonly ShortlistStage[];
