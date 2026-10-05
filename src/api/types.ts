export const TALENT_CATEGORIES = [
  "founder",
  "investor",
  "highly_talented",
  "hnwi",
  "c_suite",
  "researcher",
] as const;
export type TalentCategory = (typeof TALENT_CATEGORIES)[number];

export const TALENT_CATEGORY_LABELS: Record<TalentCategory, string> = {
  founder: "Founder",
  investor: "Investor",
  highly_talented: "Highly Talented",
  hnwi: "HNWI",
  c_suite: "C-Suite",
  researcher: "Researcher",
};

export const SECTORS = ["digital_tech", "ai", "life_sciences", "clean_energy", "pan_economy", "other"] as const;
export type Sector = (typeof SECTORS)[number];

export const SECTOR_LABELS: Record<Sector, string> = {
  digital_tech: "Digital & Tech",
  ai: "AI",
  life_sciences: "Life Sciences",
  clean_energy: "Clean Energy",
  pan_economy: "Pan-Economy Investors",
  other: "Other",
};

export const SEARCH_SECTORS = ["digital_tech", "ai", "life_sciences", "clean_energy", "pan_economy"] as const;
export type SearchSector = (typeof SEARCH_SECTORS)[number];

export const ALL = "all";
export type SearchCategoryChoice = TalentCategory | typeof ALL;
export type SearchSectorChoice = SearchSector | typeof ALL;
export const ALL_CATEGORIES_LABEL = "All types";
export const ALL_SECTORS_LABEL = "All priority sectors";

export const GTT_CRITERIA = [
  "digital_tech_talent",
  "life_sciences_talent",
  "clean_energy_talent",
  "uhnwi",
  "investor",
  "na",
] as const;
export type GttCriteria = (typeof GTT_CRITERIA)[number];

export const GTT_CRITERIA_LABELS: Record<GttCriteria, string> = {
  digital_tech_talent: "Digital Technologies Talent",
  life_sciences_talent: "Life Sciences Talent",
  clean_energy_talent: "Clean Energies Talent",
  uhnwi: "UHNWI",
  investor: "Investor",
  na: "N/A",
};

export const RESIDENCE_REGIONS = [
  "usa",
  "india",
  "uk",
  "singapore",
  "brazil",
  "americas_other",
  "europe",
  "asia_other",
  "other",
] as const;
export type ResidenceRegion = (typeof RESIDENCE_REGIONS)[number];

export const RESIDENCE_REGION_LABELS: Record<ResidenceRegion, string> = {
  usa: "USA",
  india: "India",
  uk: "UK",
  singapore: "Singapore",
  brazil: "Brazil",
  americas_other: "Americas (Other)",
  europe: "Europe",
  asia_other: "Asia (Other)",
  other: "Other",
};

export const SEARCH_REGIONS = [
  "usa",
  "india",
  "singapore",
  "brazil",
  "americas_other",
  "europe",
  "asia_other",
  "other",
] as const;
export type SearchRegion = (typeof SEARCH_REGIONS)[number];

export type Classification = {
  category: TalentCategory;
  sector: Sector;
  subSector: string;
  criteria: GttCriteria;
  residenceRegion: ResidenceRegion;
  nationality: string | null;
  rationale: string;
};

export const SEARCH_KINDS = ["search", "import"] as const;
export type SearchKind = (typeof SEARCH_KINDS)[number];

export const MAX_IMPORT_ROWS = 100;

export type ImportRow = {
  name: string;
  organisation?: string;
  title?: string;
  profileUrl?: string;
  location?: string;
  nationality?: string;
  category?: string;
  sector?: string;
  notes?: string;
  tracker?: ImportTrackerFields;
};

export const IMPORT_TRACKER_FIELDS = [
  "stage",
  "priority",
  "successRag",
  "relationshipRag",
  "supportLevel",
  "backgroundCheck",
  "relationshipHolder",
  "accountManager",
  "leadSource",
  "nextStep",
  "originDate",
  "dataHubLink",
] as const;
export type ImportTrackerField = (typeof IMPORT_TRACKER_FIELDS)[number];
export type ImportTrackerFields = Partial<Record<ImportTrackerField, string>>;

export type ImportBody = { fileName: string; rows: ImportRow[] };

export type ImportResponse = {
  searchId: string | null;
  created: number;
  skipped: { name: string; reason: string }[];
};

export const SEARCH_STATUSES = ["queued", "discovering", "processing", "complete", "failed"] as const;
export type SearchStatus = (typeof SEARCH_STATUSES)[number];

export const CANDIDATE_STATUSES = [
  "discovered",
  "resolving",
  "enriching",
  "building_persona",
  "interviewing",
  "scoring",
  "scored",
  "failed",
] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

export const OUTREACH_STATUSES = ["not_contacted", "contacted", "in_conversation", "converted", "declined"] as const;
export type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

export const OUTREACH_STATUS_LABELS: Record<OutreachStatus, string> = {
  not_contacted: "Not contacted",
  contacted: "Contacted",
  in_conversation: "In conversation",
  converted: "Converted",
  declined: "Declined",
};

export type ContactDetails = {
  status: "searching" | "found" | "not_found" | "failed";
  runId: string | null;
  emails: string[];
  phones: string[];
  linkedinUrl: string | null;
  website: string | null;
  twitter: string | null;
  notes: string | null;
  error: string | null;
  checkedAt: string;
};

export type UpdateOutreachBody = { status: OutreachStatus; note?: string };

export const NET_WORTH_BANDS = ["under_1m", "1m_10m", "10m_30m", "30m_100m", "100m_1bn", "over_1bn", "unknown"] as const;
export type NetWorthBand = (typeof NET_WORTH_BANDS)[number];

export const NET_WORTH_BAND_LABELS: Record<NetWorthBand, string> = {
  under_1m: "Under $1m",
  "1m_10m": "$1m–10m",
  "10m_30m": "$10m–30m",
  "30m_100m": "$30m–100m",
  "100m_1bn": "$100m–1bn",
  over_1bn: "$1bn+",
  unknown: "Unknown",
};

export type NetWorth = {
  band: NetWorthBand;
  estimateUsd: number | null;
  confidence: "high" | "medium" | "low";
  basis: string;
};

export const SHORTLIST_STAGES = ["pending", "cleared", "account_managed", "closed", "failed"] as const;
export type ShortlistStage = (typeof SHORTLIST_STAGES)[number];

export const SHORTLIST_STAGE_LABELS: Record<ShortlistStage, string> = {
  pending: "Pending clearance",
  cleared: "Cleared (to be pitched)",
  account_managed: "Account managed",
  closed: "Closed",
  failed: "Failed",
};

export const RAG_VALUES = ["green", "amber", "red"] as const;
export type Rag = (typeof RAG_VALUES)[number];

export const SUPPORT_LEVELS = ["full", "light"] as const;
export type SupportLevel = (typeof SUPPORT_LEVELS)[number];

export const SUPPORT_LEVEL_LABELS: Record<SupportLevel, string> = {
  full: "Full AM",
  light: "Light-touch",
};

export const BACKGROUND_CHECKS = ["not_started", "pending", "clear", "flagged"] as const;
export type BackgroundCheck = (typeof BACKGROUND_CHECKS)[number];

export const BACKGROUND_CHECK_LABELS: Record<BackgroundCheck, string> = {
  not_started: "Not started",
  pending: "Pending",
  clear: "Clear",
  flagged: "Flagged",
};

export const LEAD_SOURCES = [
  "global_talent_radar",
  "website",
  "number_10",
  "ogd",
  "dbt_ofi",
  "external",
  "post_usa",
  "post_brazil",
  "post_india",
  "post_singapore",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  global_talent_radar: "Global Talent Radar",
  website: "Website enquiry",
  number_10: "Number 10",
  ogd: "OGD",
  dbt_ofi: "DBT/OfI",
  external: "External",
  post_usa: "Post-USA",
  post_brazil: "Post-Brazil",
  post_india: "Post-India",
  post_singapore: "Post-Singapore",
};

export const ISSUE_CATEGORIES = [
  "visas",
  "tax",
  "capital_markets",
  "banking",
  "research_incentives",
  "regulation",
  "business_support",
] as const;
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export const ISSUE_CATEGORY_LABELS: Record<IssueCategory, string> = {
  visas: "Visas",
  tax: "Tax",
  capital_markets: "Capital Markets",
  banking: "Banking",
  research_incentives: "Research Incentives",
  regulation: "Regulation",
  business_support: "Business support",
};

export const RESOLVED_VALUES = ["yes", "partially", "no"] as const;
export type Resolved = (typeof RESOLVED_VALUES)[number];

export const SUCCESS_CATEGORIES = [
  "full_relocation",
  "increased_investment",
  "increased_business_activity",
  "increased_uk_presence",
  "project_research_relocation",
  "remain_in_uk",
] as const;
export type SuccessCategory = (typeof SUCCESS_CATEGORIES)[number];

export const SUCCESS_CATEGORY_LABELS: Record<SuccessCategory, string> = {
  full_relocation: "Full Relocation",
  increased_investment: "Increased Investment",
  increased_business_activity: "Increased Business Activity",
  increased_uk_presence: "Increased UK Presence",
  project_research_relocation: "Project/Research-based Relocation",
  remain_in_uk: "Remain in UK",
};

export type ShortlistEntry = {
  id: string;
  candidateId: string;
  stage: ShortlistStage;
  priority: number | null;
  successRag: Rag | null;
  relationshipRag: Rag | null;
  supportLevel: SupportLevel | null;
  backgroundCheck: BackgroundCheck;
  relationshipHolder: string | null;
  accountManager: string | null;
  leadSource: LeadSource;
  nextStep: string | null;
  originDate: string;
  dataHubLink: string | null;
  issueCategories: IssueCategory[];
  issueDetails: string | null;
  solutionOffered: string | null;
  resolved: Resolved | null;
  outcome: string | null;
  successCategory: SuccessCategory | null;
  closedAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateShortlistBody = Partial<
  Omit<ShortlistEntry, "id" | "candidateId" | "createdAt" | "updatedAt">
>;

export type ShortlistItem = ShortlistEntry & { candidate: CandidateListItem };

export type ShortlistSummary = {
  total: number;
  active: number;
  converted: number;
  byStage: Record<ShortlistStage, number>;
  successRag: Record<Rag, number>;
  relationshipRag: Record<Rag, number>;
  bySource: Record<LeadSource, number>;
  accountManagers: string[];
  relationshipHolders: string[];
};

export const CANDIDATE_SOURCES = ["search", "manual", "inbound"] as const;
export type CandidateSource = (typeof CANDIDATE_SOURCES)[number];

export type LinkedInProfile = {
  memberId: string | null;
  publicId: string | null;
  profileUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  summary: string | null;
  photoUrl: string | null;
  followersCount: number | null;
  location: string | null;
  countryCode: string | null;
  positions: {
    title: string | null;
    company: string | null;
    description: string | null;
    start: string | null;
    end: string | null;
  }[];
  education: {
    school: string | null;
    degree: string | null;
    fieldOfStudy: string | null;
    start: string | null;
    end: string | null;
  }[];
  languages: string[];
  skills: string[];
};

export const RESOLUTION_METHODS = ["reverse_contact_url", "reverse_contact_name", "exa", "manual_only"] as const;
export type ResolutionMethod = (typeof RESOLUTION_METHODS)[number];

export type Resolution = {
  method: ResolutionMethod;
  confidence: "strong" | "weak" | "none";
  matchedUrl: string | null;
  steps: string[];
};

export const INBOUND_INTENTS = ["relocate", "expand_business", "invest", "research", "exploring"] as const;
export type InboundIntent = (typeof INBOUND_INTENTS)[number];

export const INBOUND_INTENT_LABELS: Record<InboundIntent, string> = {
  relocate: "Relocate to the UK myself",
  expand_business: "Set up or expand a business in the UK",
  invest: "Invest in the UK",
  research: "Move my research to the UK",
  exploring: "Just exploring",
};

export type InboundEnquiryBody = {
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  role?: string;
  profileUrl?: string;
  country?: string;
  category?: string;
  sector?: string;
  intent?: InboundIntent;
  timeline?: string;
  message?: string;
};

export type ManualCandidateBody = {
  name: string;
  organisation?: string;
  title?: string;
  profileUrl?: string;
  region?: ResidenceRegion;
  customRegion?: string;
  location?: string;
  notes?: string;
  category?: TalentCategory;
  sector?: Sector;
};

export const GTT_LEVERS = [
  "global_talent_visa",
  "innovator_founder_visa",
  "high_potential_individual_visa",
  "expedited_visa_support",
  "tax_and_investment_reliefs",
  "research_funding",
  "access_to_capital",
  "talent_and_hiring",
  "regulatory_navigation",
  "soft_landing",
  "family_and_schooling",
] as const;
export type GttLever = (typeof GTT_LEVERS)[number];

export const GTT_LEVER_LABELS: Record<GttLever, string> = {
  global_talent_visa: "Global Talent visa",
  innovator_founder_visa: "Innovator Founder visa",
  high_potential_individual_visa: "High Potential Individual visa",
  expedited_visa_support: "Expedited visa support",
  tax_and_investment_reliefs: "Tax & investment reliefs (EIS/SEIS, R&D credits)",
  research_funding: "Research funding (UKRI, ARIA)",
  access_to_capital: "Access to UK capital",
  talent_and_hiring: "Talent & hiring",
  regulatory_navigation: "Regulatory navigation",
  soft_landing: "Soft landing (housing, banking, concierge)",
  family_and_schooling: "Family & schooling",
};

export const UK_LINK_TYPES = [
  "studied_in_uk",
  "worked_in_uk",
  "uk_company_director",
  "uk_investments",
  "uk_citizen_or_resident",
  "company_has_uk_office",
  "uk_government_engagement",
  "uk_events_or_media",
] as const;
export type UkLinkType = (typeof UK_LINK_TYPES)[number];

export const UK_LINK_TYPE_LABELS: Record<UkLinkType, string> = {
  studied_in_uk: "Studied in the UK",
  worked_in_uk: "Worked in the UK",
  uk_company_director: "UK company director",
  uk_investments: "UK investments",
  uk_citizen_or_resident: "UK citizen or resident",
  company_has_uk_office: "Company has a UK office",
  uk_government_engagement: "UK Government engagement",
  uk_events_or_media: "UK events or media",
};

export type UkLinkVerdict = "strong" | "some" | "none_found" | "cannot_verify";

export type Citation = { url: string; title: string | null };

export type UkLinks = {
  verdict: UkLinkVerdict;
  links: { type: UkLinkType; detail: string }[];
  currentCountry: string | null;
  ukGovernmentLinks: string | null;
  wealthEvidence?: string | null;
  evidence: string;
  citations: Citation[];
};

export type ExaPersonEntity = {
  id?: string;
  type: "person";
  properties: {
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    location?: string | null;
    workHistory?: {
      title?: string | null;
      location?: string | null;
      dates?: { from?: string | null; to?: string | null } | null;
      company?: { id?: string | null; name?: string | null } | null;
    }[];
    educationHistory?: {
      degree?: string | null;
      dates?: { from?: string | null; to?: string | null } | null;
      institution?: { id?: string | null; name?: string | null } | null;
    }[];
    research?: {
      worksCount?: number | null;
      citationCount?: number | null;
      hIndex?: number | null;
      areas?: string[] | null;
      notableWorks?: unknown[] | null;
    } | null;
  };
};

export type PersonaAttributes = {
  name: string;
  gender: string;
  income: string;
  currentCountry: string;
  currentCity: string;
  generation: string;
  culturalBackground: string;
  languages: string[];
  title: string;
  organisation: string;
  sector: string;
  biography: string;
  personality: string;
  demeanour: string;
  attitudes: string;
  motivation: string;
  behaviours: string;
  interests: string;
};

export type LeverWeight = { lever: GttLever; weight: number };

export type CandidateScore = {
  overall: number;
  openness: number;
  ukLinks: number;
  prominence: number;
  levers: LeverWeight[];
  rationale: string;
};

export const INTERVIEW_QUESTION_TYPES = ["scale", "choice", "open"] as const;
export type InterviewQuestionType = (typeof INTERVIEW_QUESTION_TYPES)[number];

export type InterviewAnswer = {
  id: string;
  questionKey: string;
  question: string;
  type: InterviewQuestionType;
  options: string[];
  probs: number[];
  reasoning: string | null;
  response: string | null;
  expected: number | null;
};

export type CandidateListItem = {
  id: string;
  name: string;
  headline: string | null;
  title: string | null;
  organisation: string | null;
  location: string | null;
  country: string | null;
  pictureUrl: string | null;
  profileUrl: string | null;
  source: CandidateSource;
  category: TalentCategory;
  sector: Sector;
  subSector: string | null;
  criteria: GttCriteria | null;
  residenceRegion: ResidenceRegion | null;
  nationality: string | null;
  status: CandidateStatus;
  outreachStatus: OutreachStatus;
  shortlistStage: ShortlistStage | null;
  netWorthBand: NetWorthBand | null;
  netWorthUsd: number | null;
  netWorthConfidence: NetWorth["confidence"] | null;
  overallScore: number | null;
  opennessScore: number | null;
  ukLinkScore: number | null;
  ukLinkVerdict: UkLinkVerdict | null;
  topLevers: GttLever[];
  createdAt: string;
};

export type CandidateDetail = CandidateListItem & {
  searchId: string | null;
  searchName: string | null;
  entity: ExaPersonEntity | null;
  highlights: string[];
  notes: string | null;
  linkedinProfile: LinkedInProfile | null;
  resolution: Resolution | null;
  profileText: string | null;
  ukLinks: UkLinks | null;
  persona: PersonaAttributes | null;
  classification: Classification | null;
  netWorth: NetWorth | null;
  contact: ContactDetails | null;
  outreachNote: string | null;
  contactedAt: string | null;
  shortlist: ShortlistEntry | null;
  score: CandidateScore | null;
  error: string | null;
  answers: InterviewAnswer[];
};

export type SearchListItem = {
  id: string;
  name: string;
  kind: SearchKind;
  category: SearchCategoryChoice;
  sector: SearchSectorChoice;
  region: string | null;
  query: string;
  numResults: number;
  status: SearchStatus;
  error: string | null;
  candidateCount: number;
  scoredCount: number;
  createdAt: string;
};

export type SearchDetail = SearchListItem & { candidates: CandidateListItem[] };

export type CreateSearchBody = {
  category: SearchCategoryChoice;
  sector: SearchSectorChoice;
  region?: SearchRegion;
  customRegion?: string;
  query?: string;
  numResults?: number;
};

export type ChatMessage = { role: "user" | "model"; content: string };

export type ChatBody = { messages: ChatMessage[] };

export type ChatResponse = { reply: string };

export type Stats = {
  candidates: number;
  scored: number;
  actioned: number;
  searches: number;
  averageOpenness: number | null;
  byCategory: Record<TalentCategory, number>;
  bySector: Record<Sector, number>;
  byRegion: Record<ResidenceRegion, number>;
};
