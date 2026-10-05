import styled from "@emotion/styled";
import { createLink, useLocation, useParams } from "@tanstack/react-router";
import { PlusIcon, UserPlusIcon } from "@phosphor-icons/react";
import Button from "../UI/Button";
import NewSearchModal from "../NewSearchModal";
import AddPersonModal from "../AddPersonModal";
import { openModal } from "../ModalManager";
import useCandidate from "../../hooks/useCandidate";
import useSearchRun from "../../hooks/useSearchRun";

export const TOP_BAR_HEIGHT = 55;

function TopBar() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const params = useParams({ strict: false });
  const candidateId = typeof params.candidateId === "string" ? params.candidateId : undefined;
  const searchId = typeof params.searchId === "string" ? params.searchId : undefined;
  const { candidate } = useCandidate(candidateId);
  const { search } = useSearchRun(searchId);

  const onSearches = pathname.startsWith("/searches");
  const section = onSearches
    ? { to: "/searches" as const, label: "Searches" }
    : { to: "/" as const, label: "Talent database" };
  const detailLabel = candidateId ? (candidate?.name ?? "Candidate") : searchId ? (search?.name ?? "Search") : null;
  const showNewSearch = pathname === "/" || pathname === "/searches";

  return (
    <Bar>
      <Crumbs aria-label="Breadcrumb">
        {detailLabel ? (
          <>
            <CrumbLink to={section.to}>{section.label}</CrumbLink>
            <Slash>/</Slash>
            <Current aria-current="page">{detailLabel}</Current>
          </>
        ) : (
          <Current aria-current="page">{section.label}</Current>
        )}
      </Crumbs>
      {showNewSearch && (
        <Actions>
          <Button size="sm" onClick={() => openModal(<AddPersonModal />)}>
            <UserPlusIcon size={14} weight="bold" />
            Add person
          </Button>
          <Button size="sm" variant="primary" onClick={() => openModal(<NewSearchModal />)}>
            <PlusIcon size={14} weight="bold" />
            New search
          </Button>
        </Actions>
      )}
    </Bar>
  );
}

export default TopBar;

const Bar = styled.header(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  height: TOP_BAR_HEIGHT,
  flexShrink: 0,
  padding: "0 20px",
  backgroundColor: theme.surface100,
  borderBottom: `1px solid ${theme.border100}`,
}));

const Crumbs = styled.nav({
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
  fontSize: 14,
});

const Actions = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
});

const CrumbAnchor = styled.a(({ theme }) => ({
  color: theme.textSecondary,
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: "color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: theme.textPrimary },
  },
}));

const CrumbLink = createLink(CrumbAnchor);

const Slash = styled.span(({ theme }) => ({
  color: theme.textDisabled,
}));

const Current = styled.span(({ theme }) => ({
  color: theme.textPrimary,
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 480,
}));
