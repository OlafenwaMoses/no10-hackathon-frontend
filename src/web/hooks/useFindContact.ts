import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CandidateDetail, ContactDetails } from "@api-types";
import { apiFetch } from "../lib/api";

async function findContact(candidateId: string) {
  return apiFetch<ContactDetails>(`/candidates/${candidateId}/contact`, { method: "POST" });
}

export default function useFindContact() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: findContact,
    onSuccess: (contact, candidateId) => {
      queryClient.setQueryData<CandidateDetail>(["candidate", candidateId], (previous) =>
        previous ? { ...previous, contact } : previous,
      );
    },
  });

  return { findContact: mutateAsync, isStarting: isPending };
}
