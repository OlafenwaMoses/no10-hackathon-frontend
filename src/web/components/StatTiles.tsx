import styled from "@emotion/styled";
import type { Stats } from "@api-types";
import {
  RESIDENCE_REGIONS,
  RESIDENCE_REGION_LABELS,
  SECTORS,
  SECTOR_LABELS,
  TALENT_CATEGORIES,
  TALENT_CATEGORY_LABELS,
} from "../lib/labels";
import StatTile from "./StatTile";
import MixBar from "./MixBar";
import { CATEGORY_TONES, REGION_TONES } from "../lib/tones";
import { SCORE_BAND_LABELS, scoreBand, toPercent } from "../lib/scores";

type StatTilesProps = {
  stats: Stats | undefined;
  isLoading: boolean;
};

function StatTiles({ stats, isLoading }: StatTilesProps) {
  const scoredShare = stats && stats.candidates > 0 ? (stats.scored / stats.candidates) * 100 : 0;
  const topSector = stats
    ? [...SECTORS].sort((a, b) => (stats.bySector[b] ?? 0) - (stats.bySector[a] ?? 0))[0]
    : undefined;
  const regionTotal = stats ? RESIDENCE_REGIONS.reduce((sum, region) => sum + (stats.byRegion[region] ?? 0), 0) : 0;
  const topRegion = stats
    ? [...RESIDENCE_REGIONS].sort((a, b) => (stats.byRegion[b] ?? 0) - (stats.byRegion[a] ?? 0))[0]
    : undefined;
  const hasRegions = !!stats && !!topRegion && regionTotal > 0;

  return (
    <Grid>
      <StatTile
        label="Candidates"
        value={stats?.candidates ?? 0}
        isLoading={isLoading}
        footer={
          stats && (
            <MixBar
              segments={TALENT_CATEGORIES.map((category) => ({
                key: category,
                label: TALENT_CATEGORY_LABELS[category],
                count: stats.byCategory[category] ?? 0,
                tone: CATEGORY_TONES[category],
              }))}
            />
          )
        }
      />
      <StatTile
        label="Scored"
        value={stats?.scored ?? 0}
        isLoading={isLoading}
        footer={stats && `${Math.round(scoredShare)}% of the database fully assessed`}
      />
      <StatTile
        label="Average openness to the UK"
        value={stats?.averageOpenness == null ? "—" : Math.round(toPercent(stats.averageOpenness))}
        suffix={stats?.averageOpenness == null ? undefined : "/ 100"}
        isLoading={isLoading}
        footer={
          stats?.averageOpenness == null
            ? "Awaiting interviews"
            : SCORE_BAND_LABELS[scoreBand(stats.averageOpenness)]
        }
      />
      <StatTile
        label="Top residence"
        value={hasRegions && topRegion ? RESIDENCE_REGION_LABELS[topRegion] : "—"}
        suffix={
          hasRegions && topRegion && stats
            ? `${Math.round(((stats.byRegion[topRegion] ?? 0) / regionTotal) * 100)}%`
            : undefined
        }
        isLoading={isLoading}
        footer={
          stats &&
          (hasRegions ? (
            <MixBar
              segments={RESIDENCE_REGIONS.map((region) => ({
                key: region,
                label: RESIDENCE_REGION_LABELS[region],
                count: stats.byRegion[region] ?? 0,
                tone: REGION_TONES[region],
              }))}
            />
          ) : (
            "Awaiting classification"
          ))
        }
      />
      <StatTile
        label="Searches"
        value={stats?.searches ?? 0}
        isLoading={isLoading}
        footer={
          stats && topSector && (stats.bySector[topSector] ?? 0) > 0
            ? `Most talent in ${SECTOR_LABELS[topSector]}`
            : "Pipeline runs"
        }
      />
    </Grid>
  );
}

export default StatTiles;

const Grid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: 12,
});
