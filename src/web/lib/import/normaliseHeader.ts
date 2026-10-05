export default function normaliseHeader(value: string) {
  const firstLine = value.split(/\r?\n/).find((line) => line.trim()) ?? "";
  return firstLine.replace(/\s+/g, " ").trim().toLowerCase();
}
