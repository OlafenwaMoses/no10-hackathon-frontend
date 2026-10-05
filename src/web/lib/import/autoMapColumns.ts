import { MAPPING_FIELDS, MAPPING_FIELD_KEYWORDS, type ColumnMapping, type SheetColumn } from "./importFields";
import headerMatches from "./headerMatches";
import normaliseHeader from "./normaliseHeader";

const KEYWORDS_BY_SPECIFICITY = MAPPING_FIELDS.flatMap((field) =>
  MAPPING_FIELD_KEYWORDS[field].map((keyword) => ({ field, keyword })),
).sort((a, b) => b.keyword.length - a.keyword.length);

export default function autoMapColumns(columns: SheetColumn[]): ColumnMapping {
  const mapping = Object.fromEntries(MAPPING_FIELDS.map((field) => [field, null])) as ColumnMapping;
  const used = new Set<number>();
  const headers = columns.map((column) => ({ index: column.index, header: normaliseHeader(column.label) }));

  for (const field of MAPPING_FIELDS) {
    for (const keyword of MAPPING_FIELD_KEYWORDS[field]) {
      const match = headers.find((column) => !used.has(column.index) && column.header === keyword);
      if (match) {
        mapping[field] = match.index;
        used.add(match.index);
        break;
      }
    }
  }

  for (const { field, keyword } of KEYWORDS_BY_SPECIFICITY) {
    if (mapping[field] !== null) continue;
    const match = headers.find((column) => !used.has(column.index) && headerMatches(column.header, keyword));
    if (match) {
      mapping[field] = match.index;
      used.add(match.index);
    }
  }

  return mapping;
}
