export const MOVING_TOPICS = [
  { href: "/tax", title: "Tax", text: "Residence, new-arrival relief and investor reliefs.", icon: "tax" },
  { href: "/schools-and-family", title: "Schools and family", text: "Schools, childcare and universities.", icon: "school" },
  { href: "/healthcare", title: "Healthcare", text: "The NHS, GPs and private cover.", icon: "health" },
  { href: "/living", title: "Living", text: "Banking, housing and driving.", icon: "home" },
] as const;

export const HOME_TOPICS = [
  { href: "/visas", title: "Visas", text: "Compare the main routes.", icon: "visa" },
  ...MOVING_TOPICS,
  { href: "/regions", title: "Regions", text: "Where your sector is strongest.", icon: "pin" },
] as const;
