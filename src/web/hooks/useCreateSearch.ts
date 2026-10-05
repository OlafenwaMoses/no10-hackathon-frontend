import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSearchBody, SearchListItem } from "@api-types";
import { apiFetch } from "../lib/api";

async function createSearch(body: CreateSearchBody) {
  return apiFetch<SearchListItem>("/searches", { method: "POST", body: JSON.stringify(body) });
}

export default function useCreateSearch() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createSearch,
    onSuccess: (search) => {
      queryClient.setQueryData<SearchListItem[]>(["searches"], (previous) =>
        previous ? [search, ...previous.filter((item) => item.id !== search.id)] : previous,
      );
      void queryClient.invalidateQueries({ queryKey: ["searches"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  return { createSearch: mutateAsync, isCreating: isPending };
}
