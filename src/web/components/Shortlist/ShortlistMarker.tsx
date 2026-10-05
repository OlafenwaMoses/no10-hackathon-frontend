import styled from "@emotion/styled";
import { StarIcon } from "@phosphor-icons/react";
import type { ShortlistStage } from "@api-types";
import Tooltip from "../UI/Tooltip";
import { SHORTLIST_STAGE_LABELS } from "../../lib/labels";

function ShortlistMarker({ stage }: { stage: ShortlistStage }) {
  return (
    <Tooltip content={`On the shortlist · ${SHORTLIST_STAGE_LABELS[stage]}`} openDelay={200}>
      <IconWrap aria-label="Shortlisted">
        <StarIcon size={12} weight="fill" />
      </IconWrap>
    </Tooltip>
  );
}

export default ShortlistMarker;

const IconWrap = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 18,
  height: 18,
  borderRadius: 4,
  color: theme.toneAmberFg,
  backgroundColor: theme.toneAmberBg,
}));
