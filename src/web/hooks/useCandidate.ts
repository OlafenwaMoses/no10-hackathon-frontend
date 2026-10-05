import { useQuery } from "@tanstack/react-query";
import type { CandidateDetail } from "@api-types";
import { apiFetch } from "../lib/api";
import { isCandidateProcessing } from "../lib/status";

async function fetchCandidate(candidateId: string) {
  return apiFetch<CandidateDetail>(`/candidates/${candidateId}`);
}

export default function useCandidate(candidateId: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["candidate", candidateId],
    queryFn: () => fetchCandidate(candidateId ?? ""),
    enabled: !!candidateId,
    refetchInterval: (query) =>
      query.state.data && isCandidateProcessing(query.state.data.status) ? 4000 : false,
  });

  return { candidate: data, isLoading, error };
}
