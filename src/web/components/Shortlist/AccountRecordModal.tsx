import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowRightIcon, TrashIcon } from "@phosphor-icons/react";
import type { ShortlistEntry } from "@api-types";
import ModalShell from "../UI/ModalShell";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import ConfirmModal from "../UI/ConfirmModal";
import Avatar from "../Avatar";
import { openModal } from "../ModalManager";
import AccountPipelineSection from "./AccountPipelineSection";
import AccountPeopleSection from "./AccountPeopleSection";
import AccountLeadSection from "./AccountLeadSection";
import AccountClosureSection from "./AccountClosureSection";
import AccountFailureSection from "./AccountFailureSection";
import toAccountDraft, { type AccountDraft } from "../../lib/shortlist/toAccountDraft";
import diffAccountDraft from "../../lib/shortlist/diffAccountDraft";
import useShortlistSummary from "../../hooks/useShortlistSummary";
import useUpdateShortlistEntry from "../../hooks/useUpdateShortlistEntry";
import useRemoveFromShortlist from "../../hooks/useRemoveFromShortlist";

export type AccountRecordPerson = {
  name: string;
  pictureUrl: string | null;
  title: string | null;
  organisation: string | null;
};

type AccountRecordModalProps = {
  entry: ShortlistEntry;
  person: AccountRecordPerson;
  onClose: () => void;
};

function AccountRecordModal({ entry, person, onClose }: AccountRecordModalProps) {
  const navigate = useNavigate();
  const { summary } = useShortlistSummary();
  const { updateEntry, isSaving } = useUpdateShortlistEntry();
  const { removeFromShortlist } = useRemoveFromShortlist();
  const [draft, setDraft] = useState<AccountDraft>(() => toAccountDraft(entry));
  const patch = diffAccountDraft(entry, draft);
  const dirty = Object.keys(patch).length > 0;
  const role = [person.title, person.organisation].filter(Boolean).join(" · ");

  const change = (next: Partial<AccountDraft>) => setDraft((prev) => ({ ...prev, ...next }));

  const save = async () => {
    if (isSaving) return;
    if (!dirty) {
      onClose();
      return;
    }
    try {
      await updateEntry({ entryId: entry.id, body: patch });
      toast.success("Account record saved", { description: person.name });
      onClose();
    } catch (error) {
      toast.error("Couldn't save the account record", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const remove = async () => {
    try {
      await removeFromShortlist({ entryId: entry.id, candidateId: entry.candidateId });
      toast.success(`${person.name} removed from the shortlist`);
      onClose();
    } catch (error) {
      toast.error("Couldn't remove from the shortlist", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const confirmRemove = () =>
    openModal(
      <ConfirmModal
        title={`Remove ${person.name} from the shortlist?`}
        message="Their account record — stage, RAG ratings, people, next steps and closure details — will be deleted. They stay in the talent database."
        confirmLabel="Remove"
        onConfirm={() => void remove()}
      />,
    );

  const openProfile = () => {
    onClose();
    void navigate({ to: "/candidates/$candidateId", params: { candidateId: entry.candidateId } });
  };

  return (
    <ModalShell
      width={760}
      onClose={onClose}
      header={
        <Header>
          <Avatar name={person.name} src={person.pictureUrl} size={40} />
          <HeaderText>
            <Eyebrow>Account record</Eyebrow>
            <Title>{person.name}</Title>
            {role && <Role>{role}</Role>}
          </HeaderText>
          <ProfileButton type="button" onClick={openProfile}>
            View profile
            <ArrowRightIcon size={12} weight="bold" />
          </ProfileButton>
        </Header>
      }
      footer={
        <>
          <RemoveButton type="button" variant="ghost" size="sm" onClick={confirmRemove}>
            <TrashIcon size={14} />
            Remove from shortlist
          </RemoveButton>
          <Button type="button" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="sm" variant="primary" disabled={isSaving} onClick={() => void save()}>
            {isSaving && <Loader size={14} color="currentColor" />}
            Save
          </Button>
        </>
      }
    >
      <Sections>
        <AccountPipelineSection draft={draft} onChange={change} />
        <AccountPeopleSection
          draft={draft}
          onChange={change}
          accountManagers={summary?.accountManagers ?? []}
          relationshipHolders={summary?.relationshipHolders ?? []}
        />
        <AccountLeadSection draft={draft} onChange={change} />
        {draft.stage === "closed" && <AccountClosureSection draft={draft} onChange={change} />}
        {draft.stage === "failed" && <AccountFailureSection draft={draft} onChange={change} />}
      </Sections>
    </ModalShell>
  );
}

export default AccountRecordModal;

const Header = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 12,
  paddingRight: 44,
  paddingBottom: 18,
  flexShrink: 0,
});

const HeaderText = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 2,
  flex: 1,
  minWidth: 0,
});

const Eyebrow = styled.span(({ theme }) => ({
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: theme.textTertiary,
}));

const Title = styled.h2(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fontDisplay,
  fontSize: 18,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: theme.textPrimary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const Role = styled.span(({ theme }) => ({
  fontSize: 13,
  color: theme.textTertiary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const ProfileButton = styled.button(({ theme }) => ({
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  flexShrink: 0,
  height: 28,
  padding: "0 8px",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 500,
  color: theme.textSecondary,
  cursor: "pointer",
  transition: "background-color 150ms ease, color 150ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: theme.transparentHover, color: theme.textPrimary },
  },
  "&:focus-visible": { boxShadow: theme.focusRing },
}));

const Sections = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 18,
  paddingBottom: 4,
});

const RemoveButton = styled(Button)(({ theme }) => ({
  marginRight: "auto",
  color: theme.danger,
  "& svg": { color: theme.danger },
}));
