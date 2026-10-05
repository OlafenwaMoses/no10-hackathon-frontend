import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShortlistEntry } from "@api-types";
import { apiFetch } from "../lib/api";

async function addToShortlist(candidateId: string) {
  return apiFetch<ShortlistEntry>("/shortlist", { method: "POST", body: JSON.stringify({ candidateId }) });
}

export default function useAddToShortlist() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: addToShortlist,
    onSuccess: (_entry, candidateId) => {
      void queryClient.invalidateQueries({ queryKey: ["shortlist"] });
      void queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] });
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });

  return { addToShortlist: mutateAsync, isAdding: isPending };
}
