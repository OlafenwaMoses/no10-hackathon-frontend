import type { candidates } from "../db/schema";
import type { LinkedInProfile, Resolution } from "../types";
import { normaliseProfileUrl, searchPeople, type DiscoveredPerson } from "./discover";
import { fetchLinkedInProfile, resolveLinkedInProfileByName } from "./reverse-contact";
import { errorMessage } from "./retry";
import type { EnvVars } from "../env";

type ResolveEnv = Pick<EnvVars, "EXA_API_KEY" | "REVERSE_CONTACT_API_KEY">;

type ResolveCandidate = Pick<
  typeof candidates.$inferSelect,
  "name" | "title" | "organisation" | "location" | "profileUrl"
>;

function fold(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function nameTokens(name: string) {
  return fold(name)
    .split(/[^a-z]+/)
    .filter((token) => token.length >= 2);
}

function nameMatches(name: string, haystack: string) {
  const tokens = nameTokens(name);
  if (tokens.length === 0) return false;
  const text = fold(haystack);
  const first = tokens[0];
  const last = tokens[tokens.length - 1];
  return text.includes(first) && text.includes(last);
}

function organisationMatches(organisation: string | null, haystack: string) {
  if (!organisation) return false;
  const tokens = fold(organisation)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !["inc", "ltd", "llc", "the", "gmbh", "group"].includes(token));
  const text = fold(haystack);
  return tokens.length > 0 && tokens.some((token) => text.includes(token));
}

function isLinkedInUrl(url: string | null | undefined): url is string {
  return !!url && /linkedin\.com\/in\//i.test(url);
}

function personText(person: DiscoveredPerson) {
  const history = (person.entity?.properties.workHistory ?? []).map((role) => role.company?.name ?? "").join(" ");
  return [person.name, person.headline, person.title, person.organisation, history, person.profileUrl].join(" ");
}

function linkedInText(profile: LinkedInProfile) {
  return [
    profile.firstName,
    profile.lastName,
    profile.headline,
    profile.publicId,
    ...profile.positions.map((position) => position.company),
  ].join(" ");
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

async function lookupLinkedIn(env: ResolveEnv, candidate: ResolveCandidate, steps: string[]) {
  const apiKey = env.REVERSE_CONTACT_API_KEY;
  if (!apiKey) {
    steps.push("Reverse Contact not configured, skipped LinkedIn lookup");
    return null;
  }
  try {
    if (isLinkedInUrl(candidate.profileUrl)) {
      const profile = await fetchLinkedInProfile(apiKey, normaliseProfileUrl(candidate.profileUrl));
      steps.push(profile ? "Reverse Contact fetched the LinkedIn profile from the URL" : "Reverse Contact found nothing at the LinkedIn URL");
      return profile ? { profile, method: "reverse_contact_url" as const, confidence: "strong" as const } : null;
    }
    const { firstName, lastName } = splitName(candidate.name);
    if (!lastName) {
      steps.push("Name too short for a Reverse Contact name lookup");
      return null;
    }
    const profile = await resolveLinkedInProfileByName(apiKey, { firstName, lastName, companyName: candidate.organisation });
    if (!profile || !nameMatches(candidate.name, linkedInText(profile))) {
      steps.push("Reverse Contact name lookup found no matching profile");
      return null;
    }
    const confidence: Resolution["confidence"] = organisationMatches(candidate.organisation, linkedInText(profile)) ? "strong" : "weak";
    steps.push(`Reverse Contact matched a LinkedIn profile by name (${confidence})`);
    return { profile, method: "reverse_contact_name" as const, confidence };
  } catch (error) {
    steps.push(`Reverse Contact failed: ${errorMessage(error).slice(0, 200)}`);
    return null;
  }
}

async function lookupExa(env: ResolveEnv, candidate: ResolveCandidate, knownUrl: string | null, steps: string[]) {
  const query = [
    candidate.name,
    candidate.title ? `, ${candidate.title}` : "",
    candidate.organisation ? ` at ${candidate.organisation}` : "",
    candidate.location ? `, ${candidate.location}` : "",
  ].join("");
  try {
    const people = await searchPeople(env.EXA_API_KEY, query, 5);
    if (knownUrl) {
      const exact = people.find((person) => person.profileUrl === knownUrl);
      if (exact) {
        steps.push("Exa found the same profile");
        return { person: exact, confidence: "strong" as const };
      }
    }
    const named = people.filter((person) => nameMatches(candidate.name, personText(person)));
    const withOrganisation = named.find((person) => organisationMatches(candidate.organisation, personText(person)));
    const person = withOrganisation ?? named[0];
    if (!person) {
      steps.push(`Exa people search returned ${people.length} results but none matched the name`);
      return null;
    }
    const confidence: Resolution["confidence"] = withOrganisation ? "strong" : "weak";
    steps.push(`Exa people search matched ${person.name} (${confidence})`);
    return { person, confidence };
  } catch (error) {
    steps.push(`Exa people search failed: ${errorMessage(error).slice(0, 200)}`);
    return null;
  }
}

export async function resolveManualCandidate(env: ResolveEnv, candidate: ResolveCandidate) {
  const steps: string[] = [];
  const linkedIn = await lookupLinkedIn(env, candidate, steps);
  const knownUrl =
    linkedIn?.profile.profileUrl ?? (isLinkedInUrl(candidate.profileUrl) ? normaliseProfileUrl(candidate.profileUrl) : null);
  const exa = await lookupExa(env, candidate, knownUrl, steps);

  const resolution: Resolution = linkedIn
    ? { method: linkedIn.method, confidence: linkedIn.confidence, matchedUrl: linkedIn.profile.profileUrl, steps }
    : exa
      ? { method: "exa", confidence: exa.confidence, matchedUrl: exa.person.profileUrl, steps }
      : { method: "manual_only", confidence: "none", matchedUrl: null, steps };

  const profile = linkedIn?.profile ?? null;
  const person = exa?.person ?? null;
  const currentPosition = profile?.positions.find((position) => !position.end) ?? profile?.positions[0];

  return {
    linkedinProfile: profile,
    resolution,
    profileUrl: candidate.profileUrl ?? profile?.profileUrl ?? person?.profileUrl ?? null,
    exaId: person?.exaId ?? null,
    entity: person?.entity ?? null,
    highlights: person?.highlights ?? [],
    headline: profile?.headline ?? person?.headline ?? null,
    title: candidate.title ?? currentPosition?.title ?? person?.title ?? null,
    organisation: candidate.organisation ?? currentPosition?.company ?? person?.organisation ?? null,
    location: candidate.location ?? profile?.location ?? person?.location ?? null,
    pictureUrl: profile?.photoUrl ?? person?.pictureUrl ?? null,
  };
}
