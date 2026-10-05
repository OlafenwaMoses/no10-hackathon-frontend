import { sql } from "drizzle-orm";
import { pgTable, text, integer, uuid, date, foreignKey } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./helpers";
import { candidates } from "./candidates";
import type {
  BackgroundCheck,
  IssueCategory,
  LeadSource,
  Rag,
  Resolved,
  ShortlistStage,
  SuccessCategory,
  SupportLevel,
} from "../../types";

export const shortlistEntries = pgTable(
  "shortlist_entries",
  {
    id,
    candidateId: uuid().notNull().unique(),
    stage: text().$type<ShortlistStage>().notNull().default("pending"),
    priority: integer(),
    successRag: text().$type<Rag>(),
    relationshipRag: text().$type<Rag>(),
    supportLevel: text().$type<SupportLevel>(),
    backgroundCheck: text().$type<BackgroundCheck>().notNull().default("not_started"),
    relationshipHolder: text(),
    accountManager: text(),
    leadSource: text().$type<LeadSource>().notNull().default("global_talent_radar"),
    nextStep: text(),
    originDate: date({ mode: "string" }).notNull().defaultNow(),
    dataHubLink: text(),
    issueCategories: text().array().$type<IssueCategory[]>().notNull().default(sql`'{}'::text[]`),
    issueDetails: text(),
    solutionOffered: text(),
    resolved: text().$type<Resolved>(),
    outcome: text(),
    successCategory: text().$type<SuccessCategory>(),
    closedAt: date({ mode: "string" }),
    failureReason: text(),
    createdAt,
    updatedAt,
  },
  (table) => [
    foreignKey({
      columns: [table.candidateId],
      foreignColumns: [candidates.id],
      name: "shortlist_entries_candidate_id_fkey",
    }).onDelete("cascade"),
  ],
);
