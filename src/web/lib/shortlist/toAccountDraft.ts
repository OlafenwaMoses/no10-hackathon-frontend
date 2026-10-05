import type { ShortlistEntry } from "@api-types";

export type AccountDraft = Omit<ShortlistEntry, "id" | "candidateId" | "createdAt" | "updatedAt">;

export default function toAccountDraft(entry: ShortlistEntry): AccountDraft {
  return {
    stage: entry.stage,
    priority: entry.priority,
    successRag: entry.successRag,
    relationshipRag: entry.relationshipRag,
    supportLevel: entry.supportLevel,
    backgroundCheck: entry.backgroundCheck,
    relationshipHolder: entry.relationshipHolder,
    accountManager: entry.accountManager,
    leadSource: entry.leadSource,
    nextStep: entry.nextStep,
    originDate: entry.originDate,
    dataHubLink: entry.dataHubLink,
    issueCategories: entry.issueCategories,
    issueDetails: entry.issueDetails,
    solutionOffered: entry.solutionOffered,
    resolved: entry.resolved,
    outcome: entry.outcome,
    successCategory: entry.successCategory,
    closedAt: entry.closedAt,
    failureReason: entry.failureReason,
  };
}
