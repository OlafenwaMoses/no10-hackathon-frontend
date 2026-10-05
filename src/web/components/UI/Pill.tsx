import styled from "@emotion/styled";
import type { ReactNode } from "react";
import type { Tone } from "../../lib/tones";

type PillProps = {
  tone?: Tone;
  variant?: "soft" | "outline";
  icon?: ReactNode;
  dot?: boolean;
  children: ReactNode;
};

function Pill({ tone = "neutral", variant = "soft", icon, dot, children }: PillProps) {
  return (
    <Wrapper data-tone={tone} data-variant={variant}>
      {dot && <Dot />}
      {icon}
      <Label>{children}</Label>
    </Wrapper>
  );
}

export default Pill;

const Wrapper = styled.span(({ theme }) => ({
  "--tone-bg": theme.surface200,
  "--tone-fg": theme.textSecondary,
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  maxWidth: "100%",
  minWidth: 0,
  height: 22,
  padding: "0 8px",
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1,
  whiteSpace: "nowrap",
  color: "var(--tone-fg)",
  backgroundColor: "var(--tone-bg)",
  border: "1px solid transparent",
  "& svg": { flexShrink: 0 },
  "&[data-tone='blue']": { "--tone-bg": theme.toneBlueBg, "--tone-fg": theme.toneBlueFg },
  "&[data-tone='green']": { "--tone-bg": theme.toneGreenBg, "--tone-fg": theme.toneGreenFg },
  "&[data-tone='amber']": { "--tone-bg": theme.toneAmberBg, "--tone-fg": theme.toneAmberFg },
  "&[data-tone='rose']": { "--tone-bg": theme.toneRoseBg, "--tone-fg": theme.toneRoseFg },
  "&[data-tone='violet']": { "--tone-bg": theme.toneVioletBg, "--tone-fg": theme.toneVioletFg },
  "&[data-tone='teal']": { "--tone-bg": theme.toneTealBg, "--tone-fg": theme.toneTealFg },
  "&[data-tone='danger']": { "--tone-bg": theme.dangerHover, "--tone-fg": theme.danger },
  "&[data-variant='outline']": {
    backgroundColor: theme.surface00,
    borderColor: theme.border100,
    color: theme.textSecondary,
  },
}));

const Dot = styled.span({
  width: 6,
  height: 6,
  flexShrink: 0,
  borderRadius: "50%",
  backgroundColor: "var(--tone-fg)",
});

const Label = styled.span({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
});
