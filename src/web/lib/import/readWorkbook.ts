import buildSheetTable from "./buildSheetTable";
import scoreSheet from "./scoreSheet";
import type { SheetTable } from "./importFields";

export type ParsedSheet = { name: string; table: SheetTable; score: number };

export default async function readWorkbook(file: File): Promise<ParsedSheet[]> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: true });
  return workbook.SheetNames.flatMap((name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet) return [];
    const grid = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: true });
    const table = buildSheetTable(grid);
    if (table.columns.length === 0 || table.rows.length === 0) return [];
    return [{ name, table, score: scoreSheet(name, table) }];
  });
}
