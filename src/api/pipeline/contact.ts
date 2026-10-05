import type { candidates } from "../db/schema";
import type { ContactDetails } from "../types";
import { exaRequest } from "./exa";
import type { JsonSchema } from "./json-schema";

type ContactCandidate = Pick<
  typeof candidates.$inferSelect,
  "name" | "title" | "organisation" | "location" | "profileUrl"
>;

type AgentRun = {
  id: string;
  status: string;
  output?: { structured?: unknown } | null;
  error?: { message?: string } | null;
};

const OUTPUT_SCHEMA: JsonSchema = {
  type: "object",
  required: ["identityConfirmed"],
  properties: {
    identityConfirmed: { type: "boolean", description: "Whether the person was confidently identified" },
    emails: { type: "array", maxItems: 2, items: { type: "string", format: "email" } },
    phones: { type: "array", maxItems: 1, items: { type: "string", format: "phone" } },
    linkedinUrl: { type: "string", format: "uri" },
    website: { type: "string", format: "uri", description: "Personal or company website" },
    twitter: { type: "string", format: "uri" },
    notes: { type: "string", description: "One sentence on where the contact details came from and how reliable they are" },
  },
};

const SYSTEM_PROMPT =
  "You find professional contact details for a specific person so a UK Government officer can reach out to them. Only return details that belong to this exact person. Prefer work emails and official channels. Never guess an email pattern without evidence. Leave fields empty rather than inventing them.";

function asStrings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && !!item.trim()) : [];
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function startContactLookup(apiKey: string, candidate: ContactCandidate) {
  const role = [candidate.title, candidate.organisation].filter(Boolean).join(" at ");
  const run = await exaRequest<AgentRun>(apiKey, "/agent/runs", {
    query: `Find professional contact details (work email, phone, website, X/Twitter, LinkedIn) for ${candidate.name}${role ? `, ${role}` : ""}${candidate.location ? `, based in ${candidate.location}` : ""}.${candidate.profileUrl ? ` Their profile: ${candidate.profileUrl}.` : ""}`,
    effort: "low",
    systemPrompt: SYSTEM_PROMPT,
    outputSchema: OUTPUT_SCHEMA,
  });
  const details: ContactDetails = {
    status: "searching",
    runId: run.id,
    emails: [],
    phones: [],
    linkedinUrl: null,
    website: null,
    twitter: null,
    notes: null,
    error: null,
    checkedAt: new Date().toISOString(),
  };
  return details;
}

export async function refreshContactLookup(apiKey: string, current: ContactDetails, fallbackLinkedIn: string | null) {
  if (current.status !== "searching" || !current.runId) return current;
  const run = await exaRequest<AgentRun>(apiKey, `/agent/runs/${current.runId}`);
  const checkedAt = new Date().toISOString();
  if (run.status === "failed" || run.status === "cancelled") {
    return { ...current, status: "failed" as const, error: run.error?.message ?? `Lookup ${run.status}`, checkedAt };
  }
  if (run.status !== "completed") return current;

  const raw = run.output?.structured;
  const record: Record<string, unknown> = raw && typeof raw === "object" ? Object.fromEntries(Object.entries(raw)) : {};
  const emails = asStrings(record.emails);
  const phones = asStrings(record.phones);
  const linkedinUrl = asString(record.linkedinUrl) ?? fallbackLinkedIn;
  const website = asString(record.website);
  const twitter = asString(record.twitter);
  const found = record.identityConfirmed !== false && (emails.length > 0 || phones.length > 0 || !!website || !!twitter);
  return {
    ...current,
    status: found ? ("found" as const) : ("not_found" as const),
    emails,
    phones,
    linkedinUrl,
    website,
    twitter,
    notes: asString(record.notes),
    checkedAt,
  };
}
