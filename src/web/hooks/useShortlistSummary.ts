import { useQuery } from "@tanstack/react-query";
import type { ShortlistSummary } from "@api-types";
import { apiFetch } from "../lib/api";

async function fetchShortlistSummary() {
  return apiFetch<ShortlistSummary>("/shortlist/summary");
}

export default function useShortlistSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ["shortlist", "summary"],
    queryFn: fetchShortlistSummary,
  });

  return { summary: data, isLoading };
}
