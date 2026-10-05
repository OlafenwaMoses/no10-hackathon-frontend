import styled from "@emotion/styled";
import { createFileRoute } from "@tanstack/react-router";
import ScoreCard from "../components/Candidate/ScoreCard";
import LeversCard from "../components/Candidate/LeversCard";
import UkLinksCard from "../components/Candidate/UkLinksCard";
import InterviewSummaryCard from "../components/Candidate/InterviewSummaryCard";
import ClassificationCard from "../components/Candidate/ClassificationCard";
import NetWorthCard from "../components/Candidate/NetWorthCard";
import BackgroundCard from "../components/Candidate/BackgroundCard";
import OfficerNotesCard from "../components/Candidate/OfficerNotesCard";
import PendingCard from "../components/Candidate/PendingCard";
import AccountCard from "../components/Candidate/AccountCard";
import useCandidate from "../hooks/useCandidate";
import { isCandidateProcessing } from "../lib/status";

export const Route = createFileRoute("/_app/candidates/$candidateId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { candidateId } = Route.useParams();
  const { candidate } = useCandidate(candidateId);

  if (!candidate) return null;

  const processing = isCandidateProcessing(candidate.status);

  return (
    <Columns>
      <Main>
        {candidate.score ? (
          <>
            <ScoreCard score={candidate.score} />
            <LeversCard levers={candidate.score.levers} />
          </>
        ) : (
          <PendingCard
            title="Priority score"
            message={processing ? "Scores appear once the interview is complete." : "Not scored."}
            animate={processing}
          />
        )}
        {candidate.ukLinks ? (
          <UkLinksCard ukLinks={candidate.ukLinks} />
        ) : (
          <PendingCard
            title="UK links"
            message={processing ? "Researching UK connections…" : "No UK link research available."}
            animate={processing}
          />
        )}
        <InterviewSummaryCard candidateId={candidate.id} answers={candidate.answers} isRunning={processing} />
      </Main>
      <Side>
        {candidate.shortlist && <AccountCard candidate={candidate} entry={candidate.shortlist} />}
        {candidate.classification ? (
          <ClassificationCard classification={candidate.classification} />
        ) : (
          processing && (
            <PendingCard title="Global Talent Taskforce classification" message="Classifying…" animate />
          )
        )}
        {candidate.netWorth ? (
          <NetWorthCard netWorth={candidate.netWorth} />
        ) : (
          <PendingCard
            title="Net worth"
            message={processing ? "Estimating net worth…" : "Not estimated yet. Rerun the pipeline to add it."}
            animate={processing}
          />
        )}
        {candidate.notes && <OfficerNotesCard notes={candidate.notes} inbound={candidate.source === "inbound"} />}
        <BackgroundCard
          entity={candidate.entity}
          highlights={candidate.highlights}
          linkedinProfile={candidate.linkedinProfile}
          resolution={candidate.resolution}
        />
      </Side>
    </Columns>
  );
}

const Columns = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 380px)",
  alignItems: "start",
  gap: 20,
  "@media (max-width: 1100px)": {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
});

const Main = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
});

const Side = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
});
