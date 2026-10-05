import type { TopicContent } from "../topic-content";

export const TAX: TopicContent = {
  parent: { href: "/moving-to-the-uk", text: "Moving to the UK" },
  path: "/tax",
  navTitle: "Tax",
  title: "Tax",
  lead: "How the UK taxes new arrivals, and the reliefs for investors and companies.",
  glance: [
    "Residence is set by the Statutory Residence Test.",
    "New residents can claim 4 years' relief on foreign income and gains.",
    "Tax treaties help you avoid paying tax twice.",
    "SEIS, EIS and VCTs give investors tax relief.",
  ],
  sections: [
    {
      id: "residence",
      title: "UK residence",
      text: "The Statutory Residence Test looks at your days in the UK and your ties here. UK residents pay tax on worldwide income and gains.",
      link: { href: "https://www.gov.uk/tax-foreign-income/residence", text: "Tax on foreign income: residence" },
    },
    {
      id: "fig",
      title: "Foreign income and gains regime",
      text: "After 10 consecutive years of non-residence, you can claim relief on foreign income and gains for your first 4 years of UK residence.",
      link: { href: "https://www.gov.uk/tax-foreign-income", text: "Tax on foreign income" },
    },
    {
      id: "reliefs",
      title: "Reliefs for investors and companies",
      text: "Investors in qualifying early-stage companies can get income tax and capital gains reliefs. Companies can claim R&D relief, the Patent Box and EMI share options.",
      link: { href: "https://www.gov.uk/guidance/venture-capital-schemes-tax-relief-for-investors", text: "Venture capital schemes" },
    },
    {
      id: "advice",
      title: "Take advice early",
      text: "Speak to a qualified tax adviser before you arrive, when the most options are open to you.",
    },
  ],
  official: [
    { href: "https://www.gov.uk/tax-foreign-income", text: "Tax on foreign income" },
    { href: "https://www.gov.uk/income-tax-rates", text: "Income tax rates and allowances" },
  ],
};
