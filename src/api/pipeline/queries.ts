import {
  RESIDENCE_REGION_LABELS,
  SECTOR_LABELS,
  TALENT_CATEGORY_LABELS,
  type SearchRegion,
  type SearchSector,
  type TalentCategory,
} from "../types";

const REGION_QUERY_PHRASES: Record<Exclude<SearchRegion, "other">, string> = {
  usa: "the United States",
  india: "India",
  singapore: "Singapore",
  brazil: "Brazil",
  americas_other: "Canada, Mexico or Latin America (outside the United States and Brazil)",
  europe: "continental Europe",
  asia_other: "Asia, the Middle East or Australia (outside India and Singapore)",
};

export function resolveSearchRegion(region: SearchRegion | undefined, customRegion: string | undefined) {
  const custom = customRegion?.trim();
  if (region === "other") return custom ? { label: custom, phrase: custom } : null;
  if (!region) return null;
  return { label: RESIDENCE_REGION_LABELS[region], phrase: REGION_QUERY_PHRASES[region] };
}

const SECTOR_TERMS: Record<SearchSector, { field: string; companies: string; research: string; talent: string }> = {
  digital_tech: {
    field: "software, fintech, cybersecurity, quantum and deep tech",
    companies: "software, fintech, cybersecurity, quantum computing, semiconductor and deep tech companies",
    research: "computer science, quantum computing, semiconductors, cybersecurity or robotics",
    talent: "senior engineers and technical leaders at leading software, fintech, quantum and semiconductor companies",
  },
  ai: {
    field: "artificial intelligence",
    companies: "AI companies building foundation models, AI infrastructure and applied AI products",
    research: "artificial intelligence, machine learning, deep learning, reinforcement learning or AI safety",
    talent: "research scientists and engineers at frontier AI labs such as OpenAI, Google DeepMind, Anthropic and Meta AI",
  },
  life_sciences: {
    field: "biotech, pharmaceuticals, medtech and life sciences",
    companies: "biotech, pharmaceutical, medtech, diagnostics and healthtech companies",
    research: "biomedical science, genomics, drug discovery, synthetic biology, immunology or neuroscience",
    talent: "senior scientists and R&D leaders at leading biotech and pharmaceutical companies",
  },
  clean_energy: {
    field: "climate tech and clean energy",
    companies: "climate tech and clean energy companies in renewables, batteries, hydrogen, fusion, grid and carbon removal",
    research: "renewable energy, energy storage, batteries, fusion, hydrogen, carbon capture or climate science",
    talent: "senior engineers and scientists at leading clean energy, battery, fusion and climate tech companies",
  },
  pan_economy: {
    field: "high-growth companies across sectors",
    companies: "high-growth, venture-backed companies across technology, life sciences, energy and consumer sectors",
    research: "science, engineering or economics",
    talent: "exceptional operators and technical leaders at the world's fastest-growing companies",
  },
};

function locationClause(region?: string) {
  return region ? `based in ${region}, outside the United Kingdom` : "based outside the United Kingdom";
}

export function buildSearchQuery(category: TalentCategory, sector: SearchSector, region?: string) {
  const terms = SECTOR_TERMS[sector];
  const location = locationClause(region?.trim() || undefined);

  const queries: Record<TalentCategory, string> = {
    founder: `founders and CEOs of venture-backed ${terms.companies} that have raised Series A or later funding, ${location}`,
    investor: `partners and principals at venture capital and growth equity firms that invest in ${terms.field} companies, ${location}`,
    hnwi: `angel investors, family office principals and exited founders who back ${terms.field} startups, ${location}`,
    c_suite: `CEOs, CTOs, chief scientific officers and other C-suite executives of large, established ${terms.companies}, ${location}`,
    researcher: `professors, principal investigators and lab heads with highly cited research in ${terms.research}, ${location}`,
    highly_talented: `exceptional ${terms.talent}, including major award winners and 30 Under 30 honourees in ${terms.field}, ${location}`,
  };

  return queries[category];
}

export function searchName(category: TalentCategory, sector: SearchSector, region?: string) {
  const base = `${TALENT_CATEGORY_LABELS[category]} · ${SECTOR_LABELS[sector]}`;
  return region?.trim() ? `${base} · ${region.trim()}` : base;
}
