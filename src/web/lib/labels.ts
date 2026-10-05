import type {
  CandidateStatus,
  NetWorth,
  Rag,
  Resolved,
  ResolutionMethod,
  SearchStatus,
  ShortlistStage,
  UkLinkVerdict,
} from "@api-types";

export {
  TALENT_CATEGORIES,
  TALENT_CATEGORY_LABELS,
  SECTORS,
  SECTOR_LABELS,
  SEARCH_SECTORS,
  SEARCH_REGIONS,
  GTT_CRITERIA,
  GTT_CRITERIA_LABELS,
  RESIDENCE_REGIONS,
  RESIDENCE_REGION_LABELS,
  GTT_LEVER_LABELS,
  UK_LINK_TYPE_LABELS,
  CANDIDATE_STATUSES,
  OUTREACH_STATUSES,
  OUTREACH_STATUS_LABELS,
  NET_WORTH_BAND_LABELS,
  SHORTLIST_STAGES,
  SHORTLIST_STAGE_LABELS,
  RAG_VALUES,
  SUPPORT_LEVELS,
  SUPPORT_LEVEL_LABELS,
  BACKGROUND_CHECKS,
  BACKGROUND_CHECK_LABELS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  ISSUE_CATEGORIES,
  ISSUE_CATEGORY_LABELS,
  RESOLVED_VALUES,
  SUCCESS_CATEGORIES,
  SUCCESS_CATEGORY_LABELS,
  ALL,
  ALL_CATEGORIES_LABEL,
  ALL_SECTORS_LABEL,
} from "@api-types";

export const UK_LINK_VERDICT_LABELS: Record<UkLinkVerdict, string> = {
  strong: "Strong",
  some: "Some",
  none_found: "None found",
  cannot_verify: "Unverified",
};

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  discovered: "Queued",
  resolving: "Finding profile",
  enriching: "Researching UK links",
  building_persona: "Building persona",
  interviewing: "Interviewing",
  scoring: "Scoring",
  scored: "Scored",
  failed: "Failed",
};

export const CANDIDATE_STATUS_SHORT_LABELS: Record<CandidateStatus, string> = {
  discovered: "Queued",
  resolving: "Resolving",
  enriching: "Enriching",
  building_persona: "Persona",
  interviewing: "Interviewing",
  scoring: "Scoring",
  scored: "Scored",
  failed: "Failed",
};

export const SEARCH_STATUS_LABELS: Record<SearchStatus, string> = {
  queued: "Queued",
  discovering: "Discovering",
  processing: "Processing",
  complete: "Complete",
  failed: "Failed",
};

export const RESOLUTION_METHOD_LABELS: Record<ResolutionMethod, string> = {
  reverse_contact_url: "Reverse Contact (LinkedIn URL)",
  reverse_contact_name: "Reverse Contact (name and company)",
  exa: "Exa people search",
  manual_only: "officer details only",
};

export const NET_WORTH_CONFIDENCE_LABELS: Record<NetWorth["confidence"], string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

export const INTERVIEW_QUESTION_SHORT_LABELS: Partial<Record<string, string>> = {
  relocate_self: "Would relocate to the UK",
  expand_uk: "Would expand in the UK",
  uk_attractiveness: "UK attractiveness",
  top_lever: "Most persuasive lever",
  biggest_barrier: "Biggest barrier",
  gut_reaction: "Gut reaction",
};

export const SHORTLIST_STAGE_SHORT_LABELS: Record<ShortlistStage, string> = {
  pending: "Pending",
  cleared: "Cleared",
  account_managed: "Account managed",
  closed: "Closed",
  failed: "Failed",
};

export const RAG_LABELS: Record<Rag, string> = {
  green: "Green",
  amber: "Amber",
  red: "Red",
};

export const RESOLVED_LABELS: Record<Resolved, string> = {
  yes: "Yes",
  partially: "Partially",
  no: "No",
};
