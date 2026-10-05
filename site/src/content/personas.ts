type Link = { href: string; text: string };

type VisaOption = { name: string; href: string; fit: string };

export type Persona = {
  slug: string;
  title: string;
  category: string;
  card: string;
  intro: string;
  visas: VisaOption[];
  help: string[];
  links: Link[];
};

export const PERSONAS: Persona[] = [
  {
    slug: "founders",
    title: "Founders",
    category: "Founder",
    card: "Start or scale your company in the UK.",
    intro: "Incorporate in a day and raise from Europe's largest venture capital market.",
    visas: [
      { name: "Innovator Founder visa", href: "/visas/innovator-founder", fit: "Set up an innovative business endorsed by an approved body." },
      { name: "Global Talent visa", href: "/visas/global-talent", fit: "For leaders in digital technology. No sponsor needed." },
      { name: "Skilled Worker and Scale-up visas", href: "/visas#skilled-worker", fit: "Bring in international hires once you hold a sponsor licence." },
    ],
    help: ["Choosing the right founder route", "Introductions to investors and peers", "Understanding SEIS, EIS and R&D relief"],
    links: [
      { href: "https://www.gov.uk/set-up-limited-company", text: "Set up a private limited company" },
      { href: "https://www.gov.uk/innovator-founder-visa", text: "Innovator Founder visa" },
    ],
  },
  {
    slug: "investors",
    title: "Investors",
    category: "Investor",
    card: "Back UK companies with established tax reliefs.",
    intro: "London is a global financial centre with deep angel, venture and growth capital.",
    visas: [
      { name: "Visiting for business", href: "/visas#visiting", fit: "Meetings and due diligence as a visitor, with an ETA or visa." },
      { name: "Global Talent visa", href: "/visas/global-talent", fit: "Live here and invest freely if you lead in your field." },
      { name: "Innovator Founder visa", href: "/visas/innovator-founder", fit: "If you will take an active founding role." },
    ],
    help: ["The foreign income and gains regime for new residents", "Investor reliefs: SEIS, EIS and VCTs", "Connections to UK opportunities and partners"],
    links: [
      { href: "https://www.gov.uk/guidance/venture-capital-schemes-tax-relief-for-investors", text: "Tax relief for investors" },
      { href: "https://www.gov.uk/government/organisations/office-for-investment", text: "Office for Investment" },
    ],
  },
  {
    slug: "researchers",
    title: "Researchers",
    category: "Researcher or academic",
    card: "Lead research at world-class universities.",
    intro: "A dedicated Global Talent route for academics, with fast-track options for senior appointments.",
    visas: [
      { name: "Global Talent visa", href: "/visas/global-talent", fit: "Endorsement from a national academy or UKRI, or an eligible prize." },
      { name: "High Potential Individual visa", href: "/visas/high-potential-individual", fit: "Recent graduates of top-ranked universities abroad." },
      { name: "Skilled Worker visa", href: "/visas/skilled-worker", fit: "A role with a licensed university or institute." },
    ],
    help: ["Preparing for endorsement", "Moving your research group", "Schools and housing for your family"],
    links: [
      { href: "https://www.gov.uk/global-talent-researcher-academic", text: "Global Talent visa for researchers" },
      { href: "https://www.ukri.org/", text: "UK Research and Innovation" },
    ],
  },
  {
    slug: "executives",
    title: "Executives",
    category: "Executive (C-suite)",
    card: "Lead a UK business or regional headquarters.",
    intro: "Your route depends on whether you join a UK employer or transfer within your group.",
    visas: [
      { name: "Skilled Worker visa", href: "/visas/skilled-worker", fit: "A role with a licensed UK employer." },
      { name: "Senior or Specialist Worker visa", href: "/visas#global-business-mobility", fit: "A transfer to your organisation's UK branch." },
      { name: "Scale-up visa", href: "/visas#scale-up", fit: "A role with a fast-growing UK business." },
    ],
    help: ["Choosing between sponsored and transfer routes", "Tax residence on arrival", "Schools and housing for your family"],
    links: [
      { href: "https://www.gov.uk/skilled-worker-visa", text: "Skilled Worker visa" },
      { href: "https://www.gov.uk/senior-specialist-worker-visa", text: "Senior or Specialist Worker visa" },
    ],
  },
  {
    slug: "exceptional-talent",
    title: "Exceptional talent",
    category: "Other exceptional talent",
    card: "Award winners and leaders in their field.",
    intro: "Routes that give you freedom to work, found and build without a single employer.",
    visas: [
      { name: "Global Talent visa", href: "/visas/global-talent", fit: "Apply directly if you hold an eligible prize." },
      { name: "High Potential Individual visa", href: "/visas/high-potential-individual", fit: "Recent graduates of top-ranked universities abroad." },
    ],
    help: ["Checking the eligible prize list", "Building your endorsement evidence", "Settling in with your family"],
    links: [
      { href: "https://www.gov.uk/government/publications/global-talent-eligible-prize-list", text: "Global Talent eligible prize list" },
      { href: "https://www.gov.uk/global-talent", text: "Global Talent visa" },
    ],
  },
];

export const findPersona = (slug: string) => PERSONAS.find((persona) => persona.slug === slug);
