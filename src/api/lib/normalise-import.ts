import type { shortlistEntries } from "../db/schema";
import type {
  BackgroundCheck,
  ImportTrackerFields,
  LeadSource,
  Rag,
  Sector,
  ShortlistStage,
  SupportLevel,
  TalentCategory,
} from "../types";

const CATEGORY_PATTERNS: [RegExp, TalentCategory][] = [
  [/u?hnwi|high[\s-]*net|family office|wealth/i, "hnwi"],
  [/founder/i, "founder"],
  [/c[\s-]*suite|chief|ceo|cto|cfo|coo|executive|president|chair/i, "c_suite"],
  [/investor|venture|vc\b|partner|fund/i, "investor"],
  [/research|academic|professor|scientist|phd/i, "researcher"],
  [/talent/i, "highly_talented"],
];

const SECTOR_PATTERNS: [RegExp, Sector][] = [
  [/pan[\s-]*economy|generalist|multi[\s-]*sector/i, "pan_economy"],
  [/\bai\b|artificial intelligence|machine learning/i, "ai"],
  [/life\s*science|bio|pharma|health|med/i, "life_sciences"],
  [/clean|energy|climate|renewable|net[\s-]*zero/i, "clean_energy"],
  [/digital|tech|software|fintech|cyber|quantum|semiconductor/i, "digital_tech"],
  [/invest/i, "pan_economy"],
];

function match<T>(patterns: [RegExp, T][], raw: string | undefined) {
  const value = raw?.trim();
  if (!value) return undefined;
  return patterns.find(([pattern]) => pattern.test(value))?.[1];
}

export function normaliseCategory(raw: string | undefined) {
  return match(CATEGORY_PATTERNS, raw);
}

export function normaliseSector(raw: string | undefined) {
  return match(SECTOR_PATTERNS, raw);
}

const STAGE_PATTERNS: [RegExp, ShortlistStage][] = [
  [/account\s*manag/i, "account_managed"],
  [/clear/i, "cleared"],
  [/closed|convert/i, "closed"],
  [/fail|lost|declin/i, "failed"],
  [/pend/i, "pending"],
];

const RAG_PATTERNS: [RegExp, Rag][] = [
  [/green/i, "green"],
  [/amber|yellow/i, "amber"],
  [/red/i, "red"],
];

const SUPPORT_PATTERNS: [RegExp, SupportLevel][] = [
  [/full/i, "full"],
  [/light/i, "light"],
];

const BACKGROUND_PATTERNS: [RegExp, BackgroundCheck][] = [
  [/clear/i, "clear"],
  [/flag|risk|fail/i, "flagged"],
  [/pend|progress/i, "pending"],
];

const SOURCE_PATTERNS: [RegExp, LeadSource][] = [
  [/post.*usa|usa.*post/i, "post_usa"],
  [/post.*brazil/i, "post_brazil"],
  [/post.*india/i, "post_india"],
  [/post.*singapore/i, "post_singapore"],
  [/number\s*10|no\.?\s*10/i, "number_10"],
  [/\bogd\b|other gov/i, "ogd"],
  [/dbt|ofi|office for investment/i, "dbt_ofi"],
  [/radar/i, "global_talent_radar"],
  [/extern/i, "external"],
];

function text(value: string | undefined) {
  return value?.trim() || null;
}

export function normaliseTracker(fields: ImportTrackerFields | undefined) {
  if (!fields || Object.values(fields).every((value) => !value?.trim())) return null;
  const priority = Number.parseInt(fields.priority ?? "", 10);
  const originDate = fields.originDate?.trim().slice(0, 10);
  return {
    stage: match(STAGE_PATTERNS, fields.stage) ?? "pending",
    priority: Number.isFinite(priority) ? priority : null,
    successRag: match(RAG_PATTERNS, fields.successRag) ?? null,
    relationshipRag: match(RAG_PATTERNS, fields.relationshipRag) ?? null,
    supportLevel: match(SUPPORT_PATTERNS, fields.supportLevel) ?? null,
    backgroundCheck: match(BACKGROUND_PATTERNS, fields.backgroundCheck) ?? "not_started",
    relationshipHolder: text(fields.relationshipHolder),
    accountManager: text(fields.accountManager),
    leadSource: match(SOURCE_PATTERNS, fields.leadSource) ?? (fields.leadSource?.trim() ? "external" : "global_talent_radar"),
    nextStep: text(fields.nextStep),
    ...(originDate && /^\d{4}-\d{2}-\d{2}$/.test(originDate) ? { originDate } : {}),
    dataHubLink: text(fields.dataHubLink),
  } satisfies Partial<typeof shortlistEntries.$inferInsert>;
}
