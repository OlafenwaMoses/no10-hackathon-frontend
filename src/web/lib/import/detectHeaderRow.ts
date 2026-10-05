import { EXTRA_HEADER_KEYWORDS, MAPPING_FIELD_KEYWORDS } from "./importFields";
import formatCell from "./formatCell";
import headerMatches from "./headerMatches";
import normaliseHeader from "./normaliseHeader";

const SCAN_ROWS = 10;
const KEYWORDS = [...Object.values(MAPPING_FIELD_KEYWORDS).flat(), ...EXTRA_HEADER_KEYWORDS];

function scoreRow(row: unknown[]) {
  return row.reduce<number>((score, cell) => {
    const header = normaliseHeader(formatCell(cell));
    if (!header) return score;
    return KEYWORDS.some((keyword) => headerMatches(header, keyword)) ? score + 1 : score;
  }, 0);
}

export default function detectHeaderRow(grid: unknown[][]) {
  let best = -1;
  let bestScore = 0;
  grid.slice(0, SCAN_ROWS).forEach((row, index) => {
    const score = scoreRow(row);
    if (score > bestScore) {
      best = index;
      bestScore = score;
    }
  });
  if (best >= 0) return best;
  return Math.max(
    0,
    grid.findIndex((row) => row.some((cell) => formatCell(cell))),
  );
}
