import styled from "@emotion/styled";
import { createLink, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowClockwiseIcon,
  ArrowSquareOutIcon,
  DotsThreeIcon,
  FlagIcon,
  MapPinIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  SealCheckIcon,
  StarIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { CandidateDetail } from "@api-types";
import Avatar from "../Avatar";
import CategoryTag from "../CategoryTag";
import SectorTag from "../SectorTag";
import CandidateStatusPill from "../CandidateStatusPill";
import ManualMarker from "../ManualMarker";
import InboundMarker from "../InboundMarker";
import ShortlistStagePill from "../Shortlist/ShortlistStagePill";
import openAccountRecord from "../Shortlist/openAccountRecord";
import OutreachStatusPill from "../OutreachStatusPill";
import ReachOutModal from "../ReachOut/ReachOutModal";
import Pill from "../UI/Pill";
import Tooltip from "../UI/Tooltip";
import Button from "../UI/Button";
import Dropdown from "../UI/Dropdown";
import ConfirmModal from "../UI/ConfirmModal";
import { openModal } from "../ModalManager";
import { Heading } from "../../lib/utilityComponents";
import { GTT_CRITERIA_LABELS, RESIDENCE_REGION_LABELS } from "../../lib/labels";
import useRerunCandidate from "../../hooks/useRerunCandidate";
import useDeleteCandidate from "../../hooks/useDeleteCandidate";
import useAddToShortlist from "../../hooks/useAddToShortlist";
import tabForStage from "../../lib/shortlist/tabForStage";

function CandidateHeader({ candidate }: { candidate: CandidateDetail }) {
  const navigate = useNavigate();
  const { rerunCandidate, isRerunning } = useRerunCandidate();
  const { deleteCandidate } = useDeleteCandidate();
  const { addToShortlist, isAdding } = useAddToShortlist();
  const shortlist = candidate.shortlist;
  const role = [candidate.title, candidate.organisation].filter(Boolean).join(" at ");
  const rawLocation = candidate.location ?? candidate.country;
  const regionLabel = candidate.residenceRegion ? RESIDENCE_REGION_LABELS[candidate.residenceRegion] : null;

  const rerun = async () => {
    try {
      await rerunCandidate(candidate.id);
      toast.success("Pipeline restarted", { description: `Re-assessing ${candidate.name}.` });
    } catch (error) {
      toast.error("Couldn't rerun the pipeline", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const remove = async () => {
    try {
      await deleteCandidate(candidate.id);
      toast.success(`${candidate.name} removed`);
      if (candidate.searchId) {
        void navigate({ to: "/searches/$searchId", params: { searchId: candidate.searchId } });
      } else {
        void navigate({ to: "/" });
      }
    } catch (error) {
      toast.error("Couldn't delete this candidate", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const addToList = async () => {
    try {
      const entry = await addToShortlist(candidate.id);
      toast.success(`${candidate.name} added to the shortlist`, {
        action: { label: "Fill in account", onClick: () => openAccountRecord(entry, candidate) },
      });
    } catch (error) {
      toast.error("Couldn't add to the shortlist", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const shortlistItems = shortlist
    ? [
        {
          kind: "item" as const,
          onSelect: () =>
            void navigate({ to: "/shortlist", search: { tab: tabForStage(shortlist.stage), q: candidate.name } }),
          node: (
            <MenuRow>
              <StarIcon size={16} />
              View on shortlist
            </MenuRow>
          ),
        },
        {
          kind: "item" as const,
          onSelect: () => openAccountRecord(shortlist, candidate),
          node: (
            <MenuRow>
              <PencilSimpleIcon size={16} />
              Edit account record
            </MenuRow>
          ),
        },
      ]
    : [
        {
          kind: "item" as const,
          disabled: isAdding,
          onSelect: () => void addToList(),
          node: (
            <MenuRow>
              <StarIcon size={16} />
              Add to shortlist
            </MenuRow>
          ),
        },
      ];

  const confirmDelete = () =>
    openModal(
      <ConfirmModal
        title={`Delete ${candidate.name}?`}
        message="This removes them, their persona, interview, outreach notes and chat history from the database. This can't be undone."
        confirmLabel="Delete"
        onConfirm={() => void remove()}
      />,
    );

  return (
    <Wrapper>
      <Avatar name={candidate.name} src={candidate.pictureUrl} size={72} />
      <Info>
        <NameRow>
          <Heading h4>{candidate.name}</Heading>
          <CandidateStatusPill status={candidate.status} />
          <OutreachStatusPill status={candidate.outreachStatus} />
          {shortlist && (
            <Tooltip content="On the shortlist" openDelay={200}>
              <span>
                <ShortlistStagePill stage={shortlist.stage} />
              </span>
            </Tooltip>
          )}
          {candidate.source === "manual" && <ManualMarker />}
          {candidate.source === "inbound" && <InboundMarker />}
        </NameRow>
        {(role || candidate.headline) && <Role>{role || candidate.headline}</Role>}
        <Meta>
          <CategoryTag category={candidate.category} />
          <SectorTag sector={candidate.sector} />
          {candidate.subSector && <SubSector>{candidate.subSector}</SubSector>}
          {candidate.criteria && candidate.criteria !== "na" && (
            <Tooltip content="Global Talent Taskforce criteria" openDelay={200}>
              <span>
                <Pill variant="outline" icon={<SealCheckIcon size={12} />}>
                  {GTT_CRITERIA_LABELS[candidate.criteria]}
                </Pill>
              </span>
            </Tooltip>
          )}
          {(regionLabel || rawLocation) && (
            <MetaItem>
              <MapPinIcon size={14} />
              {regionLabel ? <Emphasis>{regionLabel}</Emphasis> : rawLocation}
              {regionLabel && rawLocation && rawLocation !== regionLabel && <span>· {rawLocation}</span>}
            </MetaItem>
          )}
          {candidate.nationality && (
            <MetaItem>
              <FlagIcon size={14} />
              {candidate.nationality}
            </MetaItem>
          )}
          {candidate.searchId && candidate.searchName && (
            <MetaItem>
              From
              <SearchLink to="/searches/$searchId" params={{ searchId: candidate.searchId }}>
                {candidate.searchName}
              </SearchLink>
            </MetaItem>
          )}
        </Meta>
      </Info>
      <Actions>
        {candidate.profileUrl && (
          <Tooltip content="Open profile" openDelay={300}>
            <ProfileLink href={candidate.profileUrl} target="_blank" rel="noreferrer" aria-label="Open profile">
              <ArrowSquareOutIcon size={16} />
            </ProfileLink>
          </Tooltip>
        )}
        <Button size="sm" variant="primary" onClick={() => openModal(<ReachOutModal candidateId={candidate.id} />)}>
          <PaperPlaneTiltIcon size={14} weight="bold" />
          Reach out
        </Button>
        <Dropdown
          align="end"
          width={200}
          items={[
            ...shortlistItems,
            { kind: "separator" },
            {
              kind: "item",
              disabled: isRerunning,
              onSelect: () => void rerun(),
              node: (
                <MenuRow>
                  <ArrowClockwiseIcon size={16} />
                  Rerun pipeline
                </MenuRow>
              ),
            },
            { kind: "separator" },
            {
              kind: "item",
              onSelect: confirmDelete,
              node: (
                <MenuRow data-danger>
                  <TrashIcon size={16} />
                  Delete
                </MenuRow>
              ),
            },
          ]}
        >
          <MoreTrigger type="button" aria-label="More actions">
            <DotsThreeIcon size={20} weight="bold" />
          </MoreTrigger>
        </Dropdown>
      </Actions>
    </Wrapper>
  );
}

export default CandidateHeader;

const Wrapper = styled.div({
  display: "flex",
  alignItems: "flex-start",
  gap: 20,
});

const Info = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  flex: 1,
  minWidth: 0,
});

const NameRow = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
  rowGap: 6,
  minWidth: 0,
  "& > h4": { marginRight: 4 },
});

const Role = styled.p(({ theme }) => ({
  fontSize: 15,
  fontWeight: 400,
  color: theme.textSecondary,
}));

const Meta = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 4,
});

const MetaItem = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 13,
  color: theme.textTertiary,
}));

const SubSector = styled.span(({ theme }) => ({
  fontSize: 13,
  color: theme.textSecondary,
}));

const Emphasis = styled.span(({ theme }) => ({
  color: theme.textSecondary,
}));

const SearchAnchor = styled.a(({ theme }) => ({
  color: theme.textSecondary,
  textDecoration: "underline",
  textUnderlineOffset: 3,
  textDecorationColor: theme.border200,
  transition: "color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: theme.textPrimary },
  },
}));

const Actions = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
});

const ProfileLink = styled.a(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 4,
  color: theme.textSecondary,
  transition: "background-color 200ms ease, color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: theme.transparentHover, color: theme.textPrimary },
  },
  "&:focus-visible": { boxShadow: theme.focusRing, outline: "none" },
}));

const MoreTrigger = styled.button(({ theme }) => ({
  all: "unset",
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 4,
  border: `1px solid ${theme.border100}`,
  backgroundColor: theme.surface00,
  color: theme.textSecondary,
  cursor: "pointer",
  transition: "background-color 200ms ease, color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: theme.transparentHover, color: theme.textPrimary },
  },
  "&[data-state='open']": { backgroundColor: theme.transparentActive, color: theme.textPrimary },
  "&:focus-visible": { boxShadow: theme.focusRing },
}));

const MenuRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  color: theme.textPrimary,
  "& svg": { flexShrink: 0, color: theme.textTertiary },
  "&[data-danger]": { color: theme.danger },
  "&[data-danger] svg": { color: theme.danger },
}));

const SearchLink = createLink(SearchAnchor);
