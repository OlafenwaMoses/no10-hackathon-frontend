import type { Context } from "hono";
import { shortlistEntries } from "../../db/schema";
import {
  LEAD_SOURCES,
  RAG_VALUES,
  SHORTLIST_STAGES,
  type LeadSource,
  type Rag,
  type ShortlistStage,
  type ShortlistSummary,
} from "../../types";
import type { AppEnv } from "../../index";

function zeroes<T extends string>(keys: readonly T[]) {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>;
}

function distinct(values: (string | null)[]) {
  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => !!value))].sort();
}

export async function summary(c: Context<AppEnv>) {
  const { db } = c.var;
  const rows = await db.select().from(shortlistEntries);

  const byStage = zeroes<ShortlistStage>(SHORTLIST_STAGES);
  const successRag = zeroes<Rag>(RAG_VALUES);
  const relationshipRag = zeroes<Rag>(RAG_VALUES);
  const bySource = zeroes<LeadSource>(LEAD_SOURCES);
  for (const row of rows) {
    byStage[row.stage] += 1;
    bySource[row.leadSource] += 1;
    if (row.successRag) successRag[row.successRag] += 1;
    if (row.relationshipRag) relationshipRag[row.relationshipRag] += 1;
  }

  const result: ShortlistSummary = {
    total: rows.length,
    active: byStage.pending + byStage.cleared + byStage.account_managed,
    converted: rows.filter((row) => row.stage === "closed" && row.successCategory).length,
    byStage,
    successRag,
    relationshipRag,
    bySource,
    accountManagers: distinct(rows.map((row) => row.accountManager)),
    relationshipHolders: distinct(rows.map((row) => row.relationshipHolder)),
  };
  return c.json(result);
}
