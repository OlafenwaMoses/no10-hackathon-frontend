import type { ExaPersonEntity } from "../types";
import { exaRequest } from "./exa";

type ExaOtherEntity = { type: "company" | "publication"; id?: string };

type ExaPeopleResult = {
  id: string;
  url: string;
  title?: string | null;
  image?: string | null;
  highlights?: string[] | null;
  entities?: (ExaPersonEntity | ExaOtherEntity)[] | null;
};

type ExaPeopleResponse = { results: ExaPeopleResult[] };

const UK_LOCATION =
  /\b(united kingdom|uk|u\.k\.|great britain|britain|england|scotland|wales|northern ireland|london|manchester|edinburgh|glasgow|oxford|oxfordshire|cambridgeshire|bristol|leeds|liverpool|belfast|cardiff|sheffield|newcastle upon tyne|nottingham|reading, (berkshire|england)|cambridge, (uk|united kingdom|england))\b/i;
const NOT_UK_LOCATION = /\b(new england|new south wales|ontario|new hampshire|massachusetts)\b/i;

export function isUkLocation(location: string | null | undefined) {
  if (!location) return false;
  return UK_LOCATION.test(location) && !NOT_UK_LOCATION.test(location);
}

export function normaliseProfileUrl(url: string) {
  const match = url.match(/linkedin\.com\/in\/([^/?#]+)/i);
  return match ? `https://www.linkedin.com/in/${match[1]}` : url;
}

function parseTitle(title: string | null | undefined) {
  const cleaned = (title ?? "").replace(/\s*[|\-–—]\s*LinkedIn\s*$/i, "").trim();
  const parts = cleaned.split(/\s+\|\s+|\s+[-–—]\s+/);
  const name = parts[0]?.trim() ?? "";
  const headline = parts.slice(1).join(" - ").trim();
  return { name, headline: headline || null };
}

function currentRole(entity: ExaPersonEntity | undefined) {
  const history = entity?.properties.workHistory ?? [];
  return history.find((role) => role.dates && !role.dates.to) ?? history[0];
}

function toPerson(result: ExaPeopleResult) {
  const entity = result.entities?.find((item) => item.type === "person");
  const parsed = parseTitle(result.title);
  const role = currentRole(entity);
  const name = entity?.properties.name?.trim() || parsed.name;

  return {
    profileUrl: normaliseProfileUrl(result.url),
    exaId: result.id,
    name,
    headline: parsed.headline,
    title: role?.title ?? null,
    organisation: role?.company?.name ?? null,
    location: entity?.properties.location ?? role?.location ?? null,
    pictureUrl: result.image ?? null,
    entity: entity ?? null,
    highlights: result.highlights ?? [],
  };
}

export type DiscoveredPerson = ReturnType<typeof toPerson>;

export async function searchPeople(apiKey: string, query: string, numResults: number) {
  const response = await exaRequest<ExaPeopleResponse>(apiKey, "/search", {
    query,
    type: "auto",
    category: "people",
    numResults,
    contents: { highlights: { maxCharacters: 2000 } },
  });
  return response.results.map(toPerson);
}

export async function discoverPeople(apiKey: string, query: string, numResults: number) {
  const people = new Map<string, DiscoveredPerson>();
  for (const person of await searchPeople(apiKey, query, numResults)) {
    if (!person.name || isUkLocation(person.location) || people.has(person.profileUrl)) continue;
    people.set(person.profileUrl, person);
  }
  return [...people.values()];
}
