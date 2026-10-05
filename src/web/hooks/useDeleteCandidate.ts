import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

async function deleteCandidate(candidateId: string) {
  return apiFetch<{ ok: true }>(`/candidates/${candidateId}`, { method: "DELETE" });
}

export default function useDeleteCandidate() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteCandidate,
    onSuccess: (_result, candidateId) => {
      queryClient.removeQueries({ queryKey: ["candidate", candidateId] });
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
      void queryClient.invalidateQueries({ queryKey: ["searches"] });
      void queryClient.invalidateQueries({ queryKey: ["shortlist"] });
    },
  });

  return { deleteCandidate: mutateAsync, isDeleting: isPending };
}
