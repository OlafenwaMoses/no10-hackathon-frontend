import { useQuery } from "@tanstack/react-query";
import type { Stats } from "@api-types";
import { apiFetch } from "../lib/api";

async function fetchStats() {
  return apiFetch<Stats>("/stats");
}

export default function useStats({ live = false }: { live?: boolean } = {}) {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: live ? 5000 : false,
  });

  return { stats: data, isLoading };
}
