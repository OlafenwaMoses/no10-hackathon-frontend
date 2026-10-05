import type { ShortlistStage } from "@api-types";
import Pill from "../UI/Pill";
import { SHORTLIST_STAGE_SHORT_LABELS } from "../../lib/labels";
import { SHORTLIST_STAGE_TONES } from "../../lib/tones";

function ShortlistStagePill({ stage }: { stage: ShortlistStage }) {
  return (
    <Pill tone={SHORTLIST_STAGE_TONES[stage]} dot>
      {SHORTLIST_STAGE_SHORT_LABELS[stage]}
    </Pill>
  );
}

export default ShortlistStagePill;
