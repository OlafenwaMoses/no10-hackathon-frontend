import styled from "@emotion/styled";
import type { ReactNode } from "react";
import {
  ISSUE_CATEGORY_LABELS,
  LEAD_SOURCE_LABELS,
  OUTREACH_STATUSES,
  RAG_VALUES,
  RESIDENCE_REGION_LABELS,
  SHORTLIST_STAGES,
  SUCCESS_CATEGORY_LABELS,
  SUPPORT_LEVEL_LABELS,
  type ShortlistItem,
} from "@api-types";
import CategoryTag from "../CategoryTag";
import SectorTag from "../SectorTag";
import ScoreMeter from "../ScoreMeter";
import OutreachStatusPill from "../OutreachStatusPill";
import Pill from "../UI/Pill";
import TruncatedText from "../UI/TruncatedText";
import { Blank } from "../UI/TableStyles";
import StageCell from "./StageCell";
import RagCell from "./RagCell";
import PriorityCell from "./PriorityCell";
import { RESOLVED_LABELS } from "../../lib/labels";
import { RESOLVED_TONES } from "../../lib/tones";
import formatShortDate from "../../lib/shortlist/formatShortDate";
import type { ShortlistTab } from "../../lib/shortlist/shortlistTabs";

export type ShortlistColumn = {
  key: string;
  label: string;
  width: number;
  sortValue?: (item: ShortlistItem) => string | number | null;
  descFirst?: boolean;
  render: (item: ShortlistItem) => ReactNode;
};

function text(value: string | null | undefined) {
  return value ? <Text text={value} /> : <Blank>—</Blank>;
}

function residence(item: ShortlistItem) {
  if (item.candidate.residenceRegion) return RESIDENCE_REGION_LABELS[item.candidate.residenceRegion];
  return item.candidate.location ?? item.candidate.country;
}

const priority: ShortlistColumn = {
  key: "priority",
  label: "Priority",
  width: 96,
  sortValue: (item) => item.priority,
  render: (item) => <PriorityCell item={item} />,
};

const stage: ShortlistColumn = {
  key: "stage",
  label: "Stage",
  width: 180,
  sortValue: (item) => SHORTLIST_STAGES.indexOf(item.stage),
  render: (item) => <StageCell item={item} />,
};

const successRag: ShortlistColumn = {
  key: "successRag",
  label: "Success RAG",
  width: 130,
  sortValue: (item) => (item.successRag ? RAG_VALUES.indexOf(item.successRag) : null),
  render: (item) => <RagCell item={item} field="successRag" />,
};

const relationshipRag: ShortlistColumn = {
  key: "relationshipRag",
  label: "Relationship RAG",
  width: 150,
  sortValue: (item) => (item.relationshipRag ? RAG_VALUES.indexOf(item.relationshipRag) : null),
  render: (item) => <RagCell item={item} field="relationshipRag" />,
};

const support: ShortlistColumn = {
  key: "support",
  label: "Support",
  width: 120,
  sortValue: (item) => (item.supportLevel ? SUPPORT_LEVEL_LABELS[item.supportLevel] : null),
  render: (item) => text(item.supportLevel ? SUPPORT_LEVEL_LABELS[item.supportLevel] : null),
};

const accountManager: ShortlistColumn = {
  key: "accountManager",
  label: "Account manager",
  width: 160,
  sortValue: (item) => item.accountManager,
  render: (item) => text(item.accountManager),
};

const relationshipHolder: ShortlistColumn = {
  key: "relationshipHolder",
  label: "Relationship holder",
  width: 170,
  sortValue: (item) => item.relationshipHolder,
  render: (item) => text(item.relationshipHolder),
};

const nextStep: ShortlistColumn = {
  key: "nextStep",
  label: "Next step",
  width: 260,
  render: (item) => text(item.nextStep),
};

const source: ShortlistColumn = {
  key: "source",
  label: "Source",
  width: 160,
  sortValue: (item) => LEAD_SOURCE_LABELS[item.leadSource],
  render: (item) => text(LEAD_SOURCE_LABELS[item.leadSource]),
};

const originDate: ShortlistColumn = {
  key: "originDate",
  label: "Origin date",
  width: 120,
  sortValue: (item) => item.originDate,
  descFirst: true,
  render: (item) => <DateText>{formatShortDate(item.originDate)}</DateText>,
};

const outreach: ShortlistColumn = {
  key: "outreach",
  label: "Outreach",
  width: 170,
  sortValue: (item) =>
    item.candidate.outreachStatus === "not_contacted" ? null : OUTREACH_STATUSES.indexOf(item.candidate.outreachStatus),
  render: (item) =>
    item.candidate.outreachStatus === "not_contacted" ? (
      <Blank>—</Blank>
    ) : (
      <OutreachStatusPill status={item.candidate.outreachStatus} />
    ),
};

const score: ShortlistColumn = {
  key: "score",
  label: "Score",
  width: 130,
  sortValue: (item) => item.candidate.overallScore,
  descFirst: true,
  render: (item) => <ScoreMeter value={item.candidate.overallScore} emphasis />,
};

const residenceColumn: ShortlistColumn = {
  key: "residence",
  label: "Residence",
  width: 150,
  sortValue: residence,
  render: (item) => text(residence(item)),
};

const type: ShortlistColumn = {
  key: "type",
  label: "Type",
  width: 140,
  sortValue: (item) => item.candidate.category,
  render: (item) => <CategoryTag category={item.candidate.category} />,
};

const sector: ShortlistColumn = {
  key: "sector",
  label: "Sector",
  width: 190,
  sortValue: (item) => item.candidate.sector,
  render: (item) => <SectorTag sector={item.candidate.sector} />,
};

const closedAt: ShortlistColumn = {
  key: "closedAt",
  label: "Closed",
  width: 120,
  sortValue: (item) => item.closedAt,
  descFirst: true,
  render: (item) => (item.closedAt ? <DateText>{formatShortDate(item.closedAt)}</DateText> : <Blank>—</Blank>),
};

const issues: ShortlistColumn = {
  key: "issues",
  label: "Issues raised",
  width: 250,
  render: (item) =>
    item.issueCategories.length > 0 ? (
      <Tags>
        {item.issueCategories.map((category) => (
          <Pill key={category} variant="outline">
            {ISSUE_CATEGORY_LABELS[category]}
          </Pill>
        ))}
      </Tags>
    ) : (
      <Blank>—</Blank>
    ),
};

const resolved: ShortlistColumn = {
  key: "resolved",
  label: "Resolved",
  width: 120,
  sortValue: (item) => item.resolved,
  render: (item) =>
    item.resolved ? (
      <Pill tone={RESOLVED_TONES[item.resolved]} dot>
        {RESOLVED_LABELS[item.resolved]}
      </Pill>
    ) : (
      <Blank>—</Blank>
    ),
};

const successCategory: ShortlistColumn = {
  key: "successCategory",
  label: "Success category",
  width: 230,
  sortValue: (item) => (item.successCategory ? SUCCESS_CATEGORY_LABELS[item.successCategory] : null),
  render: (item) =>
    item.successCategory ? (
      <Pill tone="green">{SUCCESS_CATEGORY_LABELS[item.successCategory]}</Pill>
    ) : (
      <Blank>Not converted</Blank>
    ),
};

const outcome: ShortlistColumn = {
  key: "outcome",
  label: "Outcome",
  width: 300,
  render: (item) => text(item.outcome),
};

const failureReason: ShortlistColumn = {
  key: "failureReason",
  label: "Reason for failure",
  width: 360,
  render: (item) => text(item.failureReason),
};

export const SHORTLIST_COLUMNS: Record<ShortlistTab, ShortlistColumn[]> = {
  active: [
    priority,
    stage,
    successRag,
    relationshipRag,
    support,
    accountManager,
    relationshipHolder,
    nextStep,
    source,
    originDate,
    outreach,
    score,
    residenceColumn,
    type,
    sector,
  ],
  closed: [stage, closedAt, accountManager, support, issues, resolved, successCategory, outcome, source, score],
  failed: [stage, failureReason, accountManager, source, originDate, score, type, sector],
};

const Text = styled(TruncatedText)(({ theme }) => ({
  display: "block",
  maxWidth: "100%",
  color: theme.textSecondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const DateText = styled.span(({ theme }) => ({
  color: theme.textSecondary,
  fontVariantNumeric: "tabular-nums",
}));

const Tags = styled.div({
  display: "flex",
  gap: 4,
  minWidth: 0,
  overflow: "hidden",
});
