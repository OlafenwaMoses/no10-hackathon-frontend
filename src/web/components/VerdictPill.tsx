import type { UkLinkVerdict } from "@api-types";
import Pill from "./UI/Pill";
import { UK_LINK_VERDICT_LABELS } from "../lib/labels";
import { VERDICT_TONES } from "../lib/tones";

function VerdictPill({ verdict }: { verdict: UkLinkVerdict }) {
  return (
    <Pill tone={VERDICT_TONES[verdict]} dot>
      {UK_LINK_VERDICT_LABELS[verdict]}
    </Pill>
  );
}

export default VerdictPill;
