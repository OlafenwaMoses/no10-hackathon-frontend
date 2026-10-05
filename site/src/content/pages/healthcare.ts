import type { TopicContent } from "../topic-content";

export const HEALTHCARE: TopicContent = {
  parent: { href: "/moving-to-the-uk", text: "Moving to the UK" },
  path: "/healthcare",
  navTitle: "Healthcare",
  title: "Healthcare",
  lead: "How the NHS works for new arrivals, and where private cover fits.",
  glance: [
    "Most visa holders pay the immigration health surcharge.",
    "You can then use the NHS like UK residents.",
    "Register with a GP soon after you arrive.",
    "Call 999 in an emergency, or NHS 111 for urgent help.",
  ],
  sections: [
    {
      id: "nhs",
      title: "The NHS",
      text: "Healthcare is mostly free at the point of use. Your GP is the first point of contact and can refer you to specialists.",
      link: { href: "https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/", text: "Register with a GP" },
    },
    {
      id: "ihs",
      title: "Immigration health surcharge",
      text: "Paid with visa applications for more than 6 months. Some people are exempt or can get a refund.",
      link: { href: "https://www.gov.uk/healthcare-immigration-application", text: "Pay for UK healthcare" },
    },
    {
      id: "private",
      title: "Private healthcare",
      text: "Many senior packages include private medical insurance for faster specialist access. It works alongside the NHS.",
    },
  ],
  official: [
    { href: "https://www.gov.uk/healthcare-immigration-application", text: "Immigration health surcharge" },
    { href: "https://www.nhs.uk/nhs-services/visiting-or-moving-to-england/", text: "Moving to England (nhs.uk)" },
  ],
};
