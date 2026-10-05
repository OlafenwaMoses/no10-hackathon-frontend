import styled from "@emotion/styled";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import type { CandidateDetail, CandidateStatus } from "@api-types";
import Loader from "../UI/Loader";

const BASE_STEPS: { status: CandidateStatus; label: string }[] = [
  { status: "discovered", label: "Discovered" },
  { status: "resolving", label: "Finding profile" },
  { status: "enriching", label: "Researching UK links" },
  { status: "building_persona", label: "Building persona" },
  { status: "interviewing", label: "Interviewing" },
  { status: "scoring", label: "Scoring" },
  { status: "scored", label: "Scored" },
];

function failedStatus(candidate: CandidateDetail): CandidateStatus {
  if (candidate.source === "manual" && !candidate.resolution) return "resolving";
  if (!candidate.ukLinks) return "enriching";
  if (!candidate.persona) return "building_persona";
  if (candidate.answers.length === 0) return "interviewing";
  return "scoring";
}

function PipelineStepper({ candidate }: { candidate: CandidateDetail }) {
  const steps =
    candidate.source === "manual"
      ? BASE_STEPS.map((step) => (step.status === "discovered" ? { ...step, label: "Added" } : step))
      : BASE_STEPS.filter((step) => step.status !== "resolving");
  const failed = candidate.status === "failed";
  const currentStatus = failed ? failedStatus(candidate) : candidate.status;
  const current = steps.findIndex((step) => step.status === currentStatus);

  return (
    <Wrapper data-failed={failed || undefined}>
      <Steps>
        {steps.map((step, index) => {
          const state =
            index < current || candidate.status === "scored"
              ? "done"
              : index === current
                ? failed
                  ? "failed"
                  : "active"
                : "pending";
          return (
            <Step key={step.status} data-state={state}>
              <Node>
                {state === "done" && <CheckIcon size={11} weight="bold" />}
                {state === "active" && <Loader size={12} color="currentColor" />}
                {state === "failed" && <XIcon size={11} weight="bold" />}
              </Node>
              <StepLabel>{step.label}</StepLabel>
              {index < steps.length - 1 && <Connector data-done={index < current || undefined} />}
            </Step>
          );
        })}
      </Steps>
      {failed && candidate.error && <ErrorText>{candidate.error}</ErrorText>}
    </Wrapper>
  );
}

export default PipelineStepper;

const Wrapper = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: "16px 20px",
  borderRadius: 8,
  border: `1px solid ${theme.border100}`,
  backgroundColor: theme.surface00,
  "&[data-failed]": {
    borderColor: theme.dangerBorder,
  },
}));

const Steps = styled.ol({
  display: "flex",
  alignItems: "flex-start",
  padding: 0,
  listStyle: "none",
});

const Step = styled.li(({ theme }) => ({
  "--node-bg": theme.surface200,
  "--node-fg": theme.textTertiary,
  "--node-border": theme.border200,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  flex: 1,
  minWidth: 0,
  "&[data-state='done']": {
    "--node-bg": theme.successFg,
    "--node-fg": theme.textOnColor,
    "--node-border": theme.successFg,
  },
  "&[data-state='active']": {
    "--node-bg": theme.toneBlueBg,
    "--node-fg": theme.toneBlueFg,
    "--node-border": theme.toneBlueFg,
  },
  "&[data-state='failed']": {
    "--node-bg": theme.danger,
    "--node-fg": theme.textOnColor,
    "--node-border": theme.danger,
  },
}));

const Node = styled.span({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  borderRadius: "50%",
  color: "var(--node-fg)",
  backgroundColor: "var(--node-bg)",
  border: "1.5px solid var(--node-border)",
  transition: "background-color 0.3s ease, border-color 0.3s ease",
});

const StepLabel = styled.span(({ theme }) => ({
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 12,
  color: theme.textTertiary,
  "[data-state='done'] > &, [data-state='active'] > &": {
    color: theme.textPrimary,
  },
  "[data-state='failed'] > &": {
    color: theme.danger,
  },
}));

const Connector = styled.span(({ theme }) => ({
  position: "absolute",
  top: 10,
  left: "calc(50% + 15px)",
  right: "calc(-50% + 15px)",
  height: 2,
  borderRadius: 1,
  backgroundColor: theme.border100,
  transition: "background-color 0.3s ease",
  "&[data-done]": {
    backgroundColor: theme.successFg,
  },
}));

const ErrorText = styled.p(({ theme }) => ({
  padding: "8px 12px",
  borderRadius: 4,
  fontSize: 13,
  fontWeight: 400,
  color: theme.danger,
  backgroundColor: theme.dangerHover,
}));
