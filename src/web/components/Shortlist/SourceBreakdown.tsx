import styled from "@emotion/styled";
import { LEAD_SOURCES, LEAD_SOURCE_LABELS, type LeadSource } from "@api-types";

const SHOWN = 4;

function SourceBreakdown({ counts }: { counts: Record<LeadSource, number> }) {
  const ranked = LEAD_SOURCES.filter((source) => counts[source] > 0).sort((a, b) => counts[b] - counts[a]);
  const max = Math.max(1, ...ranked.map((source) => counts[source]));
  const hidden = ranked.length - SHOWN;

  return (
    <Wrapper>
      <Label>Source of referral</Label>
      {ranked.length === 0 ? (
        <Muted>No leads yet</Muted>
      ) : (
        <Rows>
          {ranked.slice(0, SHOWN).map((source) => (
            <Row key={source}>
              <Name>{LEAD_SOURCE_LABELS[source]}</Name>
              <Track>
                <Fill style={{ width: `${(counts[source] / max) * 100}%` }} />
              </Track>
              <Value>{counts[source]}</Value>
            </Row>
          ))}
          {hidden > 0 && <Muted>+{hidden} more</Muted>}
        </Rows>
      )}
    </Wrapper>
  );
}

export default SourceBreakdown;

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minWidth: 0,
});

const Label = styled.span(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.textTertiary,
}));

const Rows = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 5,
});

const Row = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(0, 120px) minmax(0, 1fr) 24px",
  alignItems: "center",
  gap: 10,
});

const Name = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textSecondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Track = styled.div(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  overflow: "hidden",
  backgroundColor: theme.surface200,
}));

const Fill = styled.div(({ theme }) => ({
  height: "100%",
  borderRadius: 3,
  backgroundColor: theme.toneBlueFg,
}));

const Value = styled.span(({ theme }) => ({
  fontSize: 12,
  fontWeight: 600,
  textAlign: "right",
  color: theme.textPrimary,
  fontVariantNumeric: "tabular-nums",
}));

const Muted = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textTertiary,
}));
