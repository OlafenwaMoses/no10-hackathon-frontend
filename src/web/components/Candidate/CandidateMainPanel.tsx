import styled from "@emotion/styled";
import { useState } from "react";
import type { CandidateDetail } from "@api-types";
import Tabs from "../UI/Tabs";
import InterviewPanel from "./InterviewPanel";
import PersonaChat from "./PersonaChat";
import { SectionCard } from "../UI/PageStyles";
import { isCandidateProcessing } from "../../lib/status";

type PanelTab = "interview" | "chat";

function CandidateMainPanel({ candidate }: { candidate: CandidateDetail }) {
  const [tab, setTab] = useState<PanelTab>("interview");
  const firstName = (candidate.persona?.name ?? candidate.name).split(/\s+/)[0] ?? candidate.name;

  return (
    <SectionCard>
      <TabHead>
        <Tabs<PanelTab>
          label="Candidate views"
          value={tab}
          onChange={setTab}
          items={[
            {
              key: "interview",
              label: candidate.answers.length > 0 ? `Persona interview · ${candidate.answers.length}` : "Persona interview",
            },
            { key: "chat", label: `Ask ${firstName}` },
          ]}
        />
      </TabHead>
      {tab === "interview" ? (
        <InterviewPanel answers={candidate.answers} isRunning={isCandidateProcessing(candidate.status)} />
      ) : (
        <PersonaChat
          candidateId={candidate.id}
          name={candidate.name}
          firstName={firstName}
          pictureUrl={candidate.pictureUrl}
          ready={!!candidate.persona}
        />
      )}
    </SectionCard>
  );
}

export default CandidateMainPanel;

const TabHead = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  height: 50,
  padding: "0 16px",
  borderBottom: `1px solid ${theme.border100}`,
}));
