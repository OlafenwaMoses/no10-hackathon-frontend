type RawPart = { slug: string; title: string; body: string };

export type RawGuide = {
  basePath: string;
  title: string;
  description: string;
  publicUpdatedAt: string;
  parts: RawPart[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const parsePart = (value: unknown): RawPart | null => {
  if (!isRecord(value)) return null;
  const slug = text(value.slug);
  const body = typeof value.body === "string" ? value.body : "";
  if (!slug || !body) return null;
  return { slug, title: text(value.title) || slug, body };
};

export const parseContentItem = (json: unknown, basePath: string): RawGuide => {
  if (!isRecord(json)) throw new Error(`Unexpected response for ${basePath}`);
  const details = isRecord(json.details) ? json.details : {};
  const rawParts = Array.isArray(details.parts) ? details.parts : [];
  const parts = rawParts.map(parsePart).filter((part): part is RawPart => part !== null);
  if (parts.length === 0) throw new Error(`No guide parts found for ${basePath}`);
  return {
    basePath: text(json.base_path) || basePath,
    title: text(json.title),
    description: text(json.description),
    publicUpdatedAt: text(json.public_updated_at),
    parts,
  };
};
