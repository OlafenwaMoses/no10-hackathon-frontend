import styled from "@emotion/styled";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import Pill from "./UI/Pill";
import Tooltip from "./UI/Tooltip";

const TOOLTIP = "Got in touch through the Global Talent Taskforce website";

function InboundMarker({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <Tooltip content={TOOLTIP} openDelay={200}>
        <IconWrap aria-label="Website enquiry">
          <EnvelopeSimpleIcon size={12} weight="bold" />
        </IconWrap>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={TOOLTIP} openDelay={200}>
      <span>
        <Pill tone="teal" icon={<EnvelopeSimpleIcon size={12} />}>
          Website enquiry
        </Pill>
      </span>
    </Tooltip>
  );
}

export default InboundMarker;

const IconWrap = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 18,
  height: 18,
  borderRadius: 4,
  color: theme.toneTealFg,
  backgroundColor: theme.toneTealBg,
}));
