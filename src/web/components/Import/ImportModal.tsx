import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeftIcon, FileXlsIcon } from "@phosphor-icons/react";
import { MAX_IMPORT_ROWS, type ImportResponse } from "@api-types";
import ModalShell from "../UI/ModalShell";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import { closeModal } from "../ModalManager";
import ImportDropZone, { ACCEPTED_EXTENSIONS } from "./ImportDropZone";
import ImportMappingStep from "./ImportMappingStep";
import ImportPreviewStep from "./ImportPreviewStep";
import { P } from "../../lib/utilityComponents";
import readWorkbook, { type ParsedSheet } from "../../lib/import/readWorkbook";
import autoMapColumns from "../../lib/import/autoMapColumns";
import defaultNotesColumns from "../../lib/import/defaultNotesColumns";
import buildImportRows from "../../lib/import/buildImportRows";
import { MAPPING_FIELDS, type ColumnMapping, type MappingField } from "../../lib/import/importFields";
import useImportCandidates from "../../hooks/useImportCandidates";

type Step = "file" | "map" | "review";

type Workbook = { fileName: string; sheets: ParsedSheet[] };

const SKIPPED_SHOWN = 5;

function describeSkipped(skipped: ImportResponse["skipped"]) {
  if (skipped.length === 0) return undefined;
  const reasons = new Set(skipped.map((item) => item.reason));
  const shown = skipped.slice(0, SKIPPED_SHOWN);
  const more = skipped.length > SKIPPED_SHOWN ? ` +${skipped.length - SKIPPED_SHOWN} more` : "";
  if (reasons.size === 1) {
    return `Skipped ${skipped.length}: ${shown.map((item) => item.name).join(", ")}${more} — ${skipped[0].reason}`;
  }
  return `Skipped ${skipped.length}: ${shown.map((item) => `${item.name} (${item.reason})`).join(", ")}${more}`;
}

function bestSheet(sheets: ParsedSheet[]) {
  return sheets.reduce((best, sheet) => (sheet.score > best.score ? sheet : best), sheets[0]);
}

function ImportModal() {
  const navigate = useNavigate();
  const { importCandidates, isImporting } = useImportCandidates();
  const [step, setStep] = useState<Step>("file");
  const [isParsing, setIsParsing] = useState(false);
  const [workbook, setWorkbook] = useState<Workbook | null>(null);
  const [sheetName, setSheetName] = useState("");
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [notesColumns, setNotesColumns] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const sheet = workbook?.sheets.find((item) => item.name === sheetName) ?? null;
  const rows = sheet && mapping ? buildImportRows(sheet.table, mapping, notesColumns) : [];
  const selectedRows = rows.filter((row) => row.valid && selected.has(row.key));

  const applySheet = (next: ParsedSheet) => {
    const nextMapping = autoMapColumns(next.table.columns);
    setSheetName(next.name);
    setMapping(nextMapping);
    setNotesColumns(defaultNotesColumns(next.table, nextMapping));
  };

  const handleFile = async (file: File) => {
    const lower = file.name.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.some((extension) => lower.endsWith(extension))) {
      toast.error("Unsupported file", { description: "Choose an Excel (.xlsx, .xls) or CSV file." });
      return;
    }
    setIsParsing(true);
    try {
      const sheets = await readWorkbook(file);
      if (sheets.length === 0) {
        toast.error("No data found", { description: "None of the sheets in this file have any rows." });
        return;
      }
      setWorkbook({ fileName: file.name, sheets });
      applySheet(bestSheet(sheets));
      setStep("map");
    } catch (error) {
      toast.error("Couldn't read this file", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsParsing(false);
    }
  };

  const changeSheet = (name: string) => {
    const next = workbook?.sheets.find((item) => item.name === name);
    if (next) applySheet(next);
  };

  const changeMapping = (field: MappingField, index: number | null) => {
    if (!mapping) return;
    const next: ColumnMapping = { ...mapping, [field]: index };
    if (index !== null) {
      for (const other of MAPPING_FIELDS) {
        if (other !== field && mapping[other] === index) next[other] = null;
      }
      setNotesColumns(notesColumns.filter((item) => item !== index));
    }
    setMapping(next);
  };

  const goToReview = () => {
    setSelected(new Set(rows.filter((row) => row.valid).map((row) => row.key)));
    setStep("review");
  };

  const reset = () => {
    setWorkbook(null);
    setMapping(null);
    setStep("file");
  };

  const submit = async () => {
    if (!workbook || selectedRows.length === 0 || selectedRows.length > MAX_IMPORT_ROWS || isImporting) return;
    try {
      const result = await importCandidates({
        fileName: workbook.fileName,
        rows: selectedRows.map((row) => row.row),
      });
      const description = describeSkipped(result.skipped);
      if (result.created > 0) {
        toast.success(`Importing ${result.created} ${result.created === 1 ? "person" : "people"}`, {
          description: description ?? "Each person goes through the full pipeline — results appear as they're scored.",
          duration: description ? 10000 : undefined,
        });
      } else {
        toast.info("No one new to import", { description, duration: 10000 });
      }
      closeModal();
      if (result.searchId) void navigate({ to: "/searches/$searchId", params: { searchId: result.searchId } });
    } catch (error) {
      toast.error("Import failed", { description: error instanceof Error ? error.message : undefined });
    }
  };

  const nameMapped = mapping?.name !== null && mapping?.name !== undefined;
  const importDisabled = selectedRows.length === 0 || selectedRows.length > MAX_IMPORT_ROWS || isImporting;

  const footer =
    step === "file" ? (
      <Button type="button" onClick={closeModal}>
        Cancel
      </Button>
    ) : step === "map" ? (
      <>
        <Button type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="button" variant="primary" disabled={!nameMapped} onClick={goToReview}>
          Review {rows.filter((row) => row.valid).length} people
        </Button>
      </>
    ) : (
      <>
        <Button type="button" onClick={() => setStep("map")} disabled={isImporting}>
          <ArrowLeftIcon size={14} weight="bold" />
          Back
        </Button>
        <Button type="button" variant="primary" disabled={importDisabled} onClick={() => void submit()}>
          {isImporting && <Loader size={14} color="currentColor" />}
          Import {selectedRows.length} {selectedRows.length === 1 ? "person" : "people"}
        </Button>
      </>
    );

  return (
    <ModalShell title="Import people" width={step === "file" ? 560 : 880} footer={footer}>
      {step === "file" || !workbook || !sheet || !mapping ? (
        <>
          <P textSecondary size="sm">
            Import people from a spreadsheet, e.g. the Taskforce Master Tracker. Each person goes through the full
            pipeline.
          </P>
          <ImportDropZone onFile={(file) => void handleFile(file)} isParsing={isParsing} />
        </>
      ) : (
        <>
          <FileBar>
            <FileXlsIcon size={18} />
            <FileName title={workbook.fileName}>{workbook.fileName}</FileName>
            {step === "review" && <SheetName>· {sheet.name}</SheetName>}
            <Button type="button" variant="ghost" size="sm" onClick={reset} disabled={isImporting}>
              Change file
            </Button>
          </FileBar>
          {step === "map" ? (
            <ImportMappingStep
              sheets={workbook.sheets}
              sheet={sheet}
              onSheetChange={changeSheet}
              mapping={mapping}
              onMappingChange={changeMapping}
              notesColumns={notesColumns}
              onNotesColumnsChange={setNotesColumns}
            />
          ) : (
            <ImportPreviewStep rows={rows} selected={selected} onSelectedChange={setSelected} />
          )}
        </>
      )}
    </ModalShell>
  );
}

export default ImportModal;

const FileBar = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
  marginTop: 4,
  padding: "4px 4px 4px 12px",
  borderRadius: 4,
  border: `1px solid ${theme.borderFaint}`,
  backgroundColor: theme.surface00,
  color: theme.textTertiary,
  "& > button": { marginLeft: "auto", height: 30 },
}));

const FileName = styled.span(({ theme }) => ({
  minWidth: 0,
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const SheetName = styled.span(({ theme }) => ({
  flexShrink: 0,
  fontSize: 13,
  color: theme.textTertiary,
}));
