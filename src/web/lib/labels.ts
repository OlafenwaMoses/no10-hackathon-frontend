import type { CandidateStatus, ResolutionMethod, SearchStatus, UkLinkVerdict } from "@api-types";

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
