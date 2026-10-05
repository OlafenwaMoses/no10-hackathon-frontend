import styled from "@emotion/styled";
import { ChatCircleDotsIcon } from "@phosphor-icons/react";
import type { InterviewAnswer } from "@api-types";
import InterviewAnswerCard from "./InterviewAnswerCard";
import Loader from "../UI/Loader";
import { P } from "../../lib/utilityComponents";

type InterviewPanelProps = {
  answers: InterviewAnswer[];
  isRunning: boolean;
};

function InterviewPanel({ answers, isRunning }: InterviewPanelProps) {
  if (answers.length === 0) {
    return (
      <Empty>
        {isRunning ? <Loader size={20} /> : <ChatCircleDotsIcon size={22} />}
        <P textSecondary center size="sm">
          {isRunning
            ? "The persona interview will appear here once it runs."
            : "No interview answers were recorded for this person."}
        </P>
      </Empty>
    );
  }

  return (
    <div>
      {answers.map((answer, index) => (
        <InterviewAnswerCard key={answer.id} answer={answer} index={index} />
      ))}
    </div>
  );
}

export default InterviewPanel;

const Empty = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  padding: "56px 24px",
  color: theme.textTertiary,
}));
