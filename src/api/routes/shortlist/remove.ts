import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { shortlistEntries } from "../../db/schema";
import type { AppEnv } from "../../index";

export async function remove(c: Context<AppEnv, "/:entryId">) {
  const { db } = c.var;
  const entryId = c.req.param("entryId");

  const [entry] = await db
    .delete(shortlistEntries)
    .where(eq(shortlistEntries.id, entryId))
    .returning({ id: shortlistEntries.id });
  if (!entry) return c.json({ error: "Shortlist entry not found" }, 404);

  return c.json({ ok: true });
}
