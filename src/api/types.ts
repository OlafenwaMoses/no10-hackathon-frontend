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

export const CANDIDATE_SOURCES = ["search", "manual"] as const;
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
  score: CandidateScore | null;
  error: string | null;
  answers: InterviewAnswer[];
};

export type SearchListItem = {
  id: string;
  name: string;
  category: TalentCategory;
  sector: SearchSector;
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
  category: TalentCategory;
  sector: SearchSector;
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
  searches: number;
  averageOpenness: number | null;
  byCategory: Record<TalentCategory, number>;
  bySector: Record<Sector, number>;
  byRegion: Record<ResidenceRegion, number>;
};
