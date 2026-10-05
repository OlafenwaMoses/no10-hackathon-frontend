import styled from "@emotion/styled";
import { toast } from "sonner";
import { ArrowClockwiseIcon, MagnifyingGlassIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { ContactDetails } from "@api-types";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import formatRelativeTime from "../../lib/formatRelativeTime";
import useFindContact from "../../hooks/useFindContact";
import useContactLookup from "../../hooks/useContactLookup";
import useElapsedSeconds from "../../hooks/useElapsedSeconds";

type ContactLookupProps = {
  candidateId: string;
  contact: ContactDetails | null;
};

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function ContactLookup({ candidateId, contact }: ContactLookupProps) {
  const searching = contact?.status === "searching";
  const { findContact, isStarting } = useFindContact();
  useContactLookup(candidateId, searching);
  const elapsed = useElapsedSeconds(searching ? (contact?.checkedAt ?? null) : null, searching);

  const start = async () => {
    try {
      await findContact(candidateId);
    } catch (error) {
      toast.error("Couldn't start the contact search", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const findButton = (label: string, variant: "primary" | "secondary") => (
    <Button type="button" size="sm" variant={variant} disabled={isStarting} onClick={() => void start()}>
      {isStarting ? (
        <Loader size={14} color="currentColor" />
      ) : variant === "primary" ? (
        <MagnifyingGlassIcon size={14} weight="bold" />
      ) : (
        <ArrowClockwiseIcon size={14} />
      )}
      {label}
    </Button>
  );

  if (!contact) {
    return (
      <Panel>
        <PanelText>
          <PanelTitle>Find email & phone</PanelTitle>
          <PanelBody>
            Searches the public web for an email address, phone number, website and social profiles. It takes up to a
            couple of minutes and costs a few cents per lookup.
          </PanelBody>
        </PanelText>
        {findButton("Find email & phone", "primary")}
      </Panel>
    );
  }

  if (searching) {
    return (
      <Panel data-tone="progress" aria-live="polite">
        <Loader size={18} color="currentColor" />
        <PanelText>
          <PanelTitle>Searching the public web… {elapsed > 0 && <Elapsed>{formatElapsed(elapsed)}</Elapsed>}</PanelTitle>
          <PanelBody>
            This usually takes 30 seconds to two minutes. You can close this window and the search keeps running.
          </PanelBody>
        </PanelText>
      </Panel>
    );
  }

  if (contact.status === "not_found" || contact.status === "failed") {
    const failed = contact.status === "failed";
    return (
      <Panel data-tone={failed ? "danger" : undefined}>
        <WarningCircleIcon size={18} />
        <PanelText>
          <PanelTitle>{failed ? "The contact search failed" : "No email or phone found"}</PanelTitle>
          <PanelBody>
            {failed
              ? (contact.error ?? "Something went wrong while searching.")
              : (contact.notes ?? "We couldn't find public contact details for this person.")}
          </PanelBody>
        </PanelText>
        {findButton("Try again", "secondary")}
      </Panel>
    );
  }

  return (
    <Footnote>
      {contact.notes && <Notes>{contact.notes}</Notes>}
      <FootRow>
        <span>Contact details found {formatRelativeTime(contact.checkedAt)}</span>
        <Button type="button" size="sm" variant="ghost" disabled={isStarting} onClick={() => void start()}>
          {isStarting ? <Loader size={12} color="currentColor" /> : <ArrowClockwiseIcon size={12} />}
          Search again
        </Button>
      </FootRow>
    </Footnote>
  );
}

export default ContactLookup;

const Panel = styled.div(({ theme }) => ({
  "--panel-fg": theme.textSecondary,
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "14px 16px",
  borderRadius: 8,
  border: `1px dashed ${theme.border200}`,
  backgroundColor: theme.surface50,
  color: "var(--panel-fg)",
  "& > svg, & > [role='status']": { flexShrink: 0 },
  "&[data-tone='progress']": {
    "--panel-fg": theme.toneBlueFg,
    borderStyle: "solid",
    borderColor: "transparent",
    backgroundColor: theme.toneBlueBg,
  },
  "&[data-tone='danger']": {
    "--panel-fg": theme.danger,
    borderStyle: "solid",
    borderColor: theme.dangerBorder,
    backgroundColor: theme.dangerHover,
  },
}));

const PanelText = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 3,
  flex: 1,
  minWidth: 0,
});

const PanelTitle = styled.span(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
}));

const PanelBody = styled.span(({ theme }) => ({
  fontSize: 12,
  lineHeight: 1.5,
  color: theme.textSecondary,
}));

const Elapsed = styled.span(({ theme }) => ({
  marginLeft: 4,
  fontWeight: 400,
  fontVariantNumeric: "tabular-nums",
  color: theme.textTertiary,
}));

const Footnote = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 6,
});

const Notes = styled.p(({ theme }) => ({
  fontSize: 12,
  lineHeight: 1.5,
  color: theme.textSecondary,
}));

const FootRow = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  fontSize: 12,
  color: theme.textTertiary,
}));
