import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { CandidateListItem, CandidateStatus, GttCriteria, ResidenceRegion, Sector, TalentCategory } from "@api-types";
import { apiFetch } from "../lib/api";
import { isCandidateProcessing } from "../lib/status";

export type CandidateFilters = {
  q?: string;
  category?: TalentCategory;
  sector?: Sector;
  criteria?: GttCriteria;
  region?: ResidenceRegion;
  status?: CandidateStatus;
  searchId?: string;
};

async function fetchCandidates(filters: CandidateFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return apiFetch<CandidateListItem[]>(`/candidates${query ? `?${query}` : ""}`);
}

export default function useCandidates(filters: CandidateFilters) {
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["candidates", filters],
    queryFn: () => fetchCandidates(filters),
    placeholderData: keepPreviousData,
    refetchInterval: (query) =>
      query.state.data?.some((candidate) => isCandidateProcessing(candidate.status)) ? 5000 : false,
  });

  const isProcessing = data?.some((candidate) => isCandidateProcessing(candidate.status)) ?? false;

  return { candidates: data, isLoading, isFiltering: isPlaceholderData, isProcessing };
}
