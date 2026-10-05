import type { Context } from "hono";
import { candidates, searches, shortlistEntries } from "../../db/schema";
import { normaliseCategory, normaliseSector, normaliseTracker } from "../../lib/normalise-import";
import { normaliseProfileUrl } from "../../pipeline/discover";
import { ALL, MAX_IMPORT_ROWS, type ImportBody, type ImportResponse } from "../../types";
import type { AppEnv } from "../../index";

function clean(value: string | undefined) {
  return value?.toString().trim() || null;
}

function personKey(name: string, organisation: string | null) {
  return `${name.toLowerCase().replace(/\s+/g, " ")}|${(organisation ?? "").toLowerCase().replace(/\s+/g, " ")}`;
}

function toProfileUrl(raw: string | null) {
  if (!raw || !/[a-z0-9-]+\.[a-z]{2,}/i.test(raw) || /\s/.test(raw)) return null;
  return normaliseProfileUrl(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
}

export async function importCandidates(c: Context<AppEnv>) {
  const { db } = c.var;
  const body = await c.req.json<ImportBody>();
  const fileName = clean(body.fileName) ?? "spreadsheet";
  const rows = Array.isArray(body.rows) ? body.rows : [];

  if (rows.length === 0) return c.json({ error: "No rows to import" }, 400);
  if (rows.length > MAX_IMPORT_ROWS) return c.json({ error: `Import at most ${MAX_IMPORT_ROWS} people at a time` }, 400);

  const prepared = rows.map((row) => {
    const name = clean(row.name);
    const organisation = clean(row.organisation);
    const nationality = clean(row.nationality);
    const notes = [clean(row.notes), nationality ? `Nationality: ${nationality}` : null].filter(Boolean).join("\n");
    return {
      name,
      organisation,
      title: clean(row.title),
      profileUrl: toProfileUrl(clean(row.profileUrl)),
      location: clean(row.location),
      nationality,
      notes: notes || null,
      category: normaliseCategory(row.category) ?? "highly_talented",
      sector: normaliseSector(row.sector) ?? "other",
      tracker: normaliseTracker(row.tracker),
    };
  });

  const existing = await db
    .select({ profileUrl: candidates.profileUrl, name: candidates.name, organisation: candidates.organisation })
    .from(candidates);

  const seenUrls = new Set(existing.map((row) => row.profileUrl).filter(Boolean));
  const seenKeys = new Set(existing.map((row) => personKey(row.name, row.organisation)));
  const skipped: ImportResponse["skipped"] = [];
  const toCreate: (typeof prepared[number] & { name: string })[] = [];

  for (const row of prepared) {
    if (!row.name) {
      skipped.push({ name: "(no name)", reason: "Missing name" });
      continue;
    }
    const key = personKey(row.name, row.organisation);
    if ((row.profileUrl && seenUrls.has(row.profileUrl)) || seenKeys.has(key)) {
      skipped.push({ name: row.name, reason: "Already in the talent database" });
      continue;
    }
    if (row.profileUrl) seenUrls.add(row.profileUrl);
    seenKeys.add(key);
    toCreate.push({ ...row, name: row.name });
  }

  if (toCreate.length === 0) return c.json({ searchId: null, created: 0, skipped } satisfies ImportResponse);

  const [search] = await db
    .insert(searches)
    .values({
      kind: "import",
      name: `Import · ${fileName}`,
      category: ALL,
      sector: ALL,
      query: `Imported from ${fileName}`,
      numResults: toCreate.length,
    })
    .returning({ id: searches.id });

  const inserted = await db
    .insert(candidates)
    .values(
      toCreate.map(({ tracker: _tracker, ...row }) => ({
        ...row,
        source: "manual" as const,
        searchId: search.id,
        status: "discovered" as const,
      })),
    )
    .returning({ id: candidates.id });

  const entries = toCreate.flatMap((row, index) =>
    row.tracker && inserted[index] ? [{ ...row.tracker, candidateId: inserted[index].id }] : [],
  );
  if (entries.length) await db.insert(shortlistEntries).values(entries);

  await c.env.SEARCH_WORKFLOW.create({ id: `search-${search.id}`, params: { searchId: search.id } });

  return c.json({ searchId: search.id, created: toCreate.length, skipped } satisfies ImportResponse, 201);
}
