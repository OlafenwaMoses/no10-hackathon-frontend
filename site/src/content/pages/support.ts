import type { TopicContent } from "../topic-content";

export const SUPPORT: TopicContent = {
  path: "/find-support",
  navTitle: "Find support",
  title: "Find support",
  lead: "The Global Talent Taskforce helps exceptional people make the move.",
  glance: [
    "Clear answers on visas, tax and regulation.",
    "Help choosing a visa route and preparing evidence.",
    "Introductions to investors, universities and regional partners.",
  ],
  sections: [
    {
      id: "who",
      title: "Who we work with",
      text: "Founders, investors, executives and researchers in Digital and Tech, AI, Life Sciences and Clean Energy. The Taskforce reports to No10, HM Treasury and the Department for Business and Trade.",
    },
    {
      id: "limits",
      title: "What we cannot do",
      text: "We cannot decide visa applications or give legal or tax advice. UK Visas and Immigration makes visa decisions.",
    },
    {
      id: "providers",
      title: "Trusted providers",
      tag: "Coming soon",
      text: "A list of vetted legal, tax, relocation and property specialists. Inclusion will not be a government endorsement.",
    },
  ],
  official: [{ href: "https://www.gov.uk/find-an-immigration-adviser", text: "Find a regulated immigration adviser" }],
};
