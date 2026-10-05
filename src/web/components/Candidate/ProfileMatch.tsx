import styled from "@emotion/styled";
import { ArrowSquareOutIcon, InfoIcon } from "@phosphor-icons/react";
import type { Resolution } from "@api-types";
import Tooltip from "../UI/Tooltip";
import { RESOLUTION_METHOD_LABELS } from "../../lib/labels";

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ProfileMatch({ resolution }: { resolution: Resolution }) {
  const manualOnly = resolution.method === "manual_only" || resolution.confidence === "none";
  const summary = manualOnly
    ? "No public profile matched — using officer details only"
    : `Matched via ${RESOLUTION_METHOD_LABELS[resolution.method]}`;

  return (
    <Wrapper data-confidence={resolution.confidence}>
      <Dot />
      <Text>
        <span>{summary}</span>
        {!manualOnly && <Confidence>· {resolution.confidence}</Confidence>}
        {resolution.confidence === "weak" && <Warning>— check this is the right person</Warning>}
      </Text>
      {resolution.matchedUrl && (
        <MatchLink href={resolution.matchedUrl} target="_blank" rel="noreferrer">
          {hostOf(resolution.matchedUrl)}
          <ArrowSquareOutIcon size={11} />
        </MatchLink>
      )}
      {resolution.steps.length > 0 && (
        <Tooltip
          side="bottom"
          align="end"
          maxWidth={320}
          content={
            <Steps>
              {resolution.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </Steps>
          }
        >
          <StepsTrigger type="button" aria-label="How this profile was matched">
            <InfoIcon size={13} />
          </StepsTrigger>
        </Tooltip>
      )}
    </Wrapper>
  );
}

export default ProfileMatch;

const Wrapper = styled.div(({ theme }) => ({
  "--match-fg": theme.textTertiary,
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 6,
  padding: "7px 10px",
  borderRadius: 4,
  fontSize: 12,
  color: theme.textSecondary,
  backgroundColor: theme.surface100,
  border: `1px solid ${theme.borderFaint}`,
  "&[data-confidence='strong']": { "--match-fg": theme.toneGreenFg },
  "&[data-confidence='weak']": { "--match-fg": theme.toneAmberFg },
}));

const Dot = styled.span({
  width: 6,
  height: 6,
  flexShrink: 0,
  borderRadius: "50%",
  backgroundColor: "var(--match-fg)",
});

const Text = styled.span({
  display: "inline-flex",
  flexWrap: "wrap",
  gap: 4,
  flex: 1,
  minWidth: 0,
});

const Confidence = styled.span({
  color: "var(--match-fg)",
  fontWeight: 500,
});

const Warning = styled.span(({ theme }) => ({
  color: theme.toneAmberFg,
}));

const MatchLink = styled.a(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  color: theme.textSecondary,
  textDecoration: "underline",
  textUnderlineOffset: 3,
  textDecorationColor: theme.border200,
  transition: "color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: theme.textPrimary },
  },
}));

const StepsTrigger = styled.button(({ theme }) => ({
  all: "unset",
  display: "inline-flex",
  color: theme.textTertiary,
  cursor: "help",
  borderRadius: 4,
  "&:focus-visible": { boxShadow: theme.focusRing },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: theme.textPrimary },
  },
}));

const Steps = styled.ol({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  paddingLeft: 16,
  fontSize: 12,
});
