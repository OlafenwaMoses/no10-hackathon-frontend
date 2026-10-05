import type { Context } from "hono";
import { eq, sql } from "drizzle-orm";
import { candidates, shortlistEntries } from "../../db/schema";
import { toCandidateListItem } from "../../lib/candidate-list-item";
import { isOneOf } from "../../lib/is-one-of";
import { SHORTLIST_STAGES, type ShortlistItem } from "../../types";
import type { AppEnv } from "../../index";

export async function list(c: Context<AppEnv>) {
  const { db } = c.var;
  const { stage } = c.req.query();

  const rows = await db
    .select({ entry: shortlistEntries, candidate: candidates })
    .from(shortlistEntries)
    .innerJoin(candidates, eq(candidates.id, shortlistEntries.candidateId))
    .where(isOneOf(SHORTLIST_STAGES, stage) ? eq(shortlistEntries.stage, stage) : undefined)
    .orderBy(sql`${shortlistEntries.priority} ASC NULLS LAST`, sql`${candidates.overallScore} DESC NULLS LAST`);

  const items: ShortlistItem[] = rows.map((row) => ({
    ...row.entry,
    candidate: toCandidateListItem(row.candidate, row.entry.stage),
  }));
  return c.json(items);
}
