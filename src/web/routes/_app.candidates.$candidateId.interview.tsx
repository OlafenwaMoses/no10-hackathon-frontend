import styled from "@emotion/styled";
import { createFileRoute } from "@tanstack/react-router";
import InterviewPanel from "../components/Candidate/InterviewPanel";
import PersonaChat from "../components/Candidate/PersonaChat";
import { SectionCard, SectionHead } from "../components/UI/PageStyles";
import useCandidate from "../hooks/useCandidate";
import { isCandidateProcessing } from "../lib/status";

export const Route = createFileRoute("/_app/candidates/$candidateId/interview")({
  component: RouteComponent,
});

function RouteComponent() {
  const { candidateId } = Route.useParams();
  const { candidate } = useCandidate(candidateId);

  if (!candidate) return null;

  const firstName = (candidate.persona?.name ?? candidate.name).split(/\s+/)[0] ?? candidate.name;

  return (
    <Columns>
      <SectionCard>
        <SectionHead>
          Persona interview
          <HeadNote>
            {candidate.answers.length > 0
              ? `${candidate.answers.length} questions · simulated from public information`
              : "Simulated from public information"}
          </HeadNote>
        </SectionHead>
        <InterviewPanel answers={candidate.answers} isRunning={isCandidateProcessing(candidate.status)} />
      </SectionCard>
      <ChatColumn>
        <SectionCard>
          <SectionHead>Ask {firstName}</SectionHead>
          <PersonaChat
            candidateId={candidate.id}
            name={candidate.name}
            firstName={firstName}
            pictureUrl={candidate.pictureUrl}
            ready={!!candidate.persona}
          />
        </SectionCard>
      </ChatColumn>
    </Columns>
  );
}

const Columns = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(360px, 460px)",
  alignItems: "start",
  gap: 20,
  "@media (max-width: 1100px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
});

const ChatColumn = styled.div({
  position: "sticky",
  top: 20,
  minWidth: 0,
  "@media (max-width: 1100px)": {
    position: "static",
  },
});

const HeadNote = styled.span(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
  color: theme.textTertiary,
}));
