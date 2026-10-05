import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ShortlistEntry, ShortlistItem, UpdateShortlistBody } from "@api-types";
import { apiFetch } from "../lib/api";
import { SHORTLIST_ITEMS_KEY } from "./useShortlist";

type UpdateVariables = { entryId: string; body: UpdateShortlistBody };

async function updateShortlistEntry({ entryId, body }: UpdateVariables) {
  return apiFetch<ShortlistEntry>(`/shortlist/${entryId}`, { method: "PATCH", body: JSON.stringify(body) });
}

export default function useUpdateShortlistEntry() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateShortlistEntry,
    onMutate: async ({ entryId, body }) => {
      await queryClient.cancelQueries({ queryKey: SHORTLIST_ITEMS_KEY });
      const previous = queryClient.getQueryData<ShortlistItem[]>(SHORTLIST_ITEMS_KEY);
      queryClient.setQueryData<ShortlistItem[]>(SHORTLIST_ITEMS_KEY, (items) =>
        items?.map((item) =>
          item.id === entryId
            ? {
                ...item,
                ...body,
                candidate: body.stage ? { ...item.candidate, shortlistStage: body.stage } : item.candidate,
              }
            : item,
        ),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(SHORTLIST_ITEMS_KEY, context.previous);
    },
    onSuccess: (entry) => {
      void queryClient.invalidateQueries({ queryKey: ["candidate", entry.candidateId] });
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      void queryClient.invalidateQueries({ queryKey: ["search"] });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["shortlist"] });
    },
  });

  return { updateEntry: mutateAsync, isSaving: isPending };
}
