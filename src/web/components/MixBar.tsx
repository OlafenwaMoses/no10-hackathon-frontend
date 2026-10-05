import styled from "@emotion/styled";
import Tooltip from "./UI/Tooltip";
import type { Tone } from "../lib/tones";

type MixBarProps = {
  segments: { key: string; label: string; count: number; tone: Tone }[];
};

function MixBar({ segments }: MixBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);
  if (total === 0) return <Track />;

  return (
    <Track>
      {segments
        .filter((segment) => segment.count > 0)
        .map((segment) => (
          <Tooltip key={segment.key} content={`${segment.label}: ${segment.count}`} openDelay={0}>
            <Segment data-tone={segment.tone} style={{ flexGrow: segment.count }} />
          </Tooltip>
        ))}
    </Track>
  );
}

export default MixBar;

const Track = styled.div(({ theme }) => ({
  display: "flex",
  gap: 2,
  width: "100%",
  height: 6,
  borderRadius: 3,
  overflow: "hidden",
  backgroundColor: theme.surface200,
}));

const Segment = styled.span(({ theme }) => ({
  flexBasis: 0,
  minWidth: 4,
  height: "100%",
  backgroundColor: theme.textTertiary,
  "&[data-tone='blue']": { backgroundColor: theme.toneBlueFg },
  "&[data-tone='green']": { backgroundColor: theme.toneGreenFg },
  "&[data-tone='amber']": { backgroundColor: theme.toneAmberFg },
  "&[data-tone='rose']": { backgroundColor: theme.toneRoseFg },
  "&[data-tone='violet']": { backgroundColor: theme.toneVioletFg },
  "&[data-tone='teal']": { backgroundColor: theme.toneTealFg },
  "&[data-tone='danger']": { backgroundColor: theme.danger },
}));
