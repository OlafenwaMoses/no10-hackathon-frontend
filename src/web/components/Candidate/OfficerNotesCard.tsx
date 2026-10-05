import styled from "@emotion/styled";
import { NoteIcon } from "@phosphor-icons/react";
import { SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";

function OfficerNotesCard({ notes }: { notes: string }) {
  return (
    <SectionCard>
      <SectionHead>
        <HeadLabel>
          <NoteIcon size={14} />
          Officer notes
        </HeadLabel>
        <Verified>Treated as verified</Verified>
      </SectionHead>
      <SectionBody>
        <Notes>{notes}</Notes>
      </SectionBody>
    </SectionCard>
  );
}

export default OfficerNotesCard;

const HeadLabel = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  "& svg": { color: theme.textTertiary },
}));

const Verified = styled.span(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
  color: theme.textTertiary,
}));

const Notes = styled.p(({ theme }) => ({
  fontSize: 13,
  lineHeight: 1.55,
  color: theme.textSecondary,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
}));
