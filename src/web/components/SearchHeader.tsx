import styled from "@emotion/styled";
import { FileXlsIcon, GlobeHemisphereWestIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { SearchDetail } from "@api-types";
import SearchCategoryTag from "./SearchCategoryTag";
import SearchSectorTag from "./SearchSectorTag";
import SearchStatusPill from "./SearchStatusPill";
import ImportedTag from "./ImportedTag";
import ProgressBar from "./ProgressBar";
import { Heading } from "../lib/utilityComponents";
import { Eyebrow } from "./UI/PageStyles";
import formatRelativeTime from "../lib/formatRelativeTime";
import { isSearchActive } from "../lib/status";

function SearchHeader({ search }: { search: SearchDetail }) {
  const isImport = search.kind === "import";
  const target = isImport ? Math.max(search.candidateCount, 1) : Math.max(search.candidateCount, search.numResults);

  return (
    <Card>
      <Top>
        <Titles>
          <Heading h4>{search.name}</Heading>
          {isImport ? (
            <Meta>
              <ImportedTag />
              <MetaItem>
                <FileXlsIcon size={14} />
                {search.query}
              </MetaItem>
              <MetaItem>{formatRelativeTime(search.createdAt)}</MetaItem>
            </Meta>
          ) : (
            <Meta>
              <SearchCategoryTag category={search.category} />
              <SearchSectorTag sector={search.sector} />
              <MetaItem>
                <GlobeHemisphereWestIcon size={14} />
                {search.region ?? "Global"}
              </MetaItem>
              <MetaItem>Started {formatRelativeTime(search.createdAt)}</MetaItem>
            </Meta>
          )}
        </Titles>
        <SearchStatusPill status={search.status} />
      </Top>
      {!isImport && (
        <QueryBlock>
          <Eyebrow>Exa query</Eyebrow>
          <QueryText>{search.query}</QueryText>
        </QueryBlock>
      )}
      <ProgressRow>
        <ProgressBar value={search.scoredCount} max={target} active={isSearchActive(search.status)} />
        <ProgressStats>
          <strong>{search.scoredCount}</strong> scored ·{" "}
          {isImport
            ? `${search.candidateCount} imported`
            : `${search.candidateCount} found · ${search.numResults} requested`}
        </ProgressStats>
      </ProgressRow>
      {search.error && (
        <ErrorRow>
          <WarningCircleIcon size={16} />
          {search.error}
        </ErrorRow>
      )}
    </Card>
  );
}

export default SearchHeader;

const Card = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  padding: 20,
  border: `1px solid ${theme.border100}`,
  borderRadius: 8,
  backgroundColor: theme.surface00,
}));

const Top = styled.div({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
});

const Titles = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minWidth: 0,
});

const Meta = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
});

const MetaItem = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 13,
  color: theme.textTertiary,
}));

const QueryBlock = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "12px 14px",
  borderRadius: 4,
  backgroundColor: theme.surface100,
  border: `1px solid ${theme.borderFaint}`,
}));

const QueryText = styled.p(({ theme }) => ({
  fontSize: 13,
  fontWeight: 400,
  color: theme.textSecondary,
}));

const ProgressRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 16,
});

const ProgressStats = styled.span(({ theme }) => ({
  flexShrink: 0,
  fontSize: 12,
  color: theme.textTertiary,
  fontVariantNumeric: "tabular-nums",
  "& strong": { color: theme.textPrimary, fontWeight: 500 },
}));

const ErrorRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 4,
  fontSize: 13,
  color: theme.danger,
  backgroundColor: theme.dangerHover,
}));
