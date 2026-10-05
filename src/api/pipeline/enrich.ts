import { UK_LINK_TYPES, type Citation, type UkLinkType, type UkLinkVerdict, type UkLinks } from "../types";
import type { candidates } from "../db/schema";
import { exaRequest } from "./exa";
import type { JsonSchema } from "./json-schema";
import { errorMessage } from "./retry";

type EnrichCandidate = Pick<typeof candidates.$inferSelect, "name" | "title" | "organisation" | "location">;

type DeepSearchResponse = {
  output?: {
    content?: unknown;
    grounding?: { field: string; citations: { url: string; title?: string | null }[]; confidence?: string }[];
  } | null;
};

const VERDICTS = ["strong", "some", "none_found", "cannot_verify"] as const satisfies readonly UkLinkVerdict[];

const SYSTEM_PROMPT = [
  "You are researching one specific person for the UK Government's Global Talent Taskforce.",
  "Make sure every fact is about this exact person, not someone with a similar name.",
  "Only report ties to the United Kingdom that are supported by a cited source.",
  "Prefer official bios, company and university pages, Companies House, government publications and reputable press.",
  "Ties include studying or working in the UK, directorships of UK companies, UK investments, UK citizenship or residence, their company having a UK office, engagement with the UK Government, and UK events or media.",
  "Separately, note any public evidence of the person's personal wealth: company exits and their size, founder or executive equity in valued companies, funds they personally backed, rich-list entries, property or philanthropy.",
  "If nothing credible is found, say so rather than guessing.",
].join(" ");

const OUTPUT_SCHEMA: JsonSchema = {
  type: "object",
  required: ["hasUkLinks", "verdict", "linkTypes", "linkDetails", "currentCountry", "ukGovernmentLinks", "evidence"],
  properties: {
    hasUkLinks: { type: "boolean", description: "Whether any sourced tie to the UK was found" },
    verdict: {
      type: "string",
      enum: VERDICTS,
      description: "strong = multiple or substantial UK ties; some = minor ties; none_found = researched, no ties; cannot_verify = could not confirm the identity",
    },
    linkTypes: {
      type: "array",
      items: { type: "string", enum: UK_LINK_TYPES },
      description: "One entry per UK tie found",
    },
    linkDetails: {
      type: "array",
      items: { type: "string" },
      description: "One short sentence per entry in linkTypes, in the same order, describing the specific tie",
    },
    currentCountry: { type: "string", description: "Standard English name of the single country where the person currently lives, e.g. \"Germany\" or \"United States\". Country name only, no city or explanation. \"Unknown\" if not established." },
    ukGovernmentLinks: {
      type: "string",
      description: "Any engagement with UK Government, departments, UKRI, ARIA or ministers, or an empty string",
    },
    wealthEvidence: {
      type: "string",
      description: "One or two sentences of sourced evidence about the person's personal wealth (exits, equity in valued companies, rich lists), or an empty string",
    },
    evidence: { type: "string", description: "Two or three sentences summarising what was found and how reliable it is" },
  },
};

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function isLinkType(value: string): value is UkLinkType {
  return UK_LINK_TYPES.some((type) => type === value);
}

function isVerdict(value: unknown): value is UkLinkVerdict {
  return VERDICTS.some((verdict) => verdict === value);
}

function citationsFrom(response: DeepSearchResponse) {
  const citations = new Map<string, Citation>();
  for (const ground of response.output?.grounding ?? []) {
    for (const citation of ground.citations) {
      if (!citations.has(citation.url)) citations.set(citation.url, { url: citation.url, title: citation.title ?? null });
    }
  }
  return [...citations.values()];
}

function toUkLinks(response: DeepSearchResponse): UkLinks {
  const content = response.output?.content;
  if (!content || typeof content !== "object") throw new Error("Deep search returned no structured output");

  const record = Object.fromEntries(Object.entries(content));
  const details = asStringArray(record.linkDetails);
  const links = asStringArray(record.linkTypes)
    .map((type, index) => ({ type, detail: details[index] ?? "" }))
    .filter((link): link is { type: UkLinkType; detail: string } => isLinkType(link.type));
  const country = asString(record.currentCountry);

  return {
    verdict: isVerdict(record.verdict) ? record.verdict : links.length ? "some" : "none_found",
    links,
    currentCountry: country && country.toLowerCase() !== "unknown" ? country.split(/[(.;]/)[0].trim() : null,
    ukGovernmentLinks: asString(record.ukGovernmentLinks),
    wealthEvidence: asString(record.wealthEvidence),
    evidence: asString(record.evidence) ?? "",
    citations: citationsFrom(response),
  };
}

function describe(candidate: EnrichCandidate) {
  const role = [candidate.title, candidate.organisation].filter(Boolean).join(" at ");
  const location = candidate.location ? ` (${candidate.location})` : "";
  return `${candidate.name}${role ? `, ${role}` : ""}${location}`;
}

export async function enrichUkLinks(apiKey: string, candidate: EnrichCandidate): Promise<UkLinks> {
  try {
    const response = await exaRequest<DeepSearchResponse>(apiKey, "/search", {
      query: `${describe(candidate)}: connections to the United Kingdom and UK Government, and evidence of personal wealth`,
      type: "deep",
      numResults: 5,
      contents: { text: false, highlights: false },
      systemPrompt: SYSTEM_PROMPT,
      outputSchema: OUTPUT_SCHEMA,
    });
    return toUkLinks(response);
  } catch (error) {
    return {
      verdict: "cannot_verify",
      links: [],
      currentCountry: null,
      ukGovernmentLinks: null,
      evidence: `UK links research could not be completed: ${errorMessage(error)}`,
      citations: [],
    };
  }
}
