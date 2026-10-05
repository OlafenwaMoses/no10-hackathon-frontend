import type { Sector } from "@api-types";
import { SECTOR_LABELS } from "../lib/labels";
import Pill from "./UI/Pill";
import { SECTOR_TONES } from "../lib/tones";

function SectorTag({ sector }: { sector: Sector }) {
  return (
    <Pill tone={SECTOR_TONES[sector]} variant="outline" dot>
      {SECTOR_LABELS[sector]}
    </Pill>
  );
}

export default SectorTag;
