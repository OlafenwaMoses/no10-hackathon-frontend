import type { InterviewAnswer } from "@api-types";

export function answerShares(answer: InterviewAnswer) {
  const values = Array.from({ length: answer.options.length }, (_, index) => Math.max(0, answer.probs[index] ?? 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  return total > 0 ? values.map((value) => value / total) : values;
}

export function expectedScore(answer: InterviewAnswer) {
  const shares = answerShares(answer);
  const meanIndex = shares.reduce((sum, share, position) => sum + share * position, 0);
  const fallback = answer.options.length > 1 ? (meanIndex / (answer.options.length - 1)) * 100 : 50;
  return Math.max(0, Math.min(100, answer.expected ?? fallback));
}

export function topOption(answer: InterviewAnswer) {
  const shares = answerShares(answer);
  if (shares.length === 0) return null;
  const index = shares.indexOf(Math.max(...shares));
  return { label: answer.options[index] ?? null, share: shares[index] ?? 0 };
}
