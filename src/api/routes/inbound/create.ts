import type { Context } from "hono";
import { eq, sql } from "drizzle-orm";
import { candidates, shortlistEntries } from "../../db/schema";
import { isOneOf } from "../../lib/is-one-of";
import { normaliseCategory, normaliseSector } from "../../lib/normalise-import";
import { normaliseProfileUrl } from "../../pipeline/discover";
import { INBOUND_INTENTS, INBOUND_INTENT_LABELS, type ContactDetails, type InboundEnquiryBody } from "../../types";
import type { AppEnv } from "../../index";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: string | undefined, max = 2000) {
  return value?.toString().trim().slice(0, max) || null;
}

function toProfileUrl(raw: string | null) {
  if (!raw || /\s/.test(raw) || !/[a-z0-9-]+\.[a-z]{2,}/i.test(raw)) return null;
  return normaliseProfileUrl(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
}

function enquiryNotes(body: InboundEnquiryBody) {
  const intent = isOneOf(INBOUND_INTENTS, body.intent) ? INBOUND_INTENT_LABELS[body.intent] : null;
  return [
    `Website enquiry received ${new Date().toISOString().slice(0, 10)}`,
    intent ? `Looking to: ${intent}` : null,
    clean(body.timeline) ? `Timeline: ${clean(body.timeline)}` : null,
    clean(body.country) ? `Lives in: ${clean(body.country)}` : null,
    clean(body.category) ? `Describes themselves as: ${clean(body.category)}` : null,
    clean(body.sector) ? `Sector: ${clean(body.sector)}` : null,
    clean(body.message, 5000) ? `Message: ${clean(body.message, 5000)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function create(c: Context<AppEnv>) {
  const expected = c.env.INBOUND_SECRET;
  if (!expected) return c.json({ error: "Inbound enquiries are not configured" }, 503);
  if (c.req.header("x-inbound-secret") !== expected) return c.json({ error: "Unauthorised" }, 401);

  const { db } = c.var;
  const body = await c.req.json<InboundEnquiryBody>();
  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  if (!name) return c.json({ error: "Name is required" }, 400);
  if (!email || !EMAIL.test(email)) return c.json({ error: "A valid email is required" }, 400);

  const phone = clean(body.phone, 50);
  const profileUrl = toProfileUrl(clean(body.profileUrl, 500));
  const notes = enquiryNotes(body);
  const contact: ContactDetails = {
    status: "found",
    runId: null,
    emails: [email],
    phones: phone ? [phone] : [],
    linkedinUrl: profileUrl && /linkedin\.com\/in\//i.test(profileUrl) ? profileUrl : null,
    website: profileUrl && !/linkedin\.com/i.test(profileUrl) ? profileUrl : null,
    twitter: null,
    notes: "Provided by them via the website enquiry form",
    error: null,
    checkedAt: new Date().toISOString(),
  };

  const [existing] = await db
    .select({ id: candidates.id })
    .from(candidates)
    .where(
      profileUrl
        ? sql`${candidates.profileUrl} = ${profileUrl} or ${candidates.contact}->'emails' ? ${email}`
        : sql`${candidates.contact}->'emails' ? ${email}`,
    );

  if (existing) {
    await db
      .update(candidates)
      .set({ notes: sql`coalesce(${candidates.notes} || E'\n\n', '') || ${notes}` })
      .where(eq(candidates.id, existing.id));
    await db
      .insert(shortlistEntries)
      .values({ candidateId: existing.id, leadSource: "website", nextStep: "Respond to website enquiry" })
      .onConflictDoNothing({ target: shortlistEntries.candidateId });
    return c.json({ ok: true }, 201);
  }

  const [candidate] = await db
    .insert(candidates)
    .values({
      source: "inbound",
      name,
      organisation: clean(body.organisation, 200),
      title: clean(body.role, 200),
      profileUrl,
      location: clean(body.country, 200),
      notes,
      contact,
      category: normaliseCategory(body.category) ?? "highly_talented",
      sector: normaliseSector(body.sector) ?? "other",
      status: "discovered",
    })
    .returning({ id: candidates.id });

  await db
    .insert(shortlistEntries)
    .values({ candidateId: candidate.id, leadSource: "website", nextStep: "Respond to website enquiry" });

  await c.env.CANDIDATE_WORKFLOW.create({
    id: `candidate-${candidate.id}-${Date.now()}`,
    params: { candidateId: candidate.id },
  });

  return c.json({ ok: true }, 201);
}
