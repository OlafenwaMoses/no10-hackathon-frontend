import styled from "@emotion/styled";
import type { CandidateScore } from "@api-types";
import MeterRow from "./MeterRow";
import Pill from "../UI/Pill";
import { Eyebrow, SectionCard } from "../UI/PageStyles";
import { SCORE_BAND_LABELS, scoreBand, toPercent } from "../../lib/scores";

const BAND_TONES = { high: "green", medium: "blue", low: "amber" } as const;

function ScoreCard({ score }: { score: CandidateScore }) {
  const band = scoreBand(score.overall);

  return (
    <SectionCard>
      <Hero>
        <Overall>
          <Eyebrow>Priority score</Eyebrow>
          <Figure>
            <Big>{Math.round(toPercent(score.overall))}</Big>
            <OutOf>/ 100</OutOf>
          </Figure>
          <Pill tone={BAND_TONES[band]} dot>
            {SCORE_BAND_LABELS[band]}
          </Pill>
        </Overall>
        <Meters>
          <MeterRow label="Openness to relocating" value={score.openness} hint="45% of the score" />
          <MeterRow label="UK links" value={score.ukLinks} hint="25% of the score" />
          <MeterRow label="Prominence" value={score.prominence} hint="30% of the score" />
        </Meters>
      </Hero>
      {score.rationale && (
        <Rationale>
          <Eyebrow>Why</Eyebrow>
          <RationaleText>{score.rationale}</RationaleText>
        </Rationale>
      )}
    </SectionCard>
  );
}

export default ScoreCard;

const Hero = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(160px, 200px) minmax(0, 1fr)",
  alignItems: "center",
  gap: 32,
  padding: "24px 24px 20px",
  "@media (max-width: 720px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 20,
  },
});

const Overall = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 10,
});

const Figure = styled.div({
  display: "flex",
  alignItems: "baseline",
  gap: 6,
});

const Big = styled.span(({ theme }) => ({
  fontFamily: theme.fontDisplay,
  fontSize: 72,
  lineHeight: 0.9,
  fontWeight: 400,
  letterSpacing: "-0.04em",
  fontVariantNumeric: "tabular-nums",
  color: theme.textPrimary,
}));

const OutOf = styled.span(({ theme }) => ({
  fontSize: 15,
  color: theme.textTertiary,
}));

const Meters = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 24,
  "@media (max-width: 960px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 14,
  },
});

const Rationale = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "16px 24px 20px",
  borderTop: `1px solid ${theme.borderFaint}`,
}));

const RationaleText = styled.p(({ theme }) => ({
  maxWidth: 820,
  fontSize: 14,
  lineHeight: 1.6,
  color: theme.textSecondary,
  textWrap: "pretty",
}));
