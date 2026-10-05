import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { CandidateListItem } from "@api-types";
import { CANDIDATE_STATUSES, GTT_LEVER_LABELS, RESIDENCE_REGION_LABELS } from "../lib/labels";
import Avatar from "./Avatar";
import CategoryTag from "./CategoryTag";
import SectorTag from "./SectorTag";
import VerdictPill from "./VerdictPill";
import ScoreMeter from "./ScoreMeter";
import CandidateStatusPill from "./CandidateStatusPill";
import ManualMarker from "./ManualMarker";
import Skeleton from "./UI/Skeleton";
import SortHeaderButton from "./UI/SortHeaderButton";
import TruncatedText from "./UI/TruncatedText";
import { Blank, ClickableRow, DataTable, TableFrame } from "./UI/TableStyles";
import useTableSort from "../hooks/useTableSort";

type SortKey =
  | "name"
  | "category"
  | "sector"
  | "region"
  | "ukLinks"
  | "openness"
  | "overall"
  | "lever"
  | "status";

const NUMERIC_KEYS: SortKey[] = ["ukLinks", "openness", "overall"];

const COLUMNS: { key: SortKey; label: string; width: number | string }[] = [
  { key: "name", label: "Name", width: "26%" },
  { key: "category", label: "Category", width: 124 },
  { key: "sector", label: "Sector", width: 168 },
  { key: "region", label: "Residence", width: 150 },
  { key: "ukLinks", label: "UK links", width: 116 },
  { key: "openness", label: "Openness", width: 112 },
  { key: "overall", label: "Score", width: 124 },
  { key: "lever", label: "Top lever", width: "18%" },
  { key: "status", label: "Status", width: 132 },
];

const SKELETON_ROWS = 8;

function sortValue(candidate: CandidateListItem, key: SortKey): string | number | null {
  switch (key) {
    case "name":
      return candidate.name;
    case "category":
      return candidate.category;
    case "sector":
      return candidate.sector;
    case "region":
      return candidate.residenceRegion
        ? RESIDENCE_REGION_LABELS[candidate.residenceRegion]
        : (candidate.location ?? candidate.country);
    case "ukLinks":
      return candidate.ukLinkScore;
    case "openness":
      return candidate.opennessScore;
    case "overall":
      return candidate.overallScore;
    case "lever":
      return candidate.topLevers[0] ? GTT_LEVER_LABELS[candidate.topLevers[0]] : null;
    case "status":
      return CANDIDATE_STATUSES.indexOf(candidate.status);
  }
}

type CandidateTableProps = {
  candidates: CandidateListItem[] | undefined;
  isLoading: boolean;
  empty?: ReactNode;
};

function CandidateTable({ candidates, isLoading, empty }: CandidateTableProps) {
  const navigate = useNavigate();
  const { sort, toggleSort } = useTableSort<SortKey>({
    defaultDirection: (key) => (NUMERIC_KEYS.includes(key) ? "desc" : "asc"),
  });

  const rows = !sort
    ? (candidates ?? [])
    : [...(candidates ?? [])].sort((a, b) => {
        const left = sortValue(a, sort.key);
        const right = sortValue(b, sort.key);
        if (left === null && right === null) return 0;
        if (left === null) return 1;
        if (right === null) return -1;
        const direction = sort.direction === "asc" ? 1 : -1;
        if (typeof left === "number" && typeof right === "number") return (left - right) * direction;
        return String(left).localeCompare(String(right), undefined, { numeric: true }) * direction;
      });

  const open = (candidateId: string) =>
    void navigate({ to: "/candidates/$candidateId", params: { candidateId } });

  if (!isLoading && rows.length === 0 && empty) return <>{empty}</>;

  return (
    <TableFrame>
      <DataTable>
        <colgroup>
          {COLUMNS.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.key}>
                <SortHeaderButton
                  active={sort?.key === column.key}
                  direction={sort?.direction ?? "asc"}
                  onClick={() => toggleSort(column.key)}
                >
                  {column.label}
                </SortHeaderButton>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && !candidates
            ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <tr key={index}>
                  <td>
                    <Identity>
                      <Skeleton width={32} height={32} circle />
                      <Lines>
                        <Skeleton width={index % 2 ? 140 : 110} height={11} />
                        <Skeleton width={index % 3 ? 180 : 150} height={9} />
                      </Lines>
                    </Identity>
                  </td>
                  {COLUMNS.slice(1).map((column) => (
                    <td key={column.key}>
                      <Skeleton width={column.key === "lever" ? 120 : 64} height={11} />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((candidate) => (
                <ClickableRow
                  key={candidate.id}
                  tabIndex={0}
                  onClick={() => open(candidate.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") open(candidate.id);
                  }}
                >
                  <td>
                    <Identity>
                      <Avatar name={candidate.name} src={candidate.pictureUrl} />
                      <Lines>
                        <NameRow>
                          <Name text={candidate.name} />
                          {candidate.source === "manual" && <ManualMarker compact />}
                        </NameRow>
                        <Headline
                          text={
                            candidate.headline ??
                            [candidate.title, candidate.organisation].filter(Boolean).join(" · ")
                          }
                        />
                      </Lines>
                    </Identity>
                  </td>
                  <td>
                    <CategoryTag category={candidate.category} />
                  </td>
                  <td>
                    <Stack>
                      <SectorTag sector={candidate.sector} />
                      {candidate.subSector && <Secondary text={candidate.subSector} />}
                    </Stack>
                  </td>
                  <td>
                    {candidate.residenceRegion ? (
                      <Stack>
                        <Primary text={RESIDENCE_REGION_LABELS[candidate.residenceRegion]} />
                        {(candidate.location || candidate.country) && (
                          <Secondary text={candidate.location ?? candidate.country ?? ""} />
                        )}
                      </Stack>
                    ) : candidate.location || candidate.country ? (
                      <Primary text={candidate.location ?? candidate.country ?? ""} />
                    ) : (
                      <Blank>—</Blank>
                    )}
                  </td>
                  <td>
                    {candidate.ukLinkVerdict ? (
                      <VerdictPill verdict={candidate.ukLinkVerdict} />
                    ) : (
                      <Blank>—</Blank>
                    )}
                  </td>
                  <td>
                    <ScoreMeter value={candidate.opennessScore} width={40} />
                  </td>
                  <td>
                    <ScoreMeter value={candidate.overallScore} emphasis />
                  </td>
                  <td>
                    {candidate.topLevers[0] ? (
                      <LeverText text={GTT_LEVER_LABELS[candidate.topLevers[0]]} />
                    ) : (
                      <Blank>—</Blank>
                    )}
                  </td>
                  <td>
                    <CandidateStatusPill status={candidate.status} short />
                  </td>
                </ClickableRow>
              ))}
        </tbody>
      </DataTable>
    </TableFrame>
  );
}

export default CandidateTable;

const Identity = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 10,
  minWidth: 0,
});

const Lines = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 3,
  minWidth: 0,
});

const NameRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 6,
  minWidth: 0,
});

const Stack = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 3,
  minWidth: 0,
});

const Name = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Headline = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  fontSize: 12,
  lineHeight: "16px",
  color: theme.textTertiary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Primary = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  maxWidth: "100%",
  color: theme.textSecondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Secondary = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  maxWidth: "100%",
  fontSize: 12,
  lineHeight: "16px",
  color: theme.textTertiary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const LeverText = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  color: theme.textSecondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));
