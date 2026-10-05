export const NAVIGATION = [
  { href: "/visas", text: "Visas", match: ["/visas"] },
  {
    href: "/moving-to-the-uk",
    text: "Moving to the UK",
    match: ["/moving-to-the-uk", "/tax", "/schools-and-family", "/healthcare", "/living"],
  },
  { href: "/regions", text: "Regions", match: ["/regions"] },
  { href: "/find-support", text: "Support", match: ["/find-support"] },
] as const;

export const isActive = (path: string, match: readonly string[]) =>
  match.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
