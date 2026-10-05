import styled from "@emotion/styled";
import { createLink, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowClockwiseIcon,
  ArrowSquareOutIcon,
  FlagIcon,
  MapPinIcon,
  SealCheckIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { CandidateDetail } from "@api-types";
import Avatar from "../Avatar";
import CategoryTag from "../CategoryTag";
import SectorTag from "../SectorTag";
import CandidateStatusPill from "../CandidateStatusPill";
import ManualMarker from "../ManualMarker";
import Pill from "../UI/Pill";
import Tooltip from "../UI/Tooltip";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import ConfirmModal from "../UI/ConfirmModal";
import { openModal } from "../ModalManager";
import { Heading } from "../../lib/utilityComponents";
import { GTT_CRITERIA_LABELS, RESIDENCE_REGION_LABELS } from "../../lib/labels";
import useRerunCandidate from "../../hooks/useRerunCandidate";
import useDeleteCandidate from "../../hooks/useDeleteCandidate";

function CandidateHeader({ candidate }: { candidate: CandidateDetail }) {
  const navigate = useNavigate();
  const { rerunCandidate, isRerunning } = useRerunCandidate();
  const { deleteCandidate } = useDeleteCandidate();
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

  return (
    <Wrapper>
      <Avatar name={candidate.name} src={candidate.pictureUrl} size={72} />
      <Info>
        <NameRow>
          <Heading h4>{candidate.name}</Heading>
          <CandidateStatusPill status={candidate.status} />
          {candidate.source === "manual" && <ManualMarker />}
        </NameRow>
        {(role || candidate.headline) && <Role>{role || candidate.headline}</Role>}
        <Meta>
          <CategoryTag category={candidate.category} />
          <SectorTag sector={candidate.sector} />
          {candidate.subSector && <SubSector>{candidate.subSector}</SubSector>}
          {candidate.criteria && candidate.criteria !== "na" && (
            <Tooltip content="GTT criteria" openDelay={200}>
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
          <ProfileLink href={candidate.profileUrl} target="_blank" rel="noreferrer">
            Profile
            <ArrowSquareOutIcon size={14} />
          </ProfileLink>
        )}
        <Button size="sm" onClick={() => void rerun()} disabled={isRerunning}>
          {isRerunning ? <Loader size={14} /> : <ArrowClockwiseIcon size={14} />}
          Rerun
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() =>
            openModal(
              <ConfirmModal
                title={`Delete ${candidate.name}?`}
                message="This removes them, their persona, interview and chat history from the database. This can't be undone."
                confirmLabel="Delete"
                onConfirm={() => void remove()}
              />,
            )
          }
        >
          <TrashIcon size={14} />
          Delete
        </Button>
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
  gap: 12,
  minWidth: 0,
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
  gap: 6,
  height: 36,
  padding: "0 14px",
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 600,
  color: theme.textSecondary,
  textDecoration: "none",
  transition: "background-color 200ms ease, color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: theme.transparentHover, color: theme.textPrimary },
  },
}));

const SearchLink = createLink(SearchAnchor);
