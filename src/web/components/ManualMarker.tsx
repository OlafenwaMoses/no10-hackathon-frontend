import styled from "@emotion/styled";
import { UserPlusIcon } from "@phosphor-icons/react";
import Pill from "./UI/Pill";
import Tooltip from "./UI/Tooltip";

const TOOLTIP = "Added manually by a Global Talent Taskforce officer";

function ManualMarker({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <Tooltip content={TOOLTIP} openDelay={200}>
        <IconWrap aria-label="Added manually">
          <UserPlusIcon size={12} weight="bold" />
        </IconWrap>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={TOOLTIP} openDelay={200}>
      <span>
        <Pill variant="outline" icon={<UserPlusIcon size={12} />}>
          Added manually
        </Pill>
      </span>
    </Tooltip>
  );
}

export default ManualMarker;

const IconWrap = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 18,
  height: 18,
  borderRadius: 4,
  color: theme.textTertiary,
  backgroundColor: theme.surface200,
}));
