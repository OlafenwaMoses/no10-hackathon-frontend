import type { CandidateStatus, SearchStatus } from "@api-types";

export function isCandidateProcessing(status: CandidateStatus) {
  return status !== "scored" && status !== "failed";
}

export function isSearchActive(status: SearchStatus) {
  return status === "queued" || status === "discovering" || status === "processing";
}
