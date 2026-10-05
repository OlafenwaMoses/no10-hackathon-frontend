import styled from "@emotion/styled";
import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { WarningIcon } from "@phosphor-icons/react";
import CandidateHeader from "../components/Candidate/CandidateHeader";
import CandidateTabs from "../components/Candidate/CandidateTabs";
import PipelineStepper from "../components/Candidate/PipelineStepper";
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
  const onInterview = useLocation({ select: (location) => location.pathname.endsWith("/interview") });
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
          <LoadingColumns>
            <LoadingStack>
              <Skeleton height={240} radius={8} />
              <Skeleton height={220} radius={8} />
            </LoadingStack>
            <LoadingStack>
              <Skeleton height={260} radius={8} />
              <Skeleton height={160} radius={8} />
            </LoadingStack>
          </LoadingColumns>
        </PageInner>
      </PageScroll>
    );
  }

  const showStepper = isCandidateProcessing(candidate.status) || candidate.status === "failed";

  return (
    <PageScroll>
      <PageInner>
        <Top>
          <CandidateHeader candidate={candidate} />
          <CandidateTabs
            candidateId={candidate.id}
            tab={onInterview ? "interview" : "overview"}
            answerCount={candidate.answers.length}
          />
        </Top>
        {showStepper && <PipelineStepper candidate={candidate} />}
        <Outlet />
      </PageInner>
    </PageScroll>
  );
}

const Top = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 16,
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

const LoadingColumns = styled.div({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 380px)",
  alignItems: "start",
  gap: 20,
});

const LoadingStack = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});
