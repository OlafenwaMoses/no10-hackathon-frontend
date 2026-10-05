import type { SheetColumn, SheetTable } from "./importFields";
import columnLetter from "./columnLetter";
import detectHeaderRow from "./detectHeaderRow";
import formatCell from "./formatCell";

export default function buildSheetTable(grid: unknown[][]): SheetTable {
  const headerRowIndex = detectHeaderRow(grid);
  const header = grid[headerRowIndex] ?? [];
  const rows = grid
    .slice(headerRowIndex + 1)
    .map((row) => row.map(formatCell))
    .filter((row) => row.some((cell) => cell));
  const width = Math.max(header.length, ...rows.map((row) => row.length));

  const columns: SheetColumn[] = [];
  const seen = new Map<string, number>();
  for (let index = 0; index < width; index++) {
    const raw = formatCell(header[index]);
    const firstLine = raw.split("\n").find((line) => line.trim())?.trim() ?? "";
    const hasData = rows.some((row) => row[index]);
    if (!firstLine && !hasData) continue;
    const base = firstLine || `Column ${columnLetter(index)}`;
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    columns.push({ index, label: count > 1 ? `${base} (${count})` : base });
  }

  return {
    headerRowIndex,
    columns,
    rows: rows.map((row) => Array.from({ length: width }, (_, index) => row[index] ?? "")),
  };
}
