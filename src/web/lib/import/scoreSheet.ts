import autoMapColumns from "./autoMapColumns";
import type { SheetTable } from "./importFields";

export default function scoreSheet(sheetName: string, table: SheetTable) {
  const mapping = autoMapColumns(table.columns);
  if (mapping.name === null || table.rows.length === 0) return 0;
  const mappedFields = Object.values(mapping).filter((index) => index !== null).length;
  const nameBonus = /\blead/i.test(sheetName) ? 4 : 0;
  const penalty = /\b(failed|closed|archive|summary)\b/i.test(sheetName) ? 4 : 0;
  return 1 + mappedFields + nameBonus - penalty;
}
