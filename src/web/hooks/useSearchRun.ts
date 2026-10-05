import { useQuery } from "@tanstack/react-query";
import type { SearchDetail } from "@api-types";
import { apiFetch } from "../lib/api";
import { isCandidateProcessing, isSearchActive } from "../lib/status";

async function fetchSearch(searchId: string) {
  return apiFetch<SearchDetail>(`/searches/${searchId}`);
}

function isLive(search: SearchDetail | undefined) {
  if (!search) return false;
  return (
    isSearchActive(search.status) ||
    search.candidates.some((candidate) => isCandidateProcessing(candidate.status))
  );
}

export default function useSearchRun(searchId: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", searchId],
    queryFn: () => fetchSearch(searchId ?? ""),
    enabled: !!searchId,
    refetchInterval: (query) => (isLive(query.state.data) ? 4000 : false),
  });

  return { search: data, isLoading, error, isLive: isLive(data) };
}
