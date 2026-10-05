import { CheckIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { CandidateStatus } from "@api-types";
import Pill from "./UI/Pill";
import Loader from "./UI/Loader";
import { CANDIDATE_STATUS_LABELS, CANDIDATE_STATUS_SHORT_LABELS } from "../lib/labels";

type CandidateStatusPillProps = {
  status: CandidateStatus;
  short?: boolean;
};

function CandidateStatusPill({ status, short }: CandidateStatusPillProps) {
  const label = short ? CANDIDATE_STATUS_SHORT_LABELS[status] : CANDIDATE_STATUS_LABELS[status];

  if (status === "scored") {
    return (
      <Pill tone="green" icon={<CheckIcon size={11} weight="bold" />}>
        {label}
      </Pill>
    );
  }

  if (status === "failed") {
    return (
      <Pill tone="danger" icon={<WarningCircleIcon size={12} weight="bold" />}>
        {label}
      </Pill>
    );
  }

  return (
    <Pill tone="blue" icon={<Loader size={10} color="currentColor" />}>
      {label}
    </Pill>
  );
}

export default CandidateStatusPill;
