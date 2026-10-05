export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function backoffDelay(attempt: number, baseMs = 1000) {
  return baseMs * 2 ** (attempt - 1) * (0.5 + Math.random());
}

export async function withRetries<T>(attempts: number, fn: (attempt: number) => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(backoffDelay(attempt));
    }
  }
  throw lastError;
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
