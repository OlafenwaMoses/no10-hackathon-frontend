import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { candidates, shortlistEntries } from "../../db/schema";
import type { AppEnv } from "../../index";

export async function create(c: Context<AppEnv>) {
  const { db } = c.var;
  const { candidateId } = await c.req.json<{ candidateId?: string }>();
  if (!candidateId) return c.json({ error: "candidateId is required" }, 400);

  const [candidate] = await db.select({ id: candidates.id }).from(candidates).where(eq(candidates.id, candidateId));
  if (!candidate) return c.json({ error: "Candidate not found" }, 404);

  await db.insert(shortlistEntries).values({ candidateId }).onConflictDoNothing({ target: shortlistEntries.candidateId });
  const [entry] = await db.select().from(shortlistEntries).where(eq(shortlistEntries.candidateId, candidateId));

  return c.json(entry, 201);
}
