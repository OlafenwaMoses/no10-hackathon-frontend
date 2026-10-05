import { IMPORT_TRACKER_FIELDS, type ImportRow, type ImportTrackerFields } from "@api-types";
import type { ColumnMapping, SheetTable } from "./importFields";
import normaliseProfileUrl from "./normaliseProfileUrl";

export type PreviewRow = { key: number; row: ImportRow; valid: boolean };

function cell(values: string[], index: number | null) {
  if (index === null) return undefined;
  return values[index]?.trim() || undefined;
}

export default function buildImportRows(
  table: SheetTable,
  mapping: ColumnMapping,
  notesColumns: number[],
): PreviewRow[] {
  const labels = new Map(table.columns.map((column) => [column.index, column.label]));
  return table.rows.map((values, key) => {
    const name = cell(values, mapping.name)?.replace(/\s+/g, " ") ?? "";
    const extra = notesColumns
      .filter((index) => index !== mapping.notes)
      .flatMap((index) => {
        const value = cell(values, index);
        return value ? [`${labels.get(index) ?? "Column"}: ${value}`] : [];
      });
    const notes = [cell(values, mapping.notes), extra.length ? extra.join("\n") : undefined]
      .filter((part) => part)
      .join("\n\n");
    const profileUrl = cell(values, mapping.profileUrl);
    const tracker: ImportTrackerFields = {};
    for (const field of IMPORT_TRACKER_FIELDS) {
      const value = cell(values, mapping[field]);
      if (value) tracker[field] = value;
    }
    const row: ImportRow = {
      name,
      organisation: cell(values, mapping.organisation),
      title: cell(values, mapping.title),
      profileUrl: profileUrl ? normaliseProfileUrl(profileUrl) : undefined,
      location: cell(values, mapping.location),
      nationality: cell(values, mapping.nationality),
      category: cell(values, mapping.category),
      sector: cell(values, mapping.sector),
      notes: notes || undefined,
      tracker: Object.keys(tracker).length > 0 ? tracker : undefined,
    };
    return { key, row, valid: name.length > 0 };
  });
}
