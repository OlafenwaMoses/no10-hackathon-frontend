import styled from "@emotion/styled";
import { useState } from "react";
import type {
  CandidateStatus,
  GttCriteria,
  OutreachStatus,
  ResidenceRegion,
  Sector,
  TalentCategory,
} from "@api-types";
import SearchBar from "./UI/SearchBar";
import FilterDropdown from "./FilterDropdown";
import Button from "./UI/Button";
import Loader from "./UI/Loader";
import {
  CANDIDATE_STATUSES,
  CANDIDATE_STATUS_LABELS,
  GTT_CRITERIA,
  GTT_CRITERIA_LABELS,
  OUTREACH_STATUSES,
  OUTREACH_STATUS_LABELS,
  RESIDENCE_REGIONS,
  RESIDENCE_REGION_LABELS,
  SECTORS,
  SECTOR_LABELS,
  TALENT_CATEGORIES,
  TALENT_CATEGORY_LABELS,
} from "../lib/labels";
import type { CandidateFilters } from "../hooks/useCandidates";

type CandidateFilterBarProps = {
  filters: CandidateFilters;
  onChange: (next: Partial<CandidateFilters>) => void;
  resultCount: number | undefined;
  isFetching: boolean;
};

function CandidateFilterBar({ filters, onChange, resultCount, isFetching }: CandidateFilterBarProps) {
  const hasFilters = !!(
    filters.q ||
    filters.category ||
    filters.sector ||
    filters.criteria ||
    filters.region ||
    filters.status ||
    filters.outreach
  );
  const [searchInput, setSearchInput] = useState({ key: 0, seed: filters.q ?? "" });

  return (
    <Bar>
      <SearchBar
        key={searchInput.key}
        label="Search candidates"
        placeholder="Search name, organisation, industry…"
        defaultQuery={searchInput.seed}
        onQueryChange={(q) => {
          if ((filters.q ?? "") !== q) onChange({ q: q || undefined });
        }}
      />
      <Divider />
      <FilterDropdown<TalentCategory>
        label="Category"
        allLabel="All categories"
        value={filters.category}
        options={TALENT_CATEGORIES.map((value) => ({ value, label: TALENT_CATEGORY_LABELS[value] }))}
        onChange={(category) => onChange({ category })}
      />
      <FilterDropdown<Sector>
        label="Sector"
        allLabel="All sectors"
        value={filters.sector}
        options={SECTORS.map((value) => ({ value, label: SECTOR_LABELS[value] }))}
        onChange={(sector) => onChange({ sector })}
      />
      <FilterDropdown<GttCriteria>
        label="Criteria"
        allLabel="All criteria"
        value={filters.criteria}
        options={GTT_CRITERIA.map((value) => ({ value, label: GTT_CRITERIA_LABELS[value] }))}
        onChange={(criteria) => onChange({ criteria })}
      />
      <FilterDropdown<ResidenceRegion>
        label="Region"
        allLabel="All regions"
        value={filters.region}
        options={RESIDENCE_REGIONS.map((value) => ({ value, label: RESIDENCE_REGION_LABELS[value] }))}
        onChange={(region) => onChange({ region })}
      />
      <FilterDropdown<CandidateStatus>
        label="Status"
        allLabel="All statuses"
        value={filters.status}
        options={CANDIDATE_STATUSES.map((value) => ({ value, label: CANDIDATE_STATUS_LABELS[value] }))}
        onChange={(status) => onChange({ status })}
      />
      <FilterDropdown<OutreachStatus>
        label="Outreach"
        allLabel="All outreach"
        value={filters.outreach}
        options={OUTREACH_STATUSES.map((value) => ({ value, label: OUTREACH_STATUS_LABELS[value] }))}
        onChange={(outreach) => onChange({ outreach })}
      />
      {hasFilters && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSearchInput({ key: searchInput.key + 1, seed: "" });
            onChange({
              q: undefined,
              category: undefined,
              sector: undefined,
              criteria: undefined,
              region: undefined,
              status: undefined,
              outreach: undefined,
            });
          }}
        >
          Clear
        </Button>
      )}
      <Count>
        {isFetching && <Loader size={12} />}
        {resultCount !== undefined && `${resultCount} ${resultCount === 1 ? "person" : "people"}`}
      </Count>
    </Bar>
  );
}

export default CandidateFilterBar;

const Bar = styled.div({
  display: "flex",
  alignItems: "center",
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
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginLeft: "auto",
  fontSize: 12,
  color: theme.textTertiary,
  fontVariantNumeric: "tabular-nums",
}));
