import type { Context } from "hono";
import { sql } from "drizzle-orm";
import { candidates, searches } from "../../db/schema";
import {
  RESIDENCE_REGIONS,
  SECTORS,
  TALENT_CATEGORIES,
  type ResidenceRegion,
  type Sector,
  type Stats,
  type TalentCategory,
} from "../../types";
import type { AppEnv } from "../../index";

export async function get(c: Context<AppEnv>) {
  const { db } = c.var;

  const [[totals], groups, [searchTotals]] = await Promise.all([
    db
      .select({
        candidates: sql<number>`count(*)::int`,
        scored: sql<number>`count(*) filter (where ${candidates.status} = 'scored')::int`,
        averageOpenness: sql<number | null>`avg(${candidates.opennessScore})::float`,
      })
      .from(candidates),
    db
      .select({
        category: candidates.category,
        sector: candidates.sector,
        region: candidates.residenceRegion,
        count: sql<number>`count(*)::int`,
      })
      .from(candidates)
      .groupBy(candidates.category, candidates.sector, candidates.residenceRegion),
    db.select({ count: sql<number>`count(*)::int` }).from(searches),
  ]);

  const byCategory = Object.fromEntries(TALENT_CATEGORIES.map((k) => [k, 0])) as Record<TalentCategory, number>;
  const bySector = Object.fromEntries(SECTORS.map((k) => [k, 0])) as Record<Sector, number>;
  const byRegion = Object.fromEntries(RESIDENCE_REGIONS.map((k) => [k, 0])) as Record<ResidenceRegion, number>;
  for (const g of groups) {
    byCategory[g.category] = (byCategory[g.category] ?? 0) + g.count;
    bySector[g.sector] = (bySector[g.sector] ?? 0) + g.count;
    if (g.region) byRegion[g.region] = (byRegion[g.region] ?? 0) + g.count;
  }

  const stats: Stats = {
    candidates: totals.candidates,
    scored: totals.scored,
    searches: searchTotals.count,
    averageOpenness: totals.averageOpenness === null ? null : Math.round(totals.averageOpenness),
    byCategory,
    bySector,
    byRegion,
  };
  return c.json(stats);
}
