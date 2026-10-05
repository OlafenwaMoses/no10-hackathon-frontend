import { UK_LINK_TYPE_LABELS, type PersonaAttributes, type UkLinks } from "../types";

function verifiedRecord(ukLinks: UkLinks | null | undefined) {
  if (!ukLinks || (ukLinks.links.length === 0 && !ukLinks.ukGovernmentLinks)) return null;
  const facts = ukLinks.links.map((link) => `- ${UK_LINK_TYPE_LABELS[link.type]}: ${link.detail}`);
  if (ukLinks.ukGovernmentLinks) facts.push(`- UK Government links: ${ukLinks.ukGovernmentLinks}`);
  return `## Your Verified Record\nThe facts below are your actual, verified record. They are true. When the question touches anything these facts cover, rely on them rather than memory or guesswork.\n\n${facts.join("\n")}`;
}

export function renderPersonaProfile(persona: PersonaAttributes, ukLinks?: UkLinks | null) {
  const profile = `Name: ${persona.name}
Gender: ${persona.gender}
Cultural Background: ${persona.culturalBackground}
Current Country: ${persona.currentCountry}
Current City: ${persona.currentCity}

Job Title: ${persona.title}
Organisation: ${persona.organisation}
Sector: ${persona.sector}
Income: ${persona.income}

Biography:
${persona.biography}

Interests:
${persona.interests}

Attitudes:
${persona.attitudes}

Demeanour:
${persona.demeanour}

Behaviours:
${persona.behaviours}

Motivation:
${persona.motivation}

Personality:
${persona.personality}

Languages: ${persona.languages.join(", ")}`;

  const record = verifiedRecord(ukLinks);
  return record ? `${profile}\n\n${record}` : profile;
}
