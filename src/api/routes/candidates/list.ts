import type { Context } from "hono";
import { and, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { candidates } from "../../db/schema";
import { toCandidateListItem } from "../../lib/candidate-list-item";
import { isOneOf } from "../../lib/is-one-of";
import { CANDIDATE_STATUSES, GTT_CRITERIA, RESIDENCE_REGIONS, SECTORS, TALENT_CATEGORIES } from "../../types";
import type { AppEnv } from "../../index";

export async function list(c: Context<AppEnv>) {
  const { db } = c.var;
  const { category, sector, status, criteria, region, q, searchId } = c.req.query();

  const filters: SQL[] = [];
  if (isOneOf(TALENT_CATEGORIES, category)) filters.push(eq(candidates.category, category));
  if (isOneOf(SECTORS, sector)) filters.push(eq(candidates.sector, sector));
  if (isOneOf(CANDIDATE_STATUSES, status)) filters.push(eq(candidates.status, status));
  if (isOneOf(GTT_CRITERIA, criteria)) filters.push(eq(candidates.criteria, criteria));
  if (isOneOf(RESIDENCE_REGIONS, region)) filters.push(eq(candidates.residenceRegion, region));
  if (searchId) filters.push(eq(candidates.searchId, searchId));
  if (q) {
    const pattern = `%${q}%`;
    const match = or(
      ilike(candidates.name, pattern),
      ilike(candidates.organisation, pattern),
      ilike(candidates.headline, pattern),
      ilike(candidates.location, pattern),
      ilike(candidates.subSector, pattern),
    );
    if (match) filters.push(match);
  }

  const rows = await db
    .select()
    .from(candidates)
    .where(and(...filters))
    .orderBy(sql`${candidates.overallScore} DESC NULLS LAST`, sql`${candidates.createdAt} DESC`)
    .limit(500);

  return c.json(rows.map(toCandidateListItem));
}
