import type { candidates } from "../db/schema";
import type { CandidateListItem } from "../types";

type CandidateRow = typeof candidates.$inferSelect;

export function toCandidateListItem(row: CandidateRow): CandidateListItem {
  return {
    id: row.id,
    name: row.name,
    headline: row.headline,
    title: row.title,
    organisation: row.organisation,
    location: row.location,
    country: row.country,
    pictureUrl: row.pictureUrl,
    profileUrl: row.profileUrl,
    source: row.source,
    category: row.category,
    sector: row.sector,
    subSector: row.subSector,
    criteria: row.criteria,
    residenceRegion: row.residenceRegion,
    nationality: row.nationality,
    status: row.status,
    overallScore: row.overallScore,
    opennessScore: row.opennessScore,
    ukLinkScore: row.ukLinkScore,
    ukLinkVerdict: row.ukLinks?.verdict ?? null,
    topLevers: (row.score?.levers ?? []).slice(0, 3).map((l) => l.lever),
    createdAt: row.createdAt,
  };
}
