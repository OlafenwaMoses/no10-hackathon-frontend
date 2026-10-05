const formatter = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

export default function formatRelativeTime(iso: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  if (!Number.isFinite(seconds)) return "";
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
