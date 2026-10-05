import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { shortlistEntries } from "../../db/schema";
import { isOneOf } from "../../lib/is-one-of";
import {
  BACKGROUND_CHECKS,
  ISSUE_CATEGORIES,
  LEAD_SOURCES,
  RAG_VALUES,
  RESOLVED_VALUES,
  SHORTLIST_STAGES,
  SUCCESS_CATEGORIES,
  SUPPORT_LEVELS,
  type UpdateShortlistBody,
} from "../../types";
import type { AppEnv } from "../../index";

const TEXT_FIELDS = [
  "relationshipHolder",
  "accountManager",
  "nextStep",
  "dataHubLink",
  "issueDetails",
  "solutionOffered",
  "outcome",
  "failureReason",
] as const;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function optionalEnum<T extends string>(values: readonly T[], value: unknown) {
  if (value === null) return null;
  return isOneOf(values, value) ? value : undefined;
}

export async function update(c: Context<AppEnv, "/:entryId">) {
  const { db } = c.var;
  const entryId = c.req.param("entryId");
  const body = await c.req.json<UpdateShortlistBody>();

  const patch: Partial<typeof shortlistEntries.$inferInsert> = {};
  if (isOneOf(SHORTLIST_STAGES, body.stage)) patch.stage = body.stage;
  if (isOneOf(BACKGROUND_CHECKS, body.backgroundCheck)) patch.backgroundCheck = body.backgroundCheck;
  if (isOneOf(LEAD_SOURCES, body.leadSource)) patch.leadSource = body.leadSource;
  if ("successRag" in body) patch.successRag = optionalEnum(RAG_VALUES, body.successRag);
  if ("relationshipRag" in body) patch.relationshipRag = optionalEnum(RAG_VALUES, body.relationshipRag);
  if ("supportLevel" in body) patch.supportLevel = optionalEnum(SUPPORT_LEVELS, body.supportLevel);
  if ("resolved" in body) patch.resolved = optionalEnum(RESOLVED_VALUES, body.resolved);
  if ("successCategory" in body) patch.successCategory = optionalEnum(SUCCESS_CATEGORIES, body.successCategory);
  if ("priority" in body) {
    patch.priority = typeof body.priority === "number" && Number.isFinite(body.priority) ? Math.round(body.priority) : null;
  }
  if (Array.isArray(body.issueCategories)) {
    patch.issueCategories = body.issueCategories.filter((value) => isOneOf(ISSUE_CATEGORIES, value));
  }
  if (typeof body.originDate === "string" && DATE.test(body.originDate)) patch.originDate = body.originDate;
  if ("closedAt" in body) patch.closedAt = typeof body.closedAt === "string" && DATE.test(body.closedAt) ? body.closedAt : null;
  for (const field of TEXT_FIELDS) {
    if (field in body) {
      const value = body[field];
      patch[field] = typeof value === "string" && value.trim() ? value.trim() : null;
    }
  }
  if (patch.stage === "closed" && !("closedAt" in body)) patch.closedAt = new Date().toISOString().slice(0, 10);

  if (Object.keys(patch).length === 0) return c.json({ error: "Nothing to update" }, 400);

  const [entry] = await db.update(shortlistEntries).set(patch).where(eq(shortlistEntries.id, entryId)).returning();
  if (!entry) return c.json({ error: "Shortlist entry not found" }, 404);

  return c.json(entry);
}
