import { HandshakeIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import type { OutreachStatus } from "@api-types";
import Pill from "./UI/Pill";
import { OUTREACH_STATUS_LABELS } from "../lib/labels";
import { OUTREACH_TONES } from "../lib/tones";

function OutreachStatusPill({ status }: { status: OutreachStatus }) {
  const icon =
    status === "converted" ? <HandshakeIcon size={12} weight="bold" /> : <PaperPlaneTiltIcon size={12} />;

  return (
    <Pill tone={OUTREACH_TONES[status]} variant={status === "not_contacted" ? "outline" : "soft"} icon={icon}>
      {OUTREACH_STATUS_LABELS[status]}
    </Pill>
  );
}

export default OutreachStatusPill;
