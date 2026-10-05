import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { candidates } from "../../db/schema";
import { refreshContactLookup } from "../../pipeline/contact";
import type { AppEnv } from "../../index";

export async function contact(c: Context<AppEnv, "/:candidateId">) {
  const { db } = c.var;
  const candidateId = c.req.param("candidateId");

  const [candidate] = await db
    .select({ contact: candidates.contact, profileUrl: candidates.profileUrl })
    .from(candidates)
    .where(eq(candidates.id, candidateId));
  if (!candidate) return c.json({ error: "Candidate not found" }, 404);
  if (!candidate.contact || candidate.contact.status !== "searching") return c.json(candidate.contact);

  const linkedin = candidate.profileUrl && /linkedin\.com\/in\//i.test(candidate.profileUrl) ? candidate.profileUrl : null;
  const refreshed = await refreshContactLookup(c.env.EXA_API_KEY, candidate.contact, linkedin);
  if (refreshed.status !== "searching") {
    await db.update(candidates).set({ contact: refreshed }).where(eq(candidates.id, candidateId));
  }

  return c.json(refreshed);
}
