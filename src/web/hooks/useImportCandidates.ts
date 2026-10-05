import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImportBody, ImportResponse } from "@api-types";
import { apiFetch } from "../lib/api";

async function importCandidates(body: ImportBody) {
  return apiFetch<ImportResponse>("/candidates/import", { method: "POST", body: JSON.stringify(body) });
}

export default function useImportCandidates() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: importCandidates,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["searches"] });
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      void queryClient.invalidateQueries({ queryKey: ["shortlist"] });
    },
  });

  return { importCandidates: mutateAsync, isImporting: isPending };
}
