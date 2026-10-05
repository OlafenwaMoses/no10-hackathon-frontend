import {
  BACKGROUND_CHECK_LABELS,
  GTT_CRITERIA_LABELS,
  ISSUE_CATEGORY_LABELS,
  LEAD_SOURCE_LABELS,
  RESIDENCE_REGION_LABELS,
  SECTOR_LABELS,
  SUCCESS_CATEGORY_LABELS,
  TALENT_CATEGORY_LABELS,
  type Resolved,
  type ShortlistItem,
  type ShortlistStage,
  type SupportLevel,
} from "@api-types";
import { RAG_LABELS } from "../labels";
import type { WorkbookCell, WorkbookSheet } from "../import/writeWorkbook";

const TRACKER_STAGE_LABELS: Record<ShortlistStage, string> = {
  pending: "Pending",
  cleared: "Cleared",
  account_managed: "Account Managed",
  closed: "Closed",
  failed: "Failed",
};

const TRACKER_SUPPORT_LABELS: Record<SupportLevel, string> = {
  full: "Full",
  light: "Light",
};

const TRACKER_RESOLVED_LABELS: Record<Resolved, string> = {
  yes: "Yes",
  partially: "Partially",
  no: "No",
};

function nameCell(item: ShortlistItem): WorkbookCell {
  return item.candidate.profileUrl ? { text: item.candidate.name, link: item.candidate.profileUrl } : item.candidate.name;
}

function linkCell(url: string | null): WorkbookCell {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? { text: url, link: url } : url;
}

function residency(item: ShortlistItem) {
  if (item.candidate.residenceRegion) return RESIDENCE_REGION_LABELS[item.candidate.residenceRegion];
  return item.candidate.location ?? item.candidate.country;
}

function leadRow(item: ShortlistItem): WorkbookCell[] {
  const { candidate } = item;
  return [
    nameCell(item),
    candidate.organisation,
    candidate.title,
    item.nextStep,
    item.priority,
    TRACKER_STAGE_LABELS[item.stage],
    item.successRag ? RAG_LABELS[item.successRag] : null,
    item.supportLevel ? TRACKER_SUPPORT_LABELS[item.supportLevel] : null,
    item.relationshipRag ? RAG_LABELS[item.relationshipRag] : null,
    BACKGROUND_CHECK_LABELS[item.backgroundCheck],
    item.relationshipHolder,
    item.accountManager,
    LEAD_SOURCE_LABELS[item.leadSource],
    { date: item.originDate },
    linkCell(item.dataHubLink),
    residency(item),
    candidate.headline,
    candidate.nationality,
    candidate.criteria ? GTT_CRITERIA_LABELS[candidate.criteria] : null,
    SECTOR_LABELS[candidate.sector],
    TALENT_CATEGORY_LABELS[candidate.category],
  ];
}

function closedRow(item: ShortlistItem): WorkbookCell[] {
  return [
    nameCell(item),
    item.candidate.organisation,
    item.candidate.title,
    item.closedAt ? { date: item.closedAt } : null,
    item.accountManager,
    item.issueCategories.map((category) => ISSUE_CATEGORY_LABELS[category]).join(", ") || null,
    item.supportLevel ? TRACKER_SUPPORT_LABELS[item.supportLevel] : null,
    item.issueDetails,
    item.solutionOffered,
    item.resolved ? TRACKER_RESOLVED_LABELS[item.resolved] : null,
    item.outcome,
    item.successCategory ? "Y" : "N",
    item.successCategory ? SUCCESS_CATEGORY_LABELS[item.successCategory] : null,
    null,
  ];
}

function failedRow(item: ShortlistItem): WorkbookCell[] {
  return [nameCell(item), item.candidate.organisation, item.failureReason];
}

export default function buildTrackerSheets(items: ShortlistItem[]): WorkbookSheet[] {
  return [
    {
      name: "GTT Leads",
      columns: [
        { header: "Name", width: 24 },
        { header: "Organisation", width: 24 },
        { header: "Role", width: 22 },
        { header: "Next Step", width: 36 },
        { header: "Priority", width: 9 },
        { header: "Stage", width: 17 },
        { header: "Success RAG", width: 12 },
        { header: "Full AM/ Light-touch", width: 18 },
        { header: "Relationship RAG", width: 16 },
        { header: "Background Check", width: 17 },
        { header: "Relationship Holder", width: 20 },
        { header: "GTT Account Manager", width: 20 },
        { header: "Source of lead", width: 18 },
        { header: "Origin Date", width: 12 },
        { header: "Link to Data Hub (Where Applicable)", width: 30 },
        { header: "Current Residency", width: 18 },
        { header: "Further Background", width: 48 },
        { header: "Nationality", width: 14 },
        { header: "Criteria", width: 26 },
        { header: "GTT Priority Sector", width: 22 },
        { header: "Type of Individual", width: 18 },
      ],
      rows: items.filter((item) => item.stage !== "failed").map(leadRow),
    },
    {
      name: "Closed Accounts Summary",
      columns: [
        { header: "Name", width: 24 },
        { header: "Organisation", width: 24 },
        { header: "Role", width: 22 },
        { header: "Date Closed", width: 12 },
        { header: "Account Manager", width: 18 },
        { header: "Category of Issue Raised", width: 28 },
        { header: "Light Touch/ Full Support", width: 14 },
        { header: "Details", width: 48 },
        { header: "Solution offered", width: 48 },
        { header: "Was issue resolved?", width: 14 },
        { header: "Overall Outcome", width: 40 },
        { header: "Meets success criteria?", width: 14 },
        { header: "Success Category", width: 28 },
        { header: "Key Escalations", width: 32 },
      ],
      rows: items.filter((item) => item.stage === "closed").map(closedRow),
    },
    {
      name: "Failed Leads",
      columns: [
        { header: "Name", width: 24 },
        { header: "Company", width: 24 },
        { header: "Reason for Failure", width: 48 },
      ],
      rows: items.filter((item) => item.stage === "failed").map(failedRow),
    },
  ];
}
