import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatBody, ChatMessage, ChatResponse } from "@api-types";
import { apiFetch } from "../lib/api";

async function fetchChat(candidateId: string) {
  return apiFetch<ChatMessage[]>(`/candidates/${candidateId}/chat`);
}

async function postChat(candidateId: string, body: ChatBody) {
  return apiFetch<ChatResponse>(`/candidates/${candidateId}/chat`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export default function useCandidateChat(candidateId: string | undefined, enabled = true) {
  const queryClient = useQueryClient();
  const queryKey = ["candidate-chat", candidateId];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchChat(candidateId ?? ""),
    enabled: !!candidateId && enabled,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (messages: ChatMessage[]) => postChat(candidateId ?? "", { messages }),
    onMutate: async (messages) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ChatMessage[]>(queryKey) ?? [];
      queryClient.setQueryData<ChatMessage[]>(queryKey, messages);
      return { previous };
    },
    onError: (_error, _messages, context) => {
      if (context) queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: (response, messages) => {
      queryClient.setQueryData<ChatMessage[]>(queryKey, [
        ...messages,
        { role: "model", content: response.reply },
      ]);
    },
  });

  const messages = data ?? [];

  const sendMessage = (content: string) =>
    mutateAsync([...messages, { role: "user", content }]);

  return { messages, isLoading, sendMessage, isSending: isPending };
}
