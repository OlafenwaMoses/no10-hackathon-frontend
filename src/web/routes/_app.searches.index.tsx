import { createFileRoute } from "@tanstack/react-router";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import SearchesTable from "../components/SearchesTable";
import EmptyState from "../components/EmptyState";
import NewSearchModal from "../components/NewSearchModal";
import Button from "../components/UI/Button";
import { openModal } from "../components/ModalManager";
import { PageInner, PageScroll } from "../components/UI/PageStyles";
import { Heading, P } from "../lib/utilityComponents";
import useSearches from "../hooks/useSearches";

export const Route = createFileRoute("/_app/searches/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { searches, isLoading } = useSearches();

  return (
    <PageScroll>
      <PageInner>
        <div>
          <Heading h4>Pipeline runs</Heading>
          <P textSecondary>
            Each search discovers people with Exa, researches their UK links, interviews an AI persona of them and
            scores them for outreach.
          </P>
        </div>
        {!isLoading && searches?.length === 0 ? (
          <EmptyState
            icon={MagnifyingGlassIcon}
            title="No searches yet"
            description="Run your first search to start building the talent database."
            action={
              <Button variant="primary" onClick={() => openModal(<NewSearchModal />)}>
                <PlusIcon size={14} weight="bold" />
                Start a search
              </Button>
            }
          />
        ) : (
          <SearchesTable searches={searches} isLoading={isLoading} />
        )}
      </PageInner>
    </PageScroll>
  );
}
