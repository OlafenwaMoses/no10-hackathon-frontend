import type { TopicContent } from "../topic-content";

export const LIVING: TopicContent = {
  parent: { href: "/moving-to-the-uk", text: "Moving to the UK" },
  path: "/living",
  navTitle: "Living",
  title: "Living in the UK",
  lead: "Banking, housing and driving when you settle in.",
  glance: [
    "Prove your status with an eVisa share code.",
    "Most people rent before they buy.",
    "There are no general restrictions on foreign buyers.",
    "You can drive on a foreign licence for up to 12 months.",
  ],
  sections: [
    {
      id: "evisa",
      title: "Your eVisa",
      text: "Landlords, employers and banks check your status online. Set up your UK Visas and Immigration account as soon as your visa is granted.",
      link: { href: "https://www.gov.uk/view-prove-immigration-status", text: "View and prove your status" },
    },
    {
      id: "banking",
      title: "Banking",
      text: "App-based banks can open an account quickly with your passport and visa. Many banks have teams for new arrivals.",
    },
    {
      id: "housing",
      title: "Housing",
      text: "Landlords in England must check your right to rent. Buyers pay Stamp Duty above a threshold, with a surcharge for non-residents.",
      link: { href: "https://www.gov.uk/government/publications/how-to-rent", text: "How to rent" },
    },
    {
      id: "cost",
      title: "Cost of living",
      text: "Housing drives the difference. Manchester, Edinburgh, Bristol, Belfast and Cardiff cost considerably less than London.",
      link: { href: "/regions", text: "Compare regions" },
    },
  ],
  official: [
    { href: "https://www.gov.uk/stamp-duty-land-tax", text: "Stamp Duty Land Tax" },
    { href: "https://www.gov.uk/driving-nongb-licence", text: "Driving on a non-GB licence" },
  ],
};
