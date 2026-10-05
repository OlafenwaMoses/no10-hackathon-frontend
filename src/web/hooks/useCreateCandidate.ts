import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CandidateListItem, ManualCandidateBody } from "@api-types";
import { apiFetch } from "../lib/api";

async function createCandidate(body: ManualCandidateBody) {
  return apiFetch<CandidateListItem>("/candidates", { method: "POST", body: JSON.stringify(body) });
}

export default function useCreateCandidate() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCandidate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  return { createCandidate: mutateAsync, isCreating: isPending };
}
