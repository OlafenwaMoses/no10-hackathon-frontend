export const TRACKED_GUIDES = [
  { basePath: "/global-talent", slug: "global-talent", name: "Global Talent visa" },
  { basePath: "/innovator-founder-visa", slug: "innovator-founder", name: "Innovator Founder visa" },
  { basePath: "/high-potential-individual-visa", slug: "high-potential-individual", name: "High Potential Individual visa" },
  { basePath: "/skilled-worker-visa", slug: "skilled-worker", name: "Skilled Worker visa" },
] as const;

export type TrackedGuide = (typeof TRACKED_GUIDES)[number];

export const findTrackedGuide = (slug: string) => TRACKED_GUIDES.find((guide) => guide.slug === slug);
