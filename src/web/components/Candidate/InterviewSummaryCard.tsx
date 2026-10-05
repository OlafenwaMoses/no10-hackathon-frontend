import styled from "@emotion/styled";
import { createLink } from "@tanstack/react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import type { InterviewAnswer } from "@api-types";
import ScoreMeter from "../ScoreMeter";
import TruncatedText from "../UI/TruncatedText";
import { SectionCard, SectionHead } from "../UI/PageStyles";
import { INTERVIEW_QUESTION_SHORT_LABELS } from "../../lib/labels";
import { expectedScore, topOption } from "../../lib/interview";

type InterviewSummaryCardProps = {
  candidateId: string;
  answers: InterviewAnswer[];
  isRunning: boolean;
};

function answerValue(answer: InterviewAnswer) {
  if (answer.type === "scale") return <ScoreMeter value={expectedScore(answer)} width={64} />;
  if (answer.type === "choice") {
    const top = topOption(answer);
    return top?.label ? (
      <Choice>
        <ChoiceText text={top.label} />
        <Share>{Math.round(top.share * 100)}%</Share>
      </Choice>
    ) : null;
  }
  return answer.response ? <Quote text={`“${answer.response}”`} maxWidth={420} /> : null;
}

function InterviewSummaryCard({ candidateId, answers, isRunning }: InterviewSummaryCardProps) {
  return (
    <SectionCard>
      <SectionHead>
        Persona interview
        {answers.length > 0 && (
          <ViewLink to="/candidates/$candidateId/interview" params={{ candidateId }}>
            View full interview
            <ArrowRightIcon size={12} />
          </ViewLink>
        )}
      </SectionHead>
      {answers.length === 0 ? (
        <Empty>
          {isRunning
            ? "The interview runs after the persona is built. Answers appear here."
            : "No interview answers were recorded for this person."}
        </Empty>
      ) : (
        <Rows>
          {answers.map((answer) => (
            <Row key={answer.id} data-type={answer.type}>
              <Question text={INTERVIEW_QUESTION_SHORT_LABELS[answer.questionKey] ?? answer.question} />
              <Value>{answerValue(answer) ?? <Muted>—</Muted>}</Value>
            </Row>
          ))}
        </Rows>
      )}
    </SectionCard>
  );
}

export default InterviewSummaryCard;

const ViewAnchor = styled.a(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
  fontWeight: 400,
  color: theme.textTertiary,
  textDecoration: "none",
  transition: "color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: theme.textPrimary },
  },
  "&:focus-visible": { boxShadow: theme.focusRing, borderRadius: 4, outline: "none" },
}));

const ViewLink = createLink(ViewAnchor);

const Rows = styled.ul({
  display: "flex",
  flexDirection: "column",
  padding: "6px 0",
  margin: 0,
  listStyle: "none",
});

const Row = styled.li({
  display: "grid",
  gridTemplateColumns: "minmax(140px, 220px) minmax(0, 1fr)",
  alignItems: "center",
  gap: 16,
  minHeight: 38,
  padding: "6px 16px",
});

const Question = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 13,
  color: theme.textSecondary,
}));

const Value = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  fontSize: 13,
  color: theme.textPrimary,
}));

const Choice = styled.span({
  display: "inline-flex",
  alignItems: "baseline",
  gap: 8,
  minWidth: 0,
});

const ChoiceText = styled(TruncatedText)({
  display: "block",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 500,
});

const Share = styled.span(({ theme }) => ({
  flexShrink: 0,
  fontSize: 12,
  color: theme.textTertiary,
  fontVariantNumeric: "tabular-nums",
}));

const Quote = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontFamily: theme.fontSerif,
  fontSize: 14,
  color: theme.textSecondary,
}));

const Muted = styled.span(({ theme }) => ({
  color: theme.textDisabled,
}));

const Empty = styled.p(({ theme }) => ({
  padding: 16,
  fontSize: 12,
  color: theme.textTertiary,
}));
