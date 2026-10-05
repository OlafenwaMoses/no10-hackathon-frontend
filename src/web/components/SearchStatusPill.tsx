import { CheckIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { SearchStatus } from "@api-types";
import Pill from "./UI/Pill";
import Loader from "./UI/Loader";
import { SEARCH_STATUS_LABELS } from "../lib/labels";

function SearchStatusPill({ status }: { status: SearchStatus }) {
  if (status === "complete") {
    return (
      <Pill tone="green" icon={<CheckIcon size={11} weight="bold" />}>
        {SEARCH_STATUS_LABELS[status]}
      </Pill>
    );
  }

  if (status === "failed") {
    return (
      <Pill tone="danger" icon={<WarningCircleIcon size={12} weight="bold" />}>
        {SEARCH_STATUS_LABELS[status]}
      </Pill>
    );
  }

  return (
    <Pill tone={status === "queued" ? "neutral" : "blue"} icon={<Loader size={10} color="currentColor" />}>
      {SEARCH_STATUS_LABELS[status]}
    </Pill>
  );
}

export default SearchStatusPill;
