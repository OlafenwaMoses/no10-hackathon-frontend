import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { candidates } from "../../db/schema";
import type { AppEnv } from "../../index";

export async function remove(c: Context<AppEnv, "/:candidateId">) {
  const { db } = c.var;
  const candidateId = c.req.param("candidateId");

  const [row] = await db
    .delete(candidates)
    .where(eq(candidates.id, candidateId))
    .returning({ id: candidates.id });
  if (!row) return c.json({ error: "Candidate not found" }, 404);

  return c.json({ ok: true });
}
