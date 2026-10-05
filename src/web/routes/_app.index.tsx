import { createFileRoute, useNavigate } from "@tanstack/react-router";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon, PlusIcon, UserPlusIcon } from "@phosphor-icons/react";
import { CANDIDATE_STATUSES, GTT_CRITERIA, RESIDENCE_REGIONS, SECTORS, TALENT_CATEGORIES } from "../lib/labels";
import StatTiles from "../components/StatTiles";
import CandidateFilterBar from "../components/CandidateFilterBar";
import CandidateTable from "../components/CandidateTable";
import EmptyState from "../components/EmptyState";
import NewSearchModal from "../components/NewSearchModal";
import AddPersonModal from "../components/AddPersonModal";
import Button from "../components/UI/Button";
import { openModal } from "../components/ModalManager";
import { PageInner, PageScroll } from "../components/UI/PageStyles";
import useStats from "../hooks/useStats";
import useCandidates, { type CandidateFilters } from "../hooks/useCandidates";
import parseEnum from "../lib/parseEnum";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): CandidateFilters => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    category: parseEnum(TALENT_CATEGORIES, search.category),
    sector: parseEnum(SECTORS, search.sector),
    criteria: parseEnum(GTT_CRITERIA, search.criteria),
    region: parseEnum(RESIDENCE_REGIONS, search.region),
    status: parseEnum(CANDIDATE_STATUSES, search.status),
  }),
});

function RouteComponent() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { candidates, isLoading, isFiltering, isProcessing } = useCandidates(filters);
  const { stats, isLoading: isStatsLoading } = useStats({ live: isProcessing });
  const hasFilters = !!(
    filters.q ||
    filters.category ||
    filters.sector ||
    filters.criteria ||
    filters.region ||
    filters.status
  );

  const updateFilters = (next: Partial<CandidateFilters>) =>
    void navigate({ search: (prev) => ({ ...prev, ...next }), replace: true });

  return (
    <PageScroll>
      <PageInner>
        <StatTiles stats={stats} isLoading={isStatsLoading} />
        <CandidateFilterBar
          filters={filters}
          onChange={updateFilters}
          resultCount={candidates?.length}
          isFetching={isFiltering}
        />
        <CandidateTable
          candidates={candidates}
          isLoading={isLoading}
          empty={
            hasFilters ? (
              <EmptyState
                icon={MagnifyingGlassIcon}
                title="No matches"
                description="No one in the database matches these filters. Try broadening your search."
              />
            ) : (
              <EmptyState
                icon={MagnifyingGlassIcon}
                title="No talent yet"
                description="Start a search to discover founders, investors and researchers, or add someone you already know about. We check their UK links and interview an AI persona of each one."
                action={
                  <EmptyActions>
                    <Button onClick={() => openModal(<AddPersonModal />)}>
                      <UserPlusIcon size={14} weight="bold" />
                      Add person
                    </Button>
                    <Button variant="primary" onClick={() => openModal(<NewSearchModal />)}>
                      <PlusIcon size={14} weight="bold" />
                      Start a search
                    </Button>
                  </EmptyActions>
                }
              />
            )
          }
        />
      </PageInner>
    </PageScroll>
  );
}

const EmptyActions = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
});
