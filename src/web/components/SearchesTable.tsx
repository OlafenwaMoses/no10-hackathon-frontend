import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import type { SearchListItem } from "@api-types";
import CategoryTag from "./CategoryTag";
import SectorTag from "./SectorTag";
import SearchStatusPill from "./SearchStatusPill";
import ProgressBar from "./ProgressBar";
import Skeleton from "./UI/Skeleton";
import TruncatedText from "./UI/TruncatedText";
import { Blank, ClickableRow, DataTable, TableFrame } from "./UI/TableStyles";
import formatRelativeTime from "../lib/formatRelativeTime";
import { isSearchActive } from "../lib/status";

const COLUMNS = [
  { key: "name", label: "Search", width: "34%" },
  { key: "category", label: "Category", width: 124 },
  { key: "sector", label: "Sector", width: 140 },
  { key: "region", label: "Region", width: 150 },
  { key: "status", label: "Status", width: 130 },
  { key: "progress", label: "Progress", width: 180 },
  { key: "created", label: "Created", width: 130 },
];

type SearchesTableProps = {
  searches: SearchListItem[] | undefined;
  isLoading: boolean;
};

function SearchesTable({ searches, isLoading }: SearchesTableProps) {
  const navigate = useNavigate();
  const open = (searchId: string) => void navigate({ to: "/searches/$searchId", params: { searchId } });

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
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && !searches
            ? Array.from({ length: 5 }, (_, index) => (
                <tr key={index}>
                  {COLUMNS.map((column) => (
                    <td key={column.key}>
                      <Skeleton width={column.key === "name" ? 220 : 72} height={11} />
                    </td>
                  ))}
                </tr>
              ))
            : (searches ?? []).map((search) => (
                <ClickableRow
                  key={search.id}
                  tabIndex={0}
                  onClick={() => open(search.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") open(search.id);
                  }}
                >
                  <td>
                    <Lines>
                      <Name text={search.name} />
                      <Query text={search.query} />
                    </Lines>
                  </td>
                  <td>
                    <CategoryTag category={search.category} />
                  </td>
                  <td>
                    <SectorTag sector={search.sector} />
                  </td>
                  <td>{search.region ? <TruncatedText text={search.region} /> : <Muted>Global</Muted>}</td>
                  <td>
                    <SearchStatusPill status={search.status} />
                  </td>
                  <td>
                    <Progress>
                      <ProgressBar
                        value={search.scoredCount}
                        max={Math.max(search.candidateCount, 1)}
                        active={isSearchActive(search.status)}
                        width={72}
                      />
                      <ProgressLabel>
                        {search.candidateCount > 0 ? `${search.scoredCount} / ${search.candidateCount} scored` : <Blank>—</Blank>}
                      </ProgressLabel>
                    </Progress>
                  </td>
                  <td>{formatRelativeTime(search.createdAt)}</td>
                </ClickableRow>
              ))}
        </tbody>
      </DataTable>
    </TableFrame>
  );
}

export default SearchesTable;

const Lines = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 3,
  minWidth: 0,
});

const Name = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  fontWeight: 500,
  color: theme.textPrimary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Query = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  fontSize: 12,
  color: theme.textTertiary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Muted = styled.span(({ theme }) => ({
  color: theme.textTertiary,
}));

const Progress = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 10,
});

const ProgressLabel = styled.span({
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
});
