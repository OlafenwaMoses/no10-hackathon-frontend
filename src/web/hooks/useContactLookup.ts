import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { CandidateDetail, ContactDetails } from "@api-types";
import { apiFetch } from "../lib/api";

const POLL_MS = 4000;

export default function useContactLookup(candidateId: string, searching: boolean) {
  const queryClient = useQueryClient();

  useQuery({
    queryKey: ["candidate-contact", candidateId],
    queryFn: async () => {
      const contact = await apiFetch<ContactDetails | null>(`/candidates/${candidateId}/contact`);
      queryClient.setQueryData<CandidateDetail>(["candidate", candidateId], (previous) =>
        previous ? { ...previous, contact } : previous,
      );
      return contact;
    },
    enabled: searching,
    refetchInterval: searching ? POLL_MS : false,
    gcTime: 0,
  });
}
