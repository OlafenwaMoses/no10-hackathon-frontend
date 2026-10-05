import type { Context } from "hono";
import { asc, eq } from "drizzle-orm";
import { personaMessages } from "../../db/schema";
import type { ChatMessage } from "../../types";
import type { AppEnv } from "../../index";

export async function chatHistory(c: Context<AppEnv, "/:candidateId">) {
  const { db } = c.var;
  const candidateId = c.req.param("candidateId");

  const rows = await db
    .select({ role: personaMessages.role, content: personaMessages.content })
    .from(personaMessages)
    .where(eq(personaMessages.candidateId, candidateId))
    .orderBy(asc(personaMessages.createdAt));

  return c.json(rows satisfies ChatMessage[]);
}
