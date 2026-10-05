import type { SearchSectorChoice } from "@api-types";
import { ALL, ALL_SECTORS_LABEL } from "../lib/labels";
import Pill from "./UI/Pill";
import SectorTag from "./SectorTag";

function SearchSectorTag({ sector }: { sector: SearchSectorChoice }) {
  if (sector === ALL) return <Pill variant="outline">{ALL_SECTORS_LABEL}</Pill>;
  return <SectorTag sector={sector} />;
}

export default SearchSectorTag;
