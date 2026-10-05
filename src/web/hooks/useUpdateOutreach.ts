import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateOutreachBody } from "@api-types";
import { apiFetch } from "../lib/api";

async function updateOutreach(candidateId: string, body: UpdateOutreachBody) {
  return apiFetch<{ ok: true }>(`/candidates/${candidateId}/outreach`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export default function useUpdateOutreach(candidateId: string) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: UpdateOutreachBody) => updateOutreach(candidateId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] });
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      void queryClient.invalidateQueries({ queryKey: ["shortlist"] });
    },
  });

  return { updateOutreach: mutateAsync, isSaving: isPending };
}
