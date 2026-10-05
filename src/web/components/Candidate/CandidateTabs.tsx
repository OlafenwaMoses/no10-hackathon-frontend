import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import Tabs from "../UI/Tabs";

type CandidateTab = "overview" | "interview";

type CandidateTabsProps = {
  candidateId: string;
  tab: CandidateTab;
  answerCount: number;
};

function CandidateTabs({ candidateId, tab, answerCount }: CandidateTabsProps) {
  const navigate = useNavigate();

  return (
    <Bar>
      <Tabs<CandidateTab>
        label="Candidate sections"
        flush
        value={tab}
        onChange={(next) =>
          void navigate(
            next === "interview"
              ? { to: "/candidates/$candidateId/interview", params: { candidateId } }
              : { to: "/candidates/$candidateId", params: { candidateId } },
          )
        }
        items={[
          { key: "overview", label: "Overview" },
          { key: "interview", label: answerCount > 0 ? `Interview · ${answerCount}` : "Interview" },
        ]}
      />
    </Bar>
  );
}

export default CandidateTabs;

const Bar = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  height: 40,
  borderBottom: `1px solid ${theme.border100}`,
}));
