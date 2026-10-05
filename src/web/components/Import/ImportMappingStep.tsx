import styled from "@emotion/styled";
import { useState } from "react";
import { CaretRightIcon } from "@phosphor-icons/react";
import { IMPORT_TRACKER_FIELDS } from "@api-types";
import SelectMenu from "../SelectMenu";
import Checkbox from "../UI/Checkbox";
import {
  IMPORT_FIELDS,
  IMPORT_FIELD_LABELS,
  TRACKER_FIELD_LABELS,
  type ColumnMapping,
  type MappingField,
} from "../../lib/import/importFields";
import type { ParsedSheet } from "../../lib/import/readWorkbook";

const NONE = "none";

type ImportMappingStepProps = {
  sheets: ParsedSheet[];
  sheet: ParsedSheet;
  onSheetChange: (name: string) => void;
  mapping: ColumnMapping;
  onMappingChange: (field: MappingField, index: number | null) => void;
  notesColumns: number[];
  onNotesColumnsChange: (columns: number[]) => void;
};

function ImportMappingStep({
  sheets,
  sheet,
  onSheetChange,
  mapping,
  onMappingChange,
  notesColumns,
  onNotesColumnsChange,
}: ImportMappingStepProps) {
  const { table } = sheet;
  const columnOptions = [
    { id: NONE, name: "— None —" },
    ...table.columns.map((column) => ({ id: String(column.index), name: column.label })),
  ];
  const mapped = new Set(Object.values(mapping).filter((index) => index !== null));
  const remaining = table.columns.filter((column) => !mapped.has(column.index));
  const sample = (index: number | null) =>
    index === null ? undefined : table.rows.find((row) => row[index])?.[index]?.split("\n")[0];

  const trackerMapped = IMPORT_TRACKER_FIELDS.filter((field) => mapping[field] !== null).length;
  const [trackerOpen, setTrackerOpen] = useState(trackerMapped > 0);

  const renderField = (field: MappingField, label: string, required?: boolean) => {
    const example = sample(mapping[field]);
    return (
      <Field key={field}>
        <Label>
          {label}
          {required && <Required>required</Required>}
        </Label>
        <SelectMenu
          value={mapping[field] === null ? NONE : String(mapping[field])}
          onChange={(value) => onMappingChange(field, value === NONE ? null : Number(value))}
          options={columnOptions}
        />
        <Example title={example}>{example ? `e.g. ${example}` : " "}</Example>
      </Field>
    );
  };

  const toggleNotesColumn = (index: number, checked: boolean) =>
    onNotesColumnsChange(checked ? [...notesColumns, index] : notesColumns.filter((item) => item !== index));

  return (
    <Wrapper>
      <Section>
        <Field>
          <Label>Sheet</Label>
          <SelectMenu
            value={sheet.name}
            onChange={onSheetChange}
            options={sheets.map((item) => ({ id: item.name, name: item.name }))}
            disabled={sheets.length < 2}
          />
        </Field>
        <Hint>
          Header found on row {table.headerRowIndex + 1} · {table.rows.length}{" "}
          {table.rows.length === 1 ? "row" : "rows"} of data
        </Hint>
      </Section>
      <Section>
        <SectionTitle>Columns</SectionTitle>
        <Grid>{IMPORT_FIELDS.map((field) => renderField(field, IMPORT_FIELD_LABELS[field], field === "name"))}</Grid>
      </Section>
      <Section>
        <GroupToggle type="button" aria-expanded={trackerOpen} onClick={() => setTrackerOpen(!trackerOpen)}>
          <Caret data-open={trackerOpen || undefined}>
            <CaretRightIcon size={12} weight="bold" />
          </Caret>
          Account tracking
          <Required>optional</Required>
          {trackerMapped > 0 && <MappedCount>{trackerMapped} mapped</MappedCount>}
        </GroupToggle>
        {trackerOpen && (
          <>
            <Hint>
              Map Master Tracker columns to add everyone imported to the shortlist with their stage, RAG ratings,
              account manager and next step.
            </Hint>
            <Grid>{IMPORT_TRACKER_FIELDS.map((field) => renderField(field, TRACKER_FIELD_LABELS[field]))}</Grid>
          </>
        )}
      </Section>
      {remaining.length > 0 && (
        <Section>
          <SectionTitle>Also include in notes</SectionTitle>
          <Hint>Added as “Column: value” lines so the AI can use them when assessing each person.</Hint>
          <Chips>
            {remaining.map((column) => {
              const checked = notesColumns.includes(column.index);
              return (
                <Chip key={column.index} data-on={checked} onClick={() => toggleNotesColumn(column.index, !checked)}>
                  <Checkbox
                    checked={checked}
                    label={column.label}
                    onChange={(next) => toggleNotesColumn(column.index, next)}
                  />
                  {column.label}
                </Chip>
              );
            })}
          </Chips>
        </Section>
      )}
    </Wrapper>
  );
}

export default ImportMappingStep;

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 20,
  marginTop: 18,
});

const Section = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const SectionTitle = styled.span(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
}));

const GroupToggle = styled.button(({ theme }) => ({
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  alignSelf: "flex-start",
  gap: 6,
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
  cursor: "pointer",
  borderRadius: 4,
  "&:focus-visible": { boxShadow: theme.focusRing },
}));

const Caret = styled.span(({ theme }) => ({
  display: "inline-flex",
  color: theme.textTertiary,
  transition: "transform 150ms ease",
  "&[data-open]": { transform: "rotate(90deg)" },
}));

const MappedCount = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  height: 20,
  padding: "0 7px",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 500,
  color: theme.textSecondary,
  backgroundColor: theme.selectedBg,
}));

const Grid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "6px 12px",
});

const Field = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
});

const Label = styled.label(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.textSecondary,
}));

const Required = styled.span(({ theme }) => ({
  marginLeft: 4,
  fontWeight: 400,
  color: theme.textTertiary,
}));

const Example = styled.span(({ theme }) => ({
  minHeight: 16,
  fontSize: 11,
  color: theme.textTertiary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Hint = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textTertiary,
}));

const Chips = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
});

const Chip = styled.div(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  height: 30,
  padding: "0 10px 0 8px",
  borderRadius: 4,
  border: `1px solid ${theme.border100}`,
  backgroundColor: theme.surface00,
  fontSize: 12,
  color: theme.textSecondary,
  cursor: "pointer",
  userSelect: "none",
  transition: "border-color 150ms ease, color 150ms ease",
  "&[data-on='true']": {
    borderColor: theme.border200,
    color: theme.textPrimary,
  },
  "&:hover": {
    backgroundColor: theme.surface50,
  },
}));
