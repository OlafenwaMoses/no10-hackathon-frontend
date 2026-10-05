import styled from "@emotion/styled";
import { scoreBand, toPercent } from "../lib/scores";

type ScoreMeterProps = {
  value: number | null;
  width?: number;
  emphasis?: boolean;
};

function ScoreMeter({ value, width = 56, emphasis }: ScoreMeterProps) {
  if (value === null) return <Empty>—</Empty>;
  const percent = toPercent(value);

  return (
    <Wrapper data-band={scoreBand(value)} data-emphasis={emphasis || undefined}>
      <Value>{Math.round(percent)}</Value>
      <Track style={{ width }}>
        <Fill style={{ width: `${percent}%` }} />
      </Track>
    </Wrapper>
  );
}

export default ScoreMeter;

const Wrapper = styled.span(({ theme }) => ({
  "--band": theme.textTertiary,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  "&[data-band='high']": { "--band": theme.successFg },
  "&[data-band='medium']": { "--band": theme.highlightStrong },
  "&[data-band='low']": { "--band": theme.warningFg },
}));

const Value = styled.span(({ theme }) => ({
  minWidth: 22,
  fontVariantNumeric: "tabular-nums",
  fontWeight: 500,
  color: theme.textPrimary,
  "[data-emphasis] > &": {
    fontWeight: 600,
  },
}));

const Track = styled.span(({ theme }) => ({
  position: "relative",
  height: 4,
  borderRadius: 2,
  overflow: "hidden",
  backgroundColor: theme.surface300,
}));

const Fill = styled.span({
  position: "absolute",
  inset: "0 auto 0 0",
  borderRadius: 2,
  backgroundColor: "var(--band)",
});

const Empty = styled.span(({ theme }) => ({
  color: theme.textDisabled,
}));
