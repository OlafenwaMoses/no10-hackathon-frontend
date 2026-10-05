import type { Theme } from "@emotion/react";
import type {
  NetWorth,
  OutreachStatus,
  Rag,
  ResidenceRegion,
  Resolved,
  Sector,
  ShortlistStage,
  TalentCategory,
  UkLinkVerdict,
} from "@api-types";

export type Tone = "neutral" | "blue" | "green" | "amber" | "rose" | "violet" | "teal" | "danger";

export const CATEGORY_TONES: Record<TalentCategory, Tone> = {
  founder: "blue",
  investor: "green",
  highly_talented: "violet",
  hnwi: "amber",
  c_suite: "rose",
  researcher: "teal",
};

export const SECTOR_TONES: Record<Sector, Tone> = {
  digital_tech: "blue",
  ai: "violet",
  life_sciences: "rose",
  clean_energy: "green",
  pan_economy: "amber",
  other: "neutral",
};

export const REGION_TONES: Record<ResidenceRegion, Tone> = {
  usa: "blue",
  india: "amber",
  uk: "teal",
  singapore: "violet",
  brazil: "green",
  americas_other: "blue",
  europe: "rose",
  asia_other: "amber",
  other: "neutral",
};

export const VERDICT_TONES: Record<UkLinkVerdict, Tone> = {
  strong: "green",
  some: "amber",
  none_found: "neutral",
  cannot_verify: "neutral",
};

export const OUTREACH_TONES: Record<OutreachStatus, Tone> = {
  not_contacted: "neutral",
  contacted: "blue",
  in_conversation: "violet",
  converted: "green",
  declined: "rose",
};

export const CONFIDENCE_TONES: Record<NetWorth["confidence"], Tone> = {
  high: "green",
  medium: "amber",
  low: "neutral",
};

export const SHORTLIST_STAGE_TONES: Record<ShortlistStage, Tone> = {
  pending: "amber",
  cleared: "blue",
  account_managed: "violet",
  closed: "green",
  failed: "rose",
};

export const RAG_TONES: Record<Rag, Tone> = {
  green: "green",
  amber: "amber",
  red: "danger",
};

export const RESOLVED_TONES: Record<Resolved, Tone> = {
  yes: "green",
  partially: "amber",
  no: "rose",
};

export function toneForeground(theme: Theme, tone: Tone) {
  const map: Record<Tone, string> = {
    neutral: theme.textSecondary,
    blue: theme.toneBlueFg,
    green: theme.toneGreenFg,
    amber: theme.toneAmberFg,
    rose: theme.toneRoseFg,
    violet: theme.toneVioletFg,
    teal: theme.toneTealFg,
    danger: theme.danger,
  };
  return map[tone];
}
