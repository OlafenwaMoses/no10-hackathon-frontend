import styled from "@emotion/styled";
import { createLink } from "@tanstack/react-router";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { LEAD_SOURCE_LABELS, SUPPORT_LEVEL_LABELS, type CandidateDetail, type ShortlistEntry } from "@api-types";
import Button from "../UI/Button";
import ShortlistStagePill from "../Shortlist/ShortlistStagePill";
import RagIndicator from "../Shortlist/RagIndicator";
import openAccountRecord from "../Shortlist/openAccountRecord";
import { SectionBody, SectionCard, SectionHead } from "../UI/PageStyles";
import tabForStage from "../../lib/shortlist/tabForStage";

type AccountCardProps = {
  candidate: CandidateDetail;
  entry: ShortlistEntry;
};

function AccountCard({ candidate, entry }: AccountCardProps) {
  const rows = [
    { label: "Stage", value: <ShortlistStagePill stage={entry.stage} /> },
    { label: "Account manager", value: entry.accountManager },
    { label: "Relationship holder", value: entry.relationshipHolder },
    { label: "Likelihood of success", value: <RagIndicator rag={entry.successRag} placeholder="Not set" /> },
    { label: "Strength of relationship", value: <RagIndicator rag={entry.relationshipRag} placeholder="Not set" /> },
    { label: "Priority", value: entry.priority === null ? null : String(entry.priority) },
    { label: "Support", value: entry.supportLevel ? SUPPORT_LEVEL_LABELS[entry.supportLevel] : null },
    { label: "Source", value: LEAD_SOURCE_LABELS[entry.leadSource] },
  ];

  return (
    <SectionCard>
      <SectionHead>
        Account
        <Button size="sm" variant="ghost" onClick={() => openAccountRecord(entry, candidate)}>
          <PencilSimpleIcon size={14} />
          Edit
        </Button>
      </SectionHead>
      <SectionBody>
        <Rows>
          {rows.map((row) => (
            <Row key={row.label}>
              <Term>{row.label}</Term>
              <Value>{row.value ?? <Blank>Not set</Blank>}</Value>
            </Row>
          ))}
        </Rows>
        <NextStep>
          <Term>Next step</Term>
          <NextStepText data-empty={!entry.nextStep || undefined}>{entry.nextStep ?? "No next step recorded"}</NextStepText>
        </NextStep>
        <ShortlistLink to="/shortlist" search={{ tab: tabForStage(entry.stage), q: candidate.name }}>
          View on shortlist
        </ShortlistLink>
      </SectionBody>
    </SectionCard>
  );
}

export default AccountCard;

const Rows = styled.dl({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  margin: 0,
});

const Row = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minHeight: 22,
});

const Term = styled.dt(({ theme }) => ({
  flexShrink: 0,
  fontSize: 12,
  color: theme.textTertiary,
}));

const Value = styled.dd(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  minWidth: 0,
  margin: 0,
  fontSize: 13,
  textAlign: "right",
  color: theme.textPrimary,
}));

const Blank = styled.span(({ theme }) => ({
  color: theme.textDisabled,
}));

const NextStep = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const NextStepText = styled.p(({ theme }) => ({
  fontSize: 13,
  lineHeight: 1.5,
  color: theme.textSecondary,
  whiteSpace: "pre-wrap",
  "&[data-empty]": { color: theme.textDisabled },
}));

const LinkAnchor = styled.a(({ theme }) => ({
  alignSelf: "flex-start",
  fontSize: 12,
  fontWeight: 500,
  color: theme.textSecondary,
  textDecoration: "underline",
  textUnderlineOffset: 3,
  textDecorationColor: theme.border200,
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { color: theme.textPrimary },
  },
}));

const ShortlistLink = createLink(LinkAnchor);
