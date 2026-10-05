import type { Context } from "hono";
import { eq, sql } from "drizzle-orm";
import { candidates, searches, shortlistEntries } from "../../db/schema";
import { searchColumns } from "../../lib/search-columns";
import { toCandidateListItem } from "../../lib/candidate-list-item";
import type { SearchDetail } from "../../types";
import type { AppEnv } from "../../index";

export async function get(c: Context<AppEnv, "/:searchId">) {
  const { db } = c.var;
  const searchId = c.req.param("searchId");

  const [[search], rows] = await Promise.all([
    db.select(searchColumns).from(searches).where(eq(searches.id, searchId)),
    db
      .select({ candidate: candidates, shortlistStage: shortlistEntries.stage })
      .from(candidates)
      .leftJoin(shortlistEntries, eq(shortlistEntries.candidateId, candidates.id))
      .where(eq(candidates.searchId, searchId))
      .orderBy(sql`${candidates.overallScore} DESC NULLS LAST`, sql`${candidates.createdAt} DESC`),
  ]);
  if (!search) return c.json({ error: "Search not found" }, 404);

  return c.json({ ...search, candidates: rows.map((row) => toCandidateListItem(row.candidate, row.shortlistStage)) } satisfies SearchDetail);
}
