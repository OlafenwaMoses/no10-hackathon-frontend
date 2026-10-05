import { sql } from "drizzle-orm";
import { candidates, searches } from "../db/schema";

export const searchColumns = {
  id: searches.id,
  name: searches.name,
  kind: searches.kind,
  category: searches.category,
  sector: searches.sector,
  region: searches.region,
  query: searches.query,
  numResults: searches.numResults,
  status: searches.status,
  error: searches.error,
  createdAt: searches.createdAt,
  candidateCount: sql<number>`(select count(*)::int from ${candidates} where ${candidates.searchId} = "searches"."id")`,
  scoredCount: sql<number>`(select count(*)::int from ${candidates} where ${candidates.searchId} = "searches"."id" and ${candidates.status} in ('scored', 'failed'))`,
};
