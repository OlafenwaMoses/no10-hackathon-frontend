import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

type RemoveVariables = { entryId: string; candidateId: string };

async function removeFromShortlist({ entryId }: RemoveVariables) {
  return apiFetch<{ ok: true }>(`/shortlist/${entryId}`, { method: "DELETE" });
}

export default function useRemoveFromShortlist() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: removeFromShortlist,
    onSuccess: (_result, { candidateId }) => {
      void queryClient.invalidateQueries({ queryKey: ["shortlist"] });
      void queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] });
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });

  return { removeFromShortlist: mutateAsync, isRemoving: isPending };
}
