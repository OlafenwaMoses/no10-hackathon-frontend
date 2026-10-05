import styled from "@emotion/styled";
import type { NetWorth } from "@api-types";
import Pill from "../UI/Pill";
import { SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";
import { NET_WORTH_BAND_LABELS, NET_WORTH_CONFIDENCE_LABELS } from "../../lib/labels";
import { CONFIDENCE_TONES } from "../../lib/tones";
import formatUsd from "../../lib/formatUsd";

function NetWorthCard({ netWorth }: { netWorth: NetWorth }) {
  const unknown = netWorth.band === "unknown";

  return (
    <SectionCard>
      <SectionHead>
        Net worth
        {!unknown && (
          <Pill tone={CONFIDENCE_TONES[netWorth.confidence]} dot>
            {NET_WORTH_CONFIDENCE_LABELS[netWorth.confidence]}
          </Pill>
        )}
      </SectionHead>
      <SectionBody>
        <Figure>
          <Band data-unknown={unknown || undefined}>{NET_WORTH_BAND_LABELS[netWorth.band]}</Band>
          {netWorth.estimateUsd != null && !unknown && <Estimate>est. {formatUsd(netWorth.estimateUsd)}</Estimate>}
        </Figure>
        {netWorth.basis && <Basis>{netWorth.basis}</Basis>}
      </SectionBody>
    </SectionCard>
  );
}

export default NetWorthCard;

const Figure = styled.div({
  display: "flex",
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: 8,
});

const Band = styled.span(({ theme }) => ({
  fontFamily: theme.fontDisplay,
  fontSize: 26,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  fontVariantNumeric: "tabular-nums",
  color: theme.textPrimary,
  "&[data-unknown]": { color: theme.textTertiary },
}));

const Estimate = styled.span(({ theme }) => ({
  fontSize: 13,
  color: theme.textTertiary,
  fontVariantNumeric: "tabular-nums",
}));

const Basis = styled.p(({ theme }) => ({
  fontSize: 12,
  lineHeight: 1.55,
  color: theme.textSecondary,
}));
