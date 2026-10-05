export const CATEGORIES = [
  "Founder",
  "Investor",
  "High-net-worth individual",
  "Executive (C-suite)",
  "Researcher or academic",
  "Other exceptional talent",
] as const;

export const SECTORS = ["Digital & Tech", "AI", "Life Sciences", "Clean Energy", "Other"] as const;

export const INTENTS = [
  { value: "relocate", label: "Relocate to the UK myself" },
  { value: "expand_business", label: "Set up or expand a business in the UK" },
  { value: "invest", label: "Invest in the UK" },
  { value: "research", label: "Move my research to the UK" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const TIMELINES = ["Within 6 months", "6 to 12 months", "1 to 2 years", "Just exploring"] as const;

export type Intent = (typeof INTENTS)[number]["value"];
