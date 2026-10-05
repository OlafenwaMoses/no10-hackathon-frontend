import { useQuery } from "@tanstack/react-query";
import type { SearchListItem } from "@api-types";
import { apiFetch } from "../lib/api";
import { isSearchActive } from "../lib/status";

async function fetchSearches() {
  return apiFetch<SearchListItem[]>("/searches");
}

export default function useSearches() {
  const { data, isLoading } = useQuery({
    queryKey: ["searches"],
    queryFn: fetchSearches,
    refetchInterval: (query) =>
      query.state.data?.some((search) => isSearchActive(search.status)) ? 5000 : false,
  });

  return { searches: data, isLoading };
}
