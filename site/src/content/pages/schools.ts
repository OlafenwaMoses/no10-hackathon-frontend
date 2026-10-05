import type { TopicContent } from "../topic-content";

export const SCHOOLS: TopicContent = {
  parent: { href: "/moving-to-the-uk", text: "Moving to the UK" },
  path: "/schools-and-family",
  navTitle: "Schools and family",
  title: "Schools and family",
  lead: "Schools, childcare and universities for families moving to the UK.",
  glance: [
    "State schools are free for most visa holders' children.",
    "Your partner and children under 18 can usually join you.",
    "Most children start a new school in September.",
    "Each UK nation runs its own school system.",
  ],
  sections: [
    {
      id: "schools",
      title: "State and independent schools",
      text: "Apply for a state school through the council where you live. Independent schools set their own admissions and can have waiting lists.",
      link: { href: "https://www.gov.uk/schools-admissions", text: "School admissions" },
    },
    {
      id: "timing",
      title: "Start early",
      text: "School places are often the longest lead-time part of a family move. You usually need a UK address to apply for a state school.",
    },
    {
      id: "international",
      title: "International curricula",
      text: "Many schools, especially in major cities, offer the IB or American, French, German and other national curricula.",
    },
    {
      id: "universities",
      title: "Universities",
      text: "Home or international fee status depends on immigration status and residence. Undergraduates apply through UCAS.",
      link: { href: "https://www.gov.uk/higher-education-courses-find-and-apply", text: "Find and apply for a university course" },
    },
  ],
  official: [
    { href: "https://www.gov.uk/types-of-school", text: "Types of school" },
    { href: "https://www.gov.uk/help-with-childcare-costs", text: "Help paying for childcare" },
  ],
};
