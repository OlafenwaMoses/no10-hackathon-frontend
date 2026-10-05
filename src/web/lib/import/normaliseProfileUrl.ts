export default function normaliseProfileUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return undefined;
  if (/^https?:\/\/\S+\.\S+/i.test(trimmed)) return trimmed;
  if (/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+\/\S*/i.test(trimmed)) return `https://${trimmed}`;
  return undefined;
}
