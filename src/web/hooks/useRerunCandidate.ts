import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CandidateDetail } from "@api-types";
import { apiFetch } from "../lib/api";

async function rerunCandidate(candidateId: string) {
  return apiFetch<{ ok: true }>(`/candidates/${candidateId}/rerun`, { method: "POST" });
}

export default function useRerunCandidate() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: rerunCandidate,
    onSuccess: (_result, candidateId) => {
      queryClient.setQueryData<CandidateDetail>(["candidate", candidateId], (previous) =>
        previous ? { ...previous, status: "discovered", error: null } : previous,
      );
      void queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] });
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });

  return { rerunCandidate: mutateAsync, isRerunning: isPending };
}
