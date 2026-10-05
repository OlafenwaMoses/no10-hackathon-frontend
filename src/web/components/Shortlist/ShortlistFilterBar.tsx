import styled from "@emotion/styled";
import { useState } from "react";
import { RAG_VALUES, SHORTLIST_STAGE_LABELS, type Rag, type ShortlistStage } from "@api-types";
import Tabs from "../UI/Tabs";
import SearchBar from "../UI/SearchBar";
import Button from "../UI/Button";
import FilterDropdown from "../FilterDropdown";
import { RAG_LABELS } from "../../lib/labels";
import {
  ACTIVE_STAGES,
  SHORTLIST_TABS,
  SHORTLIST_TAB_LABELS,
  type ShortlistTab,
} from "../../lib/shortlist/shortlistTabs";
import type { ShortlistFilters } from "../../lib/shortlist/filterShortlist";

type ShortlistFilterBarProps = {
  filters: ShortlistFilters;
  onChange: (next: Partial<ShortlistFilters>) => void;
  tabCounts: Record<ShortlistTab, number> | undefined;
  accountManagers: string[];
  resultCount: number | undefined;
};

function ShortlistFilterBar({ filters, onChange, tabCounts, accountManagers, resultCount }: ShortlistFilterBarProps) {
  const tab = filters.tab ?? "active";
  const hasFilters = !!(filters.q || filters.manager || filters.stage || filters.rag);
  const [searchInput, setSearchInput] = useState({ key: 0, seed: filters.q ?? "" });

  return (
    <Wrapper>
      <TabBar>
        <Tabs<ShortlistTab>
          label="Shortlist sections"
          flush
          value={tab}
          onChange={(next) => onChange({ tab: next === "active" ? undefined : next, stage: undefined })}
          items={SHORTLIST_TABS.map((key) => ({
            key,
            label: tabCounts ? `${SHORTLIST_TAB_LABELS[key]} · ${tabCounts[key]}` : SHORTLIST_TAB_LABELS[key],
          }))}
        />
      </TabBar>
      <Bar>
        <SearchBar
          key={searchInput.key}
          label="Search the shortlist"
          placeholder="Search name, organisation, next step…"
          defaultQuery={searchInput.seed}
          onQueryChange={(q) => {
            if ((filters.q ?? "") !== q) onChange({ q: q || undefined });
          }}
        />
        <Divider />
        <FilterDropdown<string>
          label="Account manager"
          allLabel="All account managers"
          value={filters.manager}
          options={accountManagers.map((value) => ({ value, label: value }))}
          onChange={(manager) => onChange({ manager })}
        />
        {tab === "active" && (
          <FilterDropdown<ShortlistStage>
            label="Stage"
            allLabel="All active stages"
            value={filters.stage}
            options={ACTIVE_STAGES.map((value) => ({ value, label: SHORTLIST_STAGE_LABELS[value] }))}
            onChange={(stage) => onChange({ stage })}
          />
        )}
        <FilterDropdown<Rag>
          label="Success RAG"
          allLabel="Any RAG"
          value={filters.rag}
          options={RAG_VALUES.map((value) => ({ value, label: RAG_LABELS[value] }))}
          onChange={(rag) => onChange({ rag })}
        />
        {hasFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSearchInput({ key: searchInput.key + 1, seed: "" });
              onChange({ q: undefined, manager: undefined, stage: undefined, rag: undefined });
            }}
          >
            Clear
          </Button>
        )}
        <Count>{resultCount !== undefined && `${resultCount} ${resultCount === 1 ? "person" : "people"}`}</Count>
      </Bar>
    </Wrapper>
  );
}

export default ShortlistFilterBar;

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

const TabBar = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  height: 40,
  borderBottom: `1px solid ${theme.border100}`,
}));

const Bar = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 4,
  minWidth: 0,
});

const Divider = styled.span(({ theme }) => ({
  width: 1,
  height: 20,
  margin: "0 6px",
  backgroundColor: theme.border100,
}));

const Count = styled.span(({ theme }) => ({
  marginLeft: "auto",
  fontSize: 12,
  color: theme.textTertiary,
  fontVariantNumeric: "tabular-nums",
}));
