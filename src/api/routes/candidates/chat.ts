import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { candidates, personaMessages } from "../../db/schema";
import { chatWithPersona } from "../../pipeline/chat";
import type { ChatBody, ChatResponse } from "../../types";
import type { AppEnv } from "../../index";

export async function chat(c: Context<AppEnv, "/:candidateId">) {
  const { db } = c.var;
  const candidateId = c.req.param("candidateId");
  const { messages } = await c.req.json<ChatBody>();

  const last = messages?.at(-1);
  if (!last || last.role !== "user" || !last.content.trim()) {
    return c.json({ error: "A user message is required" }, 400);
  }

  const [candidate] = await db
    .select({ persona: candidates.persona, ukLinks: candidates.ukLinks })
    .from(candidates)
    .where(eq(candidates.id, candidateId));
  if (!candidate) return c.json({ error: "Candidate not found" }, 404);
  if (!candidate.persona) return c.json({ error: "Persona has not been built yet" }, 409);

  const reply = await chatWithPersona(c.env, candidate.persona, candidate.ukLinks, messages.slice(-30));

  const now = Date.now();
  await db.insert(personaMessages).values([
    { candidateId, role: "user", content: last.content, createdAt: new Date(now).toISOString() },
    { candidateId, role: "model", content: reply, createdAt: new Date(now + 1).toISOString() },
  ]);

  return c.json({ reply } satisfies ChatResponse);
}
