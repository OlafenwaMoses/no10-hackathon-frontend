import styled from "@emotion/styled";
import { MAX_IMPORT_ROWS } from "@api-types";
import Checkbox from "../UI/Checkbox";
import type { PreviewRow } from "../../lib/import/buildImportRows";

const COST_LOW = 0.05;
const COST_HIGH = 0.1;

type ImportPreviewStepProps = {
  rows: PreviewRow[];
  selected: Set<number>;
  onSelectedChange: (selected: Set<number>) => void;
};

function formatCost(value: number) {
  return value < 10 ? `$${value.toFixed(2)}` : `$${Math.round(value)}`;
}

function ImportPreviewStep({ rows, selected, onSelectedChange }: ImportPreviewStepProps) {
  const validRows = rows.filter((row) => row.valid);
  const invalidCount = rows.length - validRows.length;
  const count = selected.size;
  const allSelected = validRows.length > 0 && count === validRows.length;
  const overLimit = count > MAX_IMPORT_ROWS;
  const trackedCount = validRows.filter((row) => selected.has(row.key) && row.row.tracker).length;

  const toggle = (key: number, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(key);
    else next.delete(key);
    onSelectedChange(next);
  };

  return (
    <Wrapper>
      <Summary>
        <Count>
          <strong>{count}</strong> of {validRows.length} {validRows.length === 1 ? "person" : "people"} selected
          {invalidCount > 0 && <Muted> · {invalidCount} without a name will be skipped</Muted>}
          {trackedCount > 0 && (
            <Muted>
              {" "}
              · {trackedCount} will be added to the shortlist with their tracker details
            </Muted>
          )}
        </Count>
        {count > 0 && (
          <Cost>
            ≈ {formatCost(count * COST_LOW)}–{formatCost(count * COST_HIGH)} in API usage (~$0.05–0.10 per person)
          </Cost>
        )}
      </Summary>
      {overLimit && (
        <Warning>
          You can import up to {MAX_IMPORT_ROWS} people at a time. Deselect {count - MAX_IMPORT_ROWS} to continue.
        </Warning>
      )}
      <Frame>
        <Table>
          <colgroup>
            <col style={{ width: 40 }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <Checkbox
                  checked={allSelected}
                  indeterminate={count > 0 && !allSelected}
                  disabled={validRows.length === 0}
                  label="Select all"
                  onChange={() =>
                    onSelectedChange(allSelected ? new Set() : new Set(validRows.map((row) => row.key)))
                  }
                />
              </th>
              <th>Name</th>
              <th>Organisation</th>
              <th>Role</th>
              <th>Location</th>
              <th>Type</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, row, valid }) => (
              <tr
                key={key}
                data-invalid={!valid}
                data-selected={selected.has(key)}
                onClick={() => valid && toggle(key, !selected.has(key))}
              >
                <td>
                  <Checkbox
                    checked={selected.has(key)}
                    disabled={!valid}
                    label={row.name || "Row without a name"}
                    onChange={(checked) => toggle(key, checked)}
                  />
                </td>
                <td title={row.name}>{valid ? <Name>{row.name}</Name> : <Muted>No name — skipped</Muted>}</td>
                <td title={row.organisation}>{row.organisation ?? <Blank>—</Blank>}</td>
                <td title={row.title}>{row.title ?? <Blank>—</Blank>}</td>
                <td title={row.location}>{row.location ?? <Blank>—</Blank>}</td>
                <td title={row.category}>{row.category ?? <Blank>—</Blank>}</td>
                <td title={row.sector}>{row.sector ?? <Blank>—</Blank>}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Frame>
    </Wrapper>
  );
}

export default ImportPreviewStep;

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 18,
});

const Summary = styled.div({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 8,
});

const Count = styled.span(({ theme }) => ({
  fontSize: 13,
  color: theme.textSecondary,
  "& strong": { color: theme.textPrimary, fontWeight: 500 },
}));

const Cost = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textTertiary,
}));

const Warning = styled.div(({ theme }) => ({
  padding: "10px 12px",
  borderRadius: 4,
  fontSize: 13,
  color: theme.danger,
  backgroundColor: theme.dangerHover,
}));

const Frame = styled.div(({ theme }) => ({
  maxHeight: 380,
  overflow: "auto",
  border: `1px solid ${theme.border200}`,
  borderRadius: 8,
  backgroundColor: theme.surface00,
}));

const Table = styled.table(({ theme }) => ({
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: 13,
  "& th": {
    position: "sticky",
    top: 0,
    zIndex: 1,
    textAlign: "left",
    height: 34,
    padding: "0 10px",
    fontSize: 12,
    fontWeight: 500,
    color: theme.textTertiary,
    backgroundColor: theme.surface100,
    borderBottom: `1px solid ${theme.border200}`,
    whiteSpace: "nowrap",
  },
  "& td": {
    height: 38,
    padding: "0 10px",
    color: theme.textSecondary,
    borderBottom: `1px solid ${theme.borderFaint}`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& th:first-of-type, & td:first-of-type": {
    paddingLeft: 14,
    paddingRight: 0,
  },
  "& tbody tr": {
    cursor: "pointer",
  },
  "& tbody tr[data-invalid='true']": {
    cursor: "default",
  },
  "& tbody tr[data-selected='false'] td:not(:first-of-type)": {
    opacity: 0.5,
  },
  "& tbody tr:last-of-type td": {
    borderBottom: "none",
  },
  "@media (hover: hover) and (pointer: fine)": {
    "& tbody tr[data-invalid='false']:hover td": {
      backgroundColor: theme.surface50,
    },
  },
}));

const Name = styled.span(({ theme }) => ({
  fontWeight: 500,
  color: theme.textPrimary,
}));

const Muted = styled.span(({ theme }) => ({
  color: theme.textTertiary,
}));

const Blank = styled.span(({ theme }) => ({
  color: theme.textDisabled,
}));
