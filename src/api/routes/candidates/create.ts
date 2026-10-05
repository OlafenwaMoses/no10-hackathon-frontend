import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { candidates } from "../../db/schema";
import { toCandidateListItem } from "../../lib/candidate-list-item";
import { isOneOf } from "../../lib/is-one-of";
import { normaliseProfileUrl } from "../../pipeline/discover";
import { RESIDENCE_REGIONS, SECTORS, TALENT_CATEGORIES, type ManualCandidateBody } from "../../types";
import type { AppEnv } from "../../index";

function clean(value: string | undefined) {
  return value?.trim() || null;
}

export async function create(c: Context<AppEnv>) {
  const { db } = c.var;
  const body = await c.req.json<ManualCandidateBody>();

  const name = clean(body.name);
  if (!name) return c.json({ error: "Name is required" }, 400);
  if (body.category && !isOneOf(TALENT_CATEGORIES, body.category)) return c.json({ error: "Invalid category" }, 400);
  if (body.sector && !isOneOf(SECTORS, body.sector)) return c.json({ error: "Invalid sector" }, 400);
  if (body.region && !isOneOf(RESIDENCE_REGIONS, body.region)) return c.json({ error: "Invalid region" }, 400);

  const rawUrl = clean(body.profileUrl);
  const profileUrl = rawUrl ? normaliseProfileUrl(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`) : null;
  if (profileUrl) {
    const [existing] = await db.select({ id: candidates.id }).from(candidates).where(eq(candidates.profileUrl, profileUrl));
    if (existing) return c.json({ error: "This person is already in the database", candidateId: existing.id }, 409);
  }

  const customRegion = body.region === "other" ? clean(body.customRegion) : null;
  const city = clean(body.location);
  const location = [city, customRegion].filter(Boolean).join(", ") || null;

  const [candidate] = await db
    .insert(candidates)
    .values({
      source: "manual",
      name,
      organisation: clean(body.organisation),
      title: clean(body.title),
      profileUrl,
      location,
      residenceRegion: body.region ?? null,
      notes: clean(body.notes),
      category: body.category ?? "highly_talented",
      sector: body.sector ?? "other",
      status: "discovered",
    })
    .returning();

  await c.env.CANDIDATE_WORKFLOW.create({
    id: `candidate-${candidate.id}-${Date.now()}`,
    params: { candidateId: candidate.id },
  });

  return c.json(toCandidateListItem(candidate), 201);
}
