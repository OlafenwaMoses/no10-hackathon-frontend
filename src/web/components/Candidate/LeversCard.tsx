import styled from "@emotion/styled";
import { motion, type Transition } from "motion/react";
import type { LeverWeight } from "@api-types";
import { GTT_LEVER_LABELS } from "../../lib/labels";
import { SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";
import { toPercent } from "../../lib/scores";
import { SPRING3 } from "../../lib/springs";

function LeversCard({ levers }: { levers: LeverWeight[] }) {
  const sorted = [...levers].sort((a, b) => b.weight - a.weight);
  const max = Math.max(...sorted.map((lever) => lever.weight), 0);

  return (
    <SectionCard>
      <SectionHead>Recommended levers</SectionHead>
      <SectionBody>
        {sorted.length === 0 && <Empty>No levers recommended.</Empty>}
        {sorted.map((lever, index) => (
          <Row key={lever.lever} data-lead={index === 0 || undefined}>
            <Top>
              <Label>{GTT_LEVER_LABELS[lever.lever]}</Label>
              {index === 0 && <Lead>Lead with</Lead>}
              <Value>{Math.round(toPercent(lever.weight * 100))}%</Value>
            </Top>
            <Track>
              <Fill
                style={{ width: `${max > 0 ? (lever.weight / max) * 100 : 0}%` }}
                initial={{ transform: "scaleX(0)" }}
                animate={{ transform: "scaleX(1)" }}
                transition={{ ...(SPRING3 as Transition), delay: index * 0.04 }}
              />
            </Track>
          </Row>
        ))}
      </SectionBody>
    </SectionCard>
  );
}

export default LeversCard;

const Row = styled.div(({ theme }) => ({
  "--lever": theme.highlight,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  "&[data-lead]": { "--lever": theme.highlightStrong },
}));

const Top = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

const Label = styled.span(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  fontSize: 13,
  color: theme.textPrimary,
}));

const Lead = styled.span(({ theme }) => ({
  flexShrink: 0,
  padding: "2px 6px",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 500,
  color: theme.toneBlueFg,
  backgroundColor: theme.toneBlueBg,
}));

const Value = styled.span(({ theme }) => ({
  flexShrink: 0,
  minWidth: 34,
  textAlign: "right",
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
  color: theme.textTertiary,
}));

const Track = styled.div(({ theme }) => ({
  height: 4,
  borderRadius: 2,
  overflow: "hidden",
  backgroundColor: theme.surface200,
}));

const Fill = styled(motion.div)({
  height: "100%",
  borderRadius: 2,
  transformOrigin: "left center",
  backgroundColor: "var(--lever)",
});

const Empty = styled.span(({ theme }) => ({
  fontSize: 13,
  color: theme.textTertiary,
}));
