import { FatalError, RetryableError, getStepMetadata } from "workflow";
import { errorMessage } from "../pipeline/retry";

const FIRST_RETRY_DELAY_MS = 10_000;

export async function withBackoff<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (FatalError.is(error)) throw error;
    const { attempt } = getStepMetadata();
    throw new RetryableError(errorMessage(error), { retryAfter: FIRST_RETRY_DELAY_MS * 2 ** (attempt - 1) });
  }
}
