import type { ColumnMapping, SheetTable } from "./importFields";

export default function defaultNotesColumns(table: SheetTable, mapping: ColumnMapping) {
  const mapped = new Set(Object.values(mapping).filter((index) => index !== null));
  return table.columns
    .filter((column) => !mapped.has(column.index) && table.rows.some((row) => row[column.index]))
    .map((column) => column.index);
}
