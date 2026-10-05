import styled from "@emotion/styled";
import type { InterviewAnswer } from "@api-types";
import DistributionBars from "./DistributionBars";
import PersonaQuote from "./PersonaQuote";
import { Eyebrow } from "../UI/PageStyles";
import { answerShares, expectedScore } from "../../lib/interview";

const TYPE_LABELS = { scale: "Scale", choice: "Multiple choice", open: "Open question" } as const;

type InterviewAnswerCardProps = {
  answer: InterviewAnswer;
  index: number;
};

function InterviewAnswerCard({ answer, index }: InterviewAnswerCardProps) {
  const shares = answerShares(answer);
  const expected = expectedScore(answer);

  return (
    <Card>
      <Head>
        <Eyebrow>
          Q{index + 1} · {TYPE_LABELS[answer.type]}
        </Eyebrow>
        {answer.type === "scale" && answer.options.length > 0 && (
          <Expected>
            <ExpectedValue>{Math.round(expected)}</ExpectedValue>
            <ExpectedLabel>/ 100 expected</ExpectedLabel>
          </Expected>
        )}
      </Head>
      <Question>{answer.question}</Question>
      {answer.type === "scale" && answer.options.length > 1 && (
        <ScaleTrack>
          <ScaleLine />
          <Marker style={{ left: `${expected}%` }} />
          <ScaleEnds>
            <span>{answer.options[0]}</span>
            <span>{answer.options[answer.options.length - 1]}</span>
          </ScaleEnds>
        </ScaleTrack>
      )}
      {answer.type !== "open" && answer.options.length > 0 && (
        <DistributionBars options={answer.options} shares={shares} />
      )}
      {answer.type === "open" && answer.response && <PersonaQuote large>{answer.response}</PersonaQuote>}
      {answer.reasoning && <PersonaQuote>{answer.reasoning}</PersonaQuote>}
    </Card>
  );
}

export default InterviewAnswerCard;

const Card = styled.article(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: "18px 20px",
  borderBottom: `1px solid ${theme.borderFaint}`,
  "&:last-of-type": { borderBottom: "none" },
}));

const Head = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

const Question = styled.h3(({ theme }) => ({
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.45,
  color: theme.textPrimary,
}));

const Expected = styled.span({
  display: "inline-flex",
  alignItems: "baseline",
  gap: 5,
});

const ExpectedValue = styled.span(({ theme }) => ({
  fontFamily: theme.fontDisplay,
  fontSize: 20,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
  color: theme.textPrimary,
}));

const ExpectedLabel = styled.span(({ theme }) => ({
  fontSize: 11,
  color: theme.textTertiary,
}));

const ScaleTrack = styled.div({
  position: "relative",
  paddingTop: 6,
  marginBottom: 2,
});

const ScaleLine = styled.div(({ theme }) => ({
  height: 4,
  borderRadius: 2,
  background: `linear-gradient(90deg, ${theme.toneRoseBg}, ${theme.toneAmberBg}, ${theme.toneGreenBg})`,
  border: `1px solid ${theme.borderFaint}`,
}));

const Marker = styled.span(({ theme }) => ({
  position: "absolute",
  top: 2,
  width: 12,
  height: 12,
  marginLeft: -6,
  borderRadius: "50%",
  backgroundColor: theme.surface00,
  border: `3px solid ${theme.highlightStrong}`,
  boxShadow: theme.shadowDropdown,
  transition: "left 0.4s var(--ease-out-quart)",
}));

const ScaleEnds = styled.div(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 6,
  fontSize: 11,
  color: theme.textTertiary,
}));
