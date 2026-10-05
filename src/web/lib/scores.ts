export type ScoreBand = "high" | "medium" | "low";

export function toPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function scoreBand(value: number): ScoreBand {
  const percent = toPercent(value);
  if (percent >= 70) return "high";
  if (percent >= 45) return "medium";
  return "low";
}

export const SCORE_BAND_LABELS: Record<ScoreBand, string> = {
  high: "High priority",
  medium: "Worth approaching",
  low: "Low priority",
};
