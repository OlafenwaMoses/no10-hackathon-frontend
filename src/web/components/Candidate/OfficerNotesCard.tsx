import styled from "@emotion/styled";
import { NoteIcon } from "@phosphor-icons/react";
import { SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";

function OfficerNotesCard({ notes, inbound }: { notes: string; inbound?: boolean }) {
  return (
    <SectionCard>
      <SectionHead>
        <HeadLabel>
          <NoteIcon size={14} />
          {inbound ? "Their enquiry" : "Officer notes"}
        </HeadLabel>
        <Verified>{inbound ? "From the website form" : "Treated as verified"}</Verified>
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
