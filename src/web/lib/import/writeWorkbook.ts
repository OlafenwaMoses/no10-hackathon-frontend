export type WorkbookCell = string | number | null | { text: string; link: string } | { date: string };

export type WorkbookSheet = {
  name: string;
  columns: { header: string; width: number }[];
  rows: WorkbookCell[][];
};

const EXCEL_EPOCH = Date.UTC(1899, 11, 30);
const DAY_MS = 86_400_000;

function excelSerial(isoDate: string) {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  return (Date.UTC(year, month - 1, day) - EXCEL_EPOCH) / DAY_MS;
}

export default async function writeWorkbook(fileName: string, sheets: WorkbookSheet[]) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const grid = [
      sheet.columns.map((column) => column.header),
      ...sheet.rows.map((row) =>
        row.map((cell) => {
          if (cell === null || typeof cell === "string" || typeof cell === "number") return cell;
          if ("link" in cell) return { t: "s" as const, v: cell.text, l: { Target: cell.link } };
          const serial = excelSerial(cell.date);
          return serial === null ? cell.date : { t: "n" as const, v: serial, z: "dd/mm/yyyy" };
        }),
      ),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(grid);
    worksheet["!cols"] = sheet.columns.map((column) => ({ wch: column.width }));
    worksheet["!autofilter"] = {
      ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: Math.max(sheet.rows.length, 1), c: sheet.columns.length - 1 } }),
    };
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  }
  XLSX.writeFile(workbook, fileName, { compression: true });
}
