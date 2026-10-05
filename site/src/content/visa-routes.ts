export type VisaRoute = {
  id: string;
  name: string;
  href: string;
  internalHref?: string;
  suits: string;
  jobOffer: string;
  endorsement: string;
};

export const VISA_ROUTES: VisaRoute[] = [
  {
    id: "global-talent",
    name: "Global Talent",
    href: "https://www.gov.uk/global-talent",
    internalHref: "/visas/global-talent",
    suits: "Leaders in research, the arts or digital technology",
    jobOffer: "Not needed",
    endorsement: "Required, or a prize",
  },
  {
    id: "innovator-founder",
    name: "Innovator Founder",
    href: "https://www.gov.uk/innovator-founder-visa",
    internalHref: "/visas/innovator-founder",
    suits: "Founders of innovative, scalable businesses",
    jobOffer: "Not needed",
    endorsement: "Required",
  },
  {
    id: "high-potential-individual",
    name: "High Potential Individual",
    href: "https://www.gov.uk/high-potential-individual-visa",
    internalHref: "/visas/high-potential-individual",
    suits: "Recent graduates of top-ranked universities abroad",
    jobOffer: "Not needed",
    endorsement: "Eligible university",
  },
  {
    id: "skilled-worker",
    name: "Skilled Worker",
    href: "https://www.gov.uk/skilled-worker-visa",
    internalHref: "/visas/skilled-worker",
    suits: "Senior hires with a UK job offer",
    jobOffer: "Licensed sponsor",
    endorsement: "Not needed",
  },
  {
    id: "scale-up",
    name: "Scale-up",
    href: "https://www.gov.uk/scale-up-worker-visa",
    suits: "Hires into fast-growing UK businesses",
    jobOffer: "Scale-up sponsor",
    endorsement: "Not needed",
  },
  {
    id: "global-business-mobility",
    name: "Senior or Specialist Worker",
    href: "https://www.gov.uk/senior-specialist-worker-visa",
    suits: "Transfers to your employer's UK branch",
    jobOffer: "Intra-company transfer",
    endorsement: "Not needed",
  },
];
