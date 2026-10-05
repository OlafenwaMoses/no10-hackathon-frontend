import { useQuery } from "@tanstack/react-query";
import type { ShortlistItem } from "@api-types";
import { apiFetch } from "../lib/api";

export const SHORTLIST_ITEMS_KEY = ["shortlist", "items"] as const;

async function fetchShortlist() {
  return apiFetch<ShortlistItem[]>("/shortlist");
}

export default function useShortlist() {
  const { data, isLoading, error } = useQuery({
    queryKey: SHORTLIST_ITEMS_KEY,
    queryFn: fetchShortlist,
  });

  return { items: data, isLoading, error };
}
