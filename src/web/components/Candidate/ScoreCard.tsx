import styled from "@emotion/styled";
import type { CandidateScore } from "@api-types";
import MeterRow from "./MeterRow";
import Pill from "../UI/Pill";
import { SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";
import { SCORE_BAND_LABELS, scoreBand, toPercent } from "../../lib/scores";
import { P } from "../../lib/utilityComponents";

const BAND_TONES = { high: "green", medium: "blue", low: "amber" } as const;

function ScoreCard({ score }: { score: CandidateScore }) {
  const band = scoreBand(score.overall);

  return (
    <SectionCard>
      <SectionHead>Priority score</SectionHead>
      <SectionBody>
        <Summary>
          <Overall>
            <Big>{Math.round(toPercent(score.overall))}</Big>
            <OutOf>/ 100</OutOf>
          </Overall>
          <Pill tone={BAND_TONES[band]} dot>
            {SCORE_BAND_LABELS[band]}
          </Pill>
        </Summary>
        <Meters>
          <MeterRow label="Openness to relocating" value={score.openness} />
          <MeterRow label="UK links" value={score.ukLinks} />
          <MeterRow label="Prominence" value={score.prominence} />
        </Meters>
        {score.rationale && (
          <Rationale>
            <P size="sm" textSecondary>
              {score.rationale}
            </P>
          </Rationale>
        )}
      </SectionBody>
    </SectionCard>
  );
}

export default ScoreCard;

const Summary = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

const Overall = styled.div({
  display: "flex",
  alignItems: "baseline",
  gap: 6,
});

const Big = styled.span(({ theme }) => ({
  fontFamily: theme.fontDisplay,
  fontSize: 52,
  lineHeight: 1,
  fontWeight: 400,
  letterSpacing: "-0.03em",
  fontVariantNumeric: "tabular-nums",
  color: theme.textPrimary,
}));

const OutOf = styled.span(({ theme }) => ({
  fontSize: 14,
  color: theme.textTertiary,
}));

const Meters = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

const Rationale = styled.div(({ theme }) => ({
  paddingTop: 14,
  borderTop: `1px solid ${theme.borderFaint}`,
}));
