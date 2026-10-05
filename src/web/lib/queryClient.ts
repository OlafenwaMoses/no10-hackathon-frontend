import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";
import useStore from "../hooks/useStore";

function isUnauthorised(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

function handleError(error: unknown) {
  if (isUnauthorised(error)) useStore.getState().setPasswordRequired(true);
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleError }),
  mutationCache: new MutationCache({ onError: handleError }),
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60,
      staleTime: 1000 * 10,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => !isUnauthorised(error) && failureCount < 2,
    },
  },
});
