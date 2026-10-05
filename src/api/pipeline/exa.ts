import { backoffDelay, sleep } from "./retry";

const EXA_BASE_URL = "https://api.exa.ai";
const MAX_ATTEMPTS = 4;

function retryAfterMs(header: string | null, attempt: number) {
  const seconds = header ? Number(header) : Number.NaN;
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 60_000);
  const date = header ? Date.parse(header) : Number.NaN;
  if (Number.isFinite(date)) return Math.min(Math.max(date - Date.now(), 0), 60_000);
  return backoffDelay(attempt, 2000);
}

export async function exaRequest<T>(apiKey: string, path: string, body?: unknown): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(`${EXA_BASE_URL}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.ok) return (await response.json()) as T;

    const text = await response.text();
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= MAX_ATTEMPTS) {
      throw new Error(`Exa ${path} failed (${response.status}): ${text.slice(0, 1000)}`);
    }
    await sleep(retryAfterMs(response.headers.get("retry-after"), attempt));
  }
}
