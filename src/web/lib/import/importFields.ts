import { IMPORT_TRACKER_FIELDS, type ImportRow, type ImportTrackerField } from "@api-types";

export const IMPORT_FIELDS = [
  "name",
  "organisation",
  "title",
  "profileUrl",
  "location",
  "nationality",
  "category",
  "sector",
  "notes",
] as const satisfies readonly (keyof ImportRow)[];

export type ImportField = (typeof IMPORT_FIELDS)[number];

export const IMPORT_FIELD_LABELS: Record<ImportField, string> = {
  name: "Name",
  organisation: "Organisation",
  title: "Role / title",
  profileUrl: "LinkedIn / profile URL",
  location: "Location / residency",
  nationality: "Nationality",
  category: "Type of individual",
  sector: "Priority sector",
  notes: "Notes / background",
};

export const IMPORT_FIELD_KEYWORDS: Record<ImportField, readonly string[]> = {
  name: ["name", "full name"],
  organisation: ["organisation", "organization", "company", "employer", "firm"],
  title: ["role", "title", "job title", "position"],
  profileUrl: ["linkedin", "url", "profile", "website"],
  location: ["residency", "residence", "location", "country", "city", "based"],
  nationality: ["nationality", "citizenship"],
  category: ["type of individual", "type", "category"],
  sector: ["priority sector", "sector", "industry"],
  notes: ["further background", "background", "notes", "comments"],
};

export const TRACKER_FIELD_LABELS: Record<ImportTrackerField, string> = {
  stage: "Stage",
  priority: "Priority",
  successRag: "Success RAG",
  relationshipRag: "Relationship RAG",
  supportLevel: "Full AM / light-touch",
  backgroundCheck: "Background check",
  relationshipHolder: "Relationship holder",
  accountManager: "Account manager",
  leadSource: "Source of lead",
  nextStep: "Next step",
  originDate: "Origin date",
  dataHubLink: "Link to Data Hub",
};

export const TRACKER_FIELD_KEYWORDS: Record<ImportTrackerField, readonly string[]> = {
  stage: ["stage"],
  priority: ["priority"],
  successRag: ["success rag", "likelihood of success"],
  relationshipRag: ["relationship rag", "strength of relationship"],
  supportLevel: ["full am", "light-touch", "light touch", "support"],
  backgroundCheck: ["background check"],
  relationshipHolder: ["relationship holder"],
  accountManager: ["account manager"],
  leadSource: ["source of lead", "source"],
  nextStep: ["next step", "next steps"],
  originDate: ["origin date"],
  dataHubLink: ["data hub"],
};

export const MAPPING_FIELDS = [...IMPORT_FIELDS, ...IMPORT_TRACKER_FIELDS] as const;

export type MappingField = (typeof MAPPING_FIELDS)[number];

export const MAPPING_FIELD_KEYWORDS: Record<MappingField, readonly string[]> = {
  ...IMPORT_FIELD_KEYWORDS,
  ...TRACKER_FIELD_KEYWORDS,
};

export const EXTRA_HEADER_KEYWORDS = ["criteria", "email", "date"] as const;

export type SheetColumn = { index: number; label: string };

export type SheetTable = {
  headerRowIndex: number;
  columns: SheetColumn[];
  rows: string[][];
};

export type ColumnMapping = Record<MappingField, number | null>;
