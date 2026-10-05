import styled from "@emotion/styled";
import type { ShortlistSummary } from "@api-types";
import StatTile from "../StatTile";
import Skeleton from "../UI/Skeleton";
import RagBreakdown from "./RagBreakdown";
import SourceBreakdown from "./SourceBreakdown";

type ShortlistSummaryTilesProps = {
  summary: ShortlistSummary | undefined;
  isLoading: boolean;
};

function share(count: number, total: number) {
  return total > 0 ? `${Math.round((count / total) * 100)}% of pipeline` : "Nobody yet";
}

function ShortlistSummaryTiles({ summary, isLoading }: ShortlistSummaryTilesProps) {
  const active = summary?.active ?? 0;

  return (
    <Wrapper>
      <Grid>
        <StatTile
          label="In pipeline"
          value={active}
          isLoading={isLoading}
          footer={summary && `${summary.total} tracked in total`}
        />
        <StatTile
          label="Account managed"
          value={summary?.byStage.account_managed ?? 0}
          isLoading={isLoading}
          footer={summary && share(summary.byStage.account_managed, active)}
        />
        <StatTile
          label="Cleared (to be pitched)"
          value={summary?.byStage.cleared ?? 0}
          isLoading={isLoading}
          footer={summary && share(summary.byStage.cleared, active)}
        />
        <StatTile
          label="Pending clearance"
          value={summary?.byStage.pending ?? 0}
          isLoading={isLoading}
          footer={summary && share(summary.byStage.pending, active)}
        />
        <StatTile
          label="Successfully converted"
          value={summary?.converted ?? 0}
          isLoading={isLoading}
          footer={summary && `${summary.byStage.closed} closed · ${summary.byStage.failed} failed`}
        />
      </Grid>
      <Breakdown>
        {isLoading || !summary ? (
          <>
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={56} />
          </>
        ) : (
          <>
            <RagBreakdown label="Likelihood of success" counts={summary.successRag} />
            <RagBreakdown label="Strength of relationship" counts={summary.relationshipRag} />
            <SourceBreakdown counts={summary.bySource} />
          </>
        )}
      </Breakdown>
    </Wrapper>
  );
}

export default ShortlistSummaryTiles;

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

const Grid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: 12,
  "@media (max-width: 1000px)": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
});

const Breakdown = styled.div(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 32,
  padding: "16px 18px",
  border: `1px solid ${theme.border100}`,
  borderRadius: 8,
  backgroundColor: theme.surface00,
  "@media (max-width: 900px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 18,
  },
}));
