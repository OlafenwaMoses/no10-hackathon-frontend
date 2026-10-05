import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { candidates } from "../../db/schema";
import { startContactLookup } from "../../pipeline/contact";
import type { AppEnv } from "../../index";

export async function findContact(c: Context<AppEnv, "/:candidateId">) {
  const { db } = c.var;
  const candidateId = c.req.param("candidateId");

  const [candidate] = await db.select().from(candidates).where(eq(candidates.id, candidateId));
  if (!candidate) return c.json({ error: "Candidate not found" }, 404);
  if (candidate.contact?.status === "searching") return c.json(candidate.contact);

  const contact = await startContactLookup(c.env.EXA_API_KEY, candidate);
  await db.update(candidates).set({ contact }).where(eq(candidates.id, candidateId));

  return c.json(contact);
}
