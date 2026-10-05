import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { createLink } from "@tanstack/react-router";
import type { ShortlistItem } from "@api-types";
import Avatar from "../Avatar";
import ManualMarker from "../ManualMarker";
import InboundMarker from "../InboundMarker";
import Skeleton from "../UI/Skeleton";
import SortHeaderButton from "../UI/SortHeaderButton";
import TruncatedText from "../UI/TruncatedText";
import { ClickableRow, DataTable, TableFrame } from "../UI/TableStyles";
import openAccountRecord from "./openAccountRecord";
import { SHORTLIST_COLUMNS } from "./shortlistColumns";
import useTableSort from "../../hooks/useTableSort";
import type { ShortlistTab } from "../../lib/shortlist/shortlistTabs";

const NAME_WIDTH = 280;
const SKELETON_ROWS = 6;

type ShortlistTableProps = {
  tab: ShortlistTab;
  items: ShortlistItem[] | undefined;
  isLoading: boolean;
  empty?: ReactNode;
};

function ShortlistTable({ tab, items, isLoading, empty }: ShortlistTableProps) {
  const columns = SHORTLIST_COLUMNS[tab];
  const { sort, toggleSort } = useTableSort<string>({
    defaultDirection: (key) => (columns.find((column) => column.key === key)?.descFirst ? "desc" : "asc"),
  });
  const sortColumn = sort && sort.key !== "name" ? columns.find((column) => column.key === sort.key) : undefined;

  const rows = !sort
    ? (items ?? [])
    : [...(items ?? [])].sort((a, b) => {
        const left = sort.key === "name" ? a.candidate.name : (sortColumn?.sortValue?.(a) ?? null);
        const right = sort.key === "name" ? b.candidate.name : (sortColumn?.sortValue?.(b) ?? null);
        if (left === null && right === null) return 0;
        if (left === null) return 1;
        if (right === null) return -1;
        const direction = sort.direction === "asc" ? 1 : -1;
        if (typeof left === "number" && typeof right === "number") return (left - right) * direction;
        return String(left).localeCompare(String(right), undefined, { numeric: true }) * direction;
      });

  if (!isLoading && rows.length === 0 && empty) return <>{empty}</>;

  const minWidth = NAME_WIDTH + columns.reduce((total, column) => total + column.width, 0);
  const open = (item: ShortlistItem) => openAccountRecord(item, item.candidate);

  return (
    <TableFrame>
      <WideTable style={{ minWidth }}>
        <colgroup>
          <col style={{ width: NAME_WIDTH }} />
          {columns.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th>
              <SortHeaderButton
                active={sort?.key === "name"}
                direction={sort?.direction ?? "asc"}
                onClick={() => toggleSort("name")}
              >
                Name
              </SortHeaderButton>
            </th>
            {columns.map((column) => (
              <th key={column.key}>
                {column.sortValue ? (
                  <SortHeaderButton
                    active={sort?.key === column.key}
                    direction={sort?.direction ?? "asc"}
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.label}
                  </SortHeaderButton>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && !items
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
                  {columns.map((column) => (
                    <td key={column.key}>
                      <Skeleton width={Math.min(column.width - 40, 96)} height={11} />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((item) => (
                <ClickableRow
                  key={item.id}
                  tabIndex={0}
                  onClick={() => open(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && event.target === event.currentTarget) open(item);
                  }}
                >
                  <td>
                    <Identity>
                      <Avatar name={item.candidate.name} src={item.candidate.pictureUrl} />
                      <Lines>
                        <NameRow>
                          <NameLink
                            to="/candidates/$candidateId"
                            params={{ candidateId: item.candidateId }}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Name text={item.candidate.name} />
                          </NameLink>
                          {item.candidate.source === "manual" && <ManualMarker compact />}
                          {item.candidate.source === "inbound" && <InboundMarker compact />}
                        </NameRow>
                        <Headline
                          text={
                            [item.candidate.title, item.candidate.organisation].filter(Boolean).join(" · ") ||
                            item.candidate.headline ||
                            ""
                          }
                        />
                      </Lines>
                    </Identity>
                  </td>
                  {columns.map((column) => (
                    <td key={column.key}>{column.render(item)}</td>
                  ))}
                </ClickableRow>
              ))}
        </tbody>
      </WideTable>
    </TableFrame>
  );
}

export default ShortlistTable;

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

const NameAnchor = styled.a(({ theme }) => ({
  minWidth: 0,
  color: theme.textPrimary,
  textDecoration: "none",
  textUnderlineOffset: 3,
  textDecorationColor: theme.border200,
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { textDecoration: "underline" },
  },
  "&:focus-visible": { boxShadow: theme.focusRing, outline: "none", borderRadius: 2 },
}));

const NameLink = createLink(NameAnchor);

const Name = styled(TruncatedText)({
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const Headline = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  fontSize: 12,
  lineHeight: "16px",
  color: theme.textTertiary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const WideTable = styled(DataTable)(({ theme }) => ({
  "& th:first-of-type, & td:first-of-type": {
    position: "sticky",
    left: 0,
    zIndex: 1,
    boxShadow: `inset -1px 0 0 ${theme.borderFaint}`,
  },
  "& th:first-of-type": {
    backgroundColor: theme.surface100,
  },
  "& td:first-of-type": {
    backgroundColor: `var(--row-bg, ${theme.surface00})`,
  },
}));
