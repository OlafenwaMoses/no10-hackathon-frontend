import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MagnifyingGlassIcon, WarningIcon } from "@phosphor-icons/react";
import SearchHeader from "../components/SearchHeader";
import CandidateTable from "../components/CandidateTable";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/UI/Skeleton";
import Button from "../components/UI/Button";
import { PageInner, PageScroll } from "../components/UI/PageStyles";
import useSearchRun from "../hooks/useSearchRun";
import { isSearchActive } from "../lib/status";

export const Route = createFileRoute("/_app/searches/$searchId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { searchId } = Route.useParams();
  const navigate = useNavigate();
  const { search, isLoading, error } = useSearchRun(searchId);

  if (error && !search) {
    return (
      <PageScroll>
        <PageInner>
          <EmptyState
            icon={WarningIcon}
            title="Search not found"
            description={error.message}
            action={<Button onClick={() => void navigate({ to: "/searches" })}>Back to searches</Button>}
          />
        </PageInner>
      </PageScroll>
    );
  }

  return (
    <PageScroll>
      <PageInner>
        {search ? <SearchHeader search={search} /> : <Skeleton height={180} radius={8} />}
        <CandidateTable
          candidates={search?.candidates}
          isLoading={isLoading}
          empty={
            <EmptyState
              icon={MagnifyingGlassIcon}
              title={search && isSearchActive(search.status) ? "Discovering people…" : "No candidates"}
              description={
                search && isSearchActive(search.status)
                  ? "Exa is searching for matching people. They'll appear here as soon as they're found."
                  : "This search didn't return anyone. Try a broader query or region."
              }
            />
          }
        />
      </PageInner>
    </PageScroll>
  );
}
