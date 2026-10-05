function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").trim();
  return "";
}
