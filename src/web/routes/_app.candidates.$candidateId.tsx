import styled from "@emotion/styled";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { WarningIcon } from "@phosphor-icons/react";
import CandidateHeader from "../components/Candidate/CandidateHeader";
import PipelineStepper from "../components/Candidate/PipelineStepper";
import ScoreCard from "../components/Candidate/ScoreCard";
import LeversCard from "../components/Candidate/LeversCard";
import UkLinksCard from "../components/Candidate/UkLinksCard";
import ClassificationCard from "../components/Candidate/ClassificationCard";
import PersonaCard from "../components/Candidate/PersonaCard";
import BackgroundCard from "../components/Candidate/BackgroundCard";
import OfficerNotesCard from "../components/Candidate/OfficerNotesCard";
import PendingCard from "../components/Candidate/PendingCard";
import CandidateMainPanel from "../components/Candidate/CandidateMainPanel";
import EmptyState from "../components/EmptyState";
import Button from "../components/UI/Button";
import Skeleton from "../components/UI/Skeleton";
import { PageInner, PageScroll } from "../components/UI/PageStyles";
import useCandidate from "../hooks/useCandidate";
import { isCandidateProcessing } from "../lib/status";

export const Route = createFileRoute("/_app/candidates/$candidateId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { candidateId } = Route.useParams();
  const navigate = useNavigate();
  const { candidate, isLoading, error } = useCandidate(candidateId);

  if (error && !candidate) {
    return (
      <PageScroll>
        <PageInner>
          <EmptyState
            icon={WarningIcon}
            title="Candidate not found"
            description={error.message}
            action={<Button onClick={() => void navigate({ to: "/" })}>Back to talent database</Button>}
          />
        </PageInner>
      </PageScroll>
    );
  }

  if (isLoading || !candidate) {
    return (
      <PageScroll>
        <PageInner>
          <LoadingHeader>
            <Skeleton width={72} height={72} circle />
            <LoadingLines>
              <Skeleton width={240} height={24} />
              <Skeleton width={320} height={14} />
              <Skeleton width={200} height={14} />
            </LoadingLines>
          </LoadingHeader>
          <Columns>
            <Side>
              <Skeleton height={280} radius={8} />
              <Skeleton height={220} radius={8} />
            </Side>
            <Skeleton height={520} radius={8} />
          </Columns>
        </PageInner>
      </PageScroll>
    );
  }

  const processing = isCandidateProcessing(candidate.status);
  const showStepper = processing || candidate.status === "failed";

  return (
    <PageScroll>
      <PageInner>
        <CandidateHeader candidate={candidate} />
        {showStepper && <PipelineStepper candidate={candidate} />}
        <Columns>
          <Side>
            {candidate.notes && <OfficerNotesCard notes={candidate.notes} />}
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
            {candidate.classification && <ClassificationCard classification={candidate.classification} />}
            {candidate.ukLinks ? (
              <UkLinksCard ukLinks={candidate.ukLinks} />
            ) : (
              <PendingCard
                title="UK links"
                message={processing ? "Researching UK connections…" : "No UK link research available."}
                animate={processing}
              />
            )}
            {candidate.persona && <PersonaCard persona={candidate.persona} />}
            <BackgroundCard
              entity={candidate.entity}
              highlights={candidate.highlights}
              linkedinProfile={candidate.linkedinProfile}
              resolution={candidate.resolution}
            />
          </Side>
          <CandidateMainPanel candidate={candidate} />
        </Columns>
      </PageInner>
    </PageScroll>
  );
}

const Columns = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(320px, 400px) minmax(0, 1fr)",
  alignItems: "start",
  gap: 20,
});

const Side = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
});

const LoadingHeader = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 20,
});

const LoadingLines = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});
