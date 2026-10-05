import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { candidates, shortlistEntries } from "../../db/schema";
import { isOneOf } from "../../lib/is-one-of";
import { OUTREACH_STATUSES, type UpdateOutreachBody } from "../../types";
import type { AppEnv } from "../../index";

export async function outreach(c: Context<AppEnv, "/:candidateId">) {
  const { db } = c.var;
  const candidateId = c.req.param("candidateId");
  const body = await c.req.json<UpdateOutreachBody>();

  if (!isOneOf(OUTREACH_STATUSES, body.status)) return c.json({ error: "Invalid outreach status" }, 400);

  const [current] = await db
    .select({ contactedAt: candidates.contactedAt })
    .from(candidates)
    .where(eq(candidates.id, candidateId));
  if (!current) return c.json({ error: "Candidate not found" }, 404);

  const contactedAt =
    body.status === "not_contacted" ? null : (current.contactedAt ?? new Date().toISOString());
  await db
    .update(candidates)
    .set({ outreachStatus: body.status, outreachNote: body.note?.trim() || null, contactedAt })
    .where(eq(candidates.id, candidateId));
  if (body.status !== "not_contacted") {
    await db.insert(shortlistEntries).values({ candidateId }).onConflictDoNothing({ target: shortlistEntries.candidateId });
  }

  return c.json({ ok: true });
}
