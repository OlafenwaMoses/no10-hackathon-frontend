import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MagnifyingGlassIcon, StarIcon, UsersThreeIcon } from "@phosphor-icons/react";
import { RAG_VALUES, SHORTLIST_STAGES } from "@api-types";
import ShortlistSummaryTiles from "../components/Shortlist/ShortlistSummaryTiles";
import ShortlistFilterBar from "../components/Shortlist/ShortlistFilterBar";
import ShortlistTable from "../components/Shortlist/ShortlistTable";
import EmptyState from "../components/EmptyState";
import Button from "../components/UI/Button";
import { PageInner, PageScroll } from "../components/UI/PageStyles";
import useShortlist from "../hooks/useShortlist";
import useShortlistSummary from "../hooks/useShortlistSummary";
import parseEnum from "../lib/parseEnum";
import filterShortlist, { type ShortlistFilters } from "../lib/shortlist/filterShortlist";
import tabForStage from "../lib/shortlist/tabForStage";
import { SHORTLIST_TABS, type ShortlistTab } from "../lib/shortlist/shortlistTabs";

const TAB_EMPTY: Record<ShortlistTab, { title: string; description: string }> = {
  active: {
    title: "No active leads",
    description: "Everyone on the shortlist has been closed or marked as failed.",
  },
  closed: {
    title: "No closed accounts yet",
    description: "Move someone to Closed once the Taskforce has finished supporting them, then record the outcome.",
  },
  failed: {
    title: "No failed leads",
    description: "Leads you decide not to pursue — and why — are listed here.",
  },
};

export const Route = createFileRoute("/_app/shortlist")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ShortlistFilters => ({
    tab: parseEnum(SHORTLIST_TABS, search.tab),
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    manager: typeof search.manager === "string" && search.manager ? search.manager : undefined,
    stage: parseEnum(SHORTLIST_STAGES, search.stage),
    rag: parseEnum(RAG_VALUES, search.rag),
  }),
});

function RouteComponent() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { items, isLoading } = useShortlist();
  const { summary, isLoading: isSummaryLoading } = useShortlistSummary();
  const tab = filters.tab ?? "active";
  const visible = items ? filterShortlist(items, filters) : undefined;
  const hasFilters = !!(filters.q || filters.manager || filters.stage || filters.rag);
  const tabCounts = items
    ? SHORTLIST_TABS.reduce<Record<ShortlistTab, number>>(
        (counts, key) => ({ ...counts, [key]: items.filter((item) => tabForStage(item.stage) === key).length }),
        { active: 0, closed: 0, failed: 0 },
      )
    : undefined;

  const updateFilters = (next: Partial<ShortlistFilters>) =>
    void navigate({ search: (prev) => ({ ...prev, ...next }), replace: true });

  if (!isLoading && items?.length === 0) {
    return (
      <PageScroll>
        <PageInner>
          <EmptyState
            icon={StarIcon}
            title="No one on the shortlist yet"
            description="People appear here as soon as you log outreach with them, or when you add them from their profile with “Add to shortlist”. Track their stage, RAG ratings, account manager and next steps — the live version of the Master Tracker."
            action={
              <Button onClick={() => void navigate({ to: "/" })}>
                <UsersThreeIcon size={14} weight="bold" />
                Browse the talent database
              </Button>
            }
          />
        </PageInner>
      </PageScroll>
    );
  }

  return (
    <PageScroll>
      <PageInner>
        <ShortlistSummaryTiles summary={summary} isLoading={isSummaryLoading} />
        <ShortlistFilterBar
          filters={filters}
          onChange={updateFilters}
          tabCounts={tabCounts}
          accountManagers={summary?.accountManagers ?? []}
          resultCount={visible?.length}
        />
        <ShortlistTable
          key={tab}
          tab={tab}
          items={visible}
          isLoading={isLoading}
          empty={
            hasFilters ? (
              <EmptyState
                icon={MagnifyingGlassIcon}
                title="No matches"
                description="No one on this part of the shortlist matches these filters."
              />
            ) : (
              <EmptyState icon={StarIcon} title={TAB_EMPTY[tab].title} description={TAB_EMPTY[tab].description} />
            )
          }
        />
      </PageInner>
    </PageScroll>
  );
}
