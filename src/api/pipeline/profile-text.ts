import type { candidates } from "../db/schema";
import { RESIDENCE_REGION_LABELS, UK_LINK_TYPE_LABELS } from "../types";

type ProfileCandidate = Pick<
  typeof candidates.$inferSelect,
  | "name"
  | "headline"
  | "title"
  | "organisation"
  | "location"
  | "entity"
  | "highlights"
  | "ukLinks"
  | "source"
  | "notes"
  | "residenceRegion"
  | "linkedinProfile"
>;

function dateRange(dates: { from?: string | null; to?: string | null } | null | undefined) {
  if (!dates?.from && !dates?.to) return "";
  return ` (${dates.from ?? "?"} → ${dates.to ?? "present"})`;
}

function workTitle(work: unknown) {
  if (typeof work === "string") return work;
  if (work && typeof work === "object" && "title" in work && typeof work.title === "string") return work.title;
  return null;
}

function linkedInRange(start: string | null, end: string | null) {
  return start || end ? ` (${start ?? "?"} → ${end ?? "present"})` : "";
}

function linkedInSection(candidate: ProfileCandidate) {
  const profile = candidate.linkedinProfile;
  if (!profile) return null;
  const lines = ["LinkedIn Profile:"];
  if (profile.summary) lines.push(`Summary: ${profile.summary}`);
  if (profile.positions.length) {
    lines.push("Positions:");
    for (const position of profile.positions.slice(0, 12)) {
      const description = position.description ? `: ${position.description.slice(0, 400)}` : "";
      lines.push(`- ${position.title ?? "Role"} at ${position.company ?? "Unknown"}${linkedInRange(position.start, position.end)}${description}`);
    }
  }
  if (profile.education.length) {
    lines.push("Education:");
    for (const item of profile.education) {
      const degree = [item.degree, item.fieldOfStudy].filter(Boolean).join(", ") || "Studied";
      lines.push(`- ${degree} at ${item.school ?? "Unknown"}${linkedInRange(item.start, item.end)}`);
    }
  }
  if (profile.languages.length) lines.push(`Languages: ${profile.languages.join(", ")}`);
  if (profile.skills.length) lines.push(`Skills: ${profile.skills.slice(0, 30).join(", ")}`);
  if (profile.followersCount) lines.push(`LinkedIn followers: ${profile.followersCount}`);
  return lines.join("\n");
}

function userSuppliedSection(candidate: ProfileCandidate) {
  if (candidate.source !== "manual") return null;
  const lines = [
    candidate.organisation ? `Organisation: ${candidate.organisation}` : null,
    candidate.title ? `Role: ${candidate.title}` : null,
    candidate.location ? `Location: ${candidate.location}` : null,
    candidate.residenceRegion ? `Current residence: ${RESIDENCE_REGION_LABELS[candidate.residenceRegion]}` : null,
    candidate.notes ? `Notes: ${candidate.notes}` : null,
  ].filter((line) => line !== null);
  if (lines.length === 0) return null;
  return `**Very Important: User Supplied Information** (supplied by a Global Talent Taskforce officer and verified; MUST take precedence over anything below that conflicts with it)\n${lines.join("\n")}`;
}

function positionsSection(candidate: ProfileCandidate) {
  if (candidate.linkedinProfile?.positions.length) return null;
  const history = candidate.entity?.properties.workHistory ?? [];
  const lines = history
    .filter((role) => role.title || role.company?.name)
    .map((role) => `- ${role.title ?? "Role"} at ${role.company?.name ?? "Unknown"}${dateRange(role.dates)}`);
  if (lines.length === 0 && (candidate.title || candidate.organisation)) {
    lines.push(`- ${candidate.title ?? "Role"} at ${candidate.organisation ?? "Unknown"}`);
  }
  return lines.length ? `Positions:\n${lines.join("\n")}` : null;
}

function educationSection(candidate: ProfileCandidate) {
  if (candidate.linkedinProfile?.education.length) return null;
  const history = candidate.entity?.properties.educationHistory ?? [];
  const lines = history
    .filter((item) => item.degree || item.institution?.name)
    .map((item) => `- ${item.degree ?? "Studied"} at ${item.institution?.name ?? "Unknown"}${dateRange(item.dates)}`);
  return lines.length ? `Education:\n${lines.join("\n")}` : null;
}

function researchSection(candidate: ProfileCandidate) {
  const research = candidate.entity?.properties.research;
  if (!research) return null;
  const parts = [
    research.worksCount != null ? `works ${research.worksCount}` : null,
    research.citationCount != null ? `citations ${research.citationCount}` : null,
    research.hIndex != null ? `h-index ${research.hIndex}` : null,
    research.areas?.length ? `areas ${research.areas.join(", ")}` : null,
  ].filter((part) => part !== null);
  const notable = (research.notableWorks ?? [])
    .map(workTitle)
    .filter((title) => title !== null)
    .slice(0, 5);
  if (parts.length === 0 && notable.length === 0) return null;
  const lines = [`Research: ${parts.join(", ")}`];
  if (notable.length) lines.push(`Notable works:\n${notable.map((title) => `- ${title}`).join("\n")}`);
  return lines.join("\n");
}

function highlightsSection(candidate: ProfileCandidate) {
  const highlights = candidate.highlights.map((text) => text.trim()).filter(Boolean);
  return highlights.length ? `Highlights:\n${highlights.map((text) => `- ${text}`).join("\n")}` : null;
}

function ukLinksSection(candidate: ProfileCandidate) {
  const ukLinks = candidate.ukLinks;
  if (!ukLinks) return null;
  const lines = [`Verdict: ${ukLinks.verdict}`];
  for (const link of ukLinks.links) lines.push(`- ${UK_LINK_TYPE_LABELS[link.type]}: ${link.detail}`);
  if (ukLinks.currentCountry) lines.push(`Current country: ${ukLinks.currentCountry}`);
  if (ukLinks.ukGovernmentLinks) lines.push(`UK Government links: ${ukLinks.ukGovernmentLinks}`);
  if (ukLinks.evidence) lines.push(`Evidence: ${ukLinks.evidence}`);
  return `UK links research:\n${lines.join("\n")}`;
}

export function renderProfileText(candidate: ProfileCandidate) {
  const header = [
    `Name: ${candidate.name}`,
    `Headline: ${candidate.headline ?? candidate.linkedinProfile?.headline ?? candidate.title ?? ""}`,
    `Location: ${candidate.location ?? "Unknown"}`,
  ].join("\n");

  return [
    header,
    userSuppliedSection(candidate),
    linkedInSection(candidate),
    positionsSection(candidate),
    educationSection(candidate),
    researchSection(candidate),
    highlightsSection(candidate),
    ukLinksSection(candidate),
  ]
    .filter((section) => section !== null)
    .join("\n\n");
}
