import styled from "@emotion/styled";
import { motion, type Transition } from "motion/react";
import { scoreBand, toPercent } from "../../lib/scores";
import { SPRING3 } from "../../lib/springs";

type MeterRowProps = {
  label: string;
  value: number;
  hint?: string;
};

function MeterRow({ label, value, hint }: MeterRowProps) {
  const percent = toPercent(value);

  return (
    <Row data-band={scoreBand(value)}>
      <Top>
        <Label>{label}</Label>
        <Value>{Math.round(percent)}</Value>
      </Top>
      <Track>
        <Fill
          style={{ width: `${percent}%` }}
          initial={{ transform: "scaleX(0)" }}
          animate={{ transform: "scaleX(1)" }}
          transition={SPRING3 as Transition}
        />
      </Track>
      {hint && <Hint>{hint}</Hint>}
    </Row>
  );
}

export default MeterRow;

const Row = styled.div(({ theme }) => ({
  "--band": theme.textTertiary,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  "&[data-band='high']": { "--band": theme.successFg },
  "&[data-band='medium']": { "--band": theme.highlightStrong },
  "&[data-band='low']": { "--band": theme.warningFg },
}));

const Top = styled.div({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 8,
});

const Label = styled.span(({ theme }) => ({
  fontSize: 13,
  color: theme.textSecondary,
}));

const Value = styled.span(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  fontVariantNumeric: "tabular-nums",
  color: theme.textPrimary,
}));

const Track = styled.div(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  overflow: "hidden",
  backgroundColor: theme.surface200,
}));

const Fill = styled(motion.div)({
  height: "100%",
  borderRadius: 3,
  transformOrigin: "left center",
  backgroundColor: "var(--band)",
});

const Hint = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textTertiary,
}));
