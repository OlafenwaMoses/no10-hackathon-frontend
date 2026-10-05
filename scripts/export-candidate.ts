import postgres from "postgres";
import {
  GTT_CRITERIA_LABELS,
  GTT_LEVER_LABELS,
  NET_WORTH_BAND_LABELS,
  OUTREACH_STATUS_LABELS,
  RESIDENCE_REGION_LABELS,
  SECTOR_LABELS,
  SHORTLIST_STAGE_LABELS,
  TALENT_CATEGORY_LABELS,
  UK_LINK_TYPE_LABELS,
  type CandidateScore,
  type Classification,
  type ContactDetails,
  type ExaPersonEntity,
  type LinkedInProfile,
  type NetWorth,
  type PersonaAttributes,
  type Resolution,
  type UkLinks,
} from "../src/api/types";

const query = process.argv[2];
if (!query) throw new Error("Usage: bun scripts/export-candidate.ts <name or id>");

const sql = postgres(process.env.DATABASE_URL!, { prepare: false, onnotice: () => {} });
const isId = /^[0-9a-f-]{36}$/i.test(query);
const [c] = isId
  ? await sql`select c.*, s.name as search_name from candidates c left join searches s on s.id = c.search_id where c.id = ${query}`
  : await sql`select c.*, s.name as search_name from candidates c left join searches s on s.id = c.search_id where c.name ilike ${`%${query}%`} order by c.overall_score desc nulls last limit 1`;
if (!c) throw new Error(`No candidate matching "${query}"`);

const answers = await sql`select * from interview_answers where candidate_id = ${c.id} order by created_at`;
const messages = await sql`select role, content, created_at from persona_messages where candidate_id = ${c.id} order by created_at`;
const [entry] = await sql`select * from shortlist_entries where candidate_id = ${c.id}`;
await sql.end();

const ukLinks = c.uk_links as UkLinks | null;
const persona = c.persona as PersonaAttributes | null;
const score = c.score as CandidateScore | null;
const classification = c.classification as Classification | null;
const netWorth = c.net_worth as NetWorth | null;
const contact = c.contact as ContactDetails | null;
const entity = c.entity as ExaPersonEntity | null;
const linkedin = c.linkedin_profile as LinkedInProfile | null;
const resolution = c.resolution as Resolution | null;

const lines: string[] = [];
const push = (...items: (string | null | undefined | false)[]) => lines.push(...items.filter((i): i is string => typeof i === "string"));
const row = (label: string, value: unknown) => (value === null || value === undefined || value === "" ? null : `| ${label} | ${String(value).replace(/\|/g, "\\|").replace(/\n/g, " ")} |`);
const pct = (n: number) => `${Math.round(n * 100)}%`;
const date = (v: unknown) => (v ? new Date(String(v)).toISOString().slice(0, 10) : null);

push(`# ${c.name}`, "", [c.title, c.organisation].filter(Boolean).join(" · ") || null, "");
push("| Field | Value |", "| --- | --- |");
push(
  row("Headline", c.headline),
  row("Location", c.location),
  row("Country", c.country),
  row("Profile", c.profile_url),
  row("Source", c.source),
  row("Found by", c.search_name),
  row("Pipeline status", c.status),
  row("Outreach", OUTREACH_STATUS_LABELS[c.outreach_status as keyof typeof OUTREACH_STATUS_LABELS] ?? c.outreach_status),
  row("Contacted", date(c.contacted_at)),
  row("Added", date(c.created_at)),
  row("Candidate ID", c.id),
);
push("");

if (score) {
  push("## Score", "", `**Overall ${score.overall}/100** — openness ${score.openness}, UK links ${score.ukLinks}, prominence ${score.prominence}`, "", score.rationale, "");
  if (score.levers.length) {
    push("### Recommended levers", "");
    for (const l of score.levers) push(`- ${GTT_LEVER_LABELS[l.lever] ?? l.lever} — ${pct(l.weight)}`);
    push("");
  }
}

if (classification) {
  push("## Global Talent Taskforce classification", "", "| Field | Value |", "| --- | --- |");
  push(
    row("Type of individual", TALENT_CATEGORY_LABELS[classification.category]),
    row("Priority sector", SECTOR_LABELS[classification.sector]),
    row("Sub-sector", classification.subSector),
    row("Criteria", GTT_CRITERIA_LABELS[classification.criteria]),
    row("Current residence", RESIDENCE_REGION_LABELS[classification.residenceRegion]),
    row("Nationality", classification.nationality),
  );
  push("", classification.rationale, "");
}

if (netWorth) {
  push("## Net worth (estimate)", "", `**${NET_WORTH_BAND_LABELS[netWorth.band]}**${netWorth.estimateUsd ? ` — around $${netWorth.estimateUsd.toLocaleString("en-GB")}` : ""} · ${netWorth.confidence} confidence`, "", netWorth.basis, "");
}

if (ukLinks) {
  push("## UK links", "", `**Verdict:** ${ukLinks.verdict}${ukLinks.currentCountry ? ` · currently based in ${ukLinks.currentCountry}` : ""}`, "");
  for (const l of ukLinks.links) push(`- **${UK_LINK_TYPE_LABELS[l.type] ?? l.type}:** ${l.detail}`);
  if (ukLinks.links.length) push("");
  if (ukLinks.ukGovernmentLinks) push(`**UK Government links:** ${ukLinks.ukGovernmentLinks}`, "");
  if (ukLinks.wealthEvidence) push(`**Wealth evidence:** ${ukLinks.wealthEvidence}`, "");
  push(ukLinks.evidence, "");
  if (ukLinks.citations.length) {
    push("Sources:", "");
    for (const cit of ukLinks.citations) push(`- [${cit.title ?? cit.url}](${cit.url})`);
    push("");
  }
}

if (entry) {
  push("## Shortlist / account record", "", "| Field | Value |", "| --- | --- |");
  push(
    row("Stage", SHORTLIST_STAGE_LABELS[entry.stage as keyof typeof SHORTLIST_STAGE_LABELS] ?? entry.stage),
    row("Priority", entry.priority),
    row("Success RAG", entry.success_rag),
    row("Relationship RAG", entry.relationship_rag),
    row("Support", entry.support_level),
    row("Background check", entry.background_check),
    row("Account manager", entry.account_manager),
    row("Relationship holder", entry.relationship_holder),
    row("Lead source", entry.lead_source),
    row("Next step", entry.next_step),
    row("Origin date", entry.origin_date),
    row("Closed", entry.closed_at),
    row("Success category", entry.success_category),
    row("Outcome", entry.outcome),
    row("Failure reason", entry.failure_reason),
  );
  push("");
}

if (contact && (contact.emails.length || contact.phones.length || contact.website || contact.twitter || contact.linkedinUrl)) {
  push("## Contact details", "");
  for (const e of contact.emails) push(`- Email: ${e}`);
  for (const p of contact.phones) push(`- Phone: ${p}`);
  push(contact.linkedinUrl ? `- LinkedIn: ${contact.linkedinUrl}` : null, contact.website ? `- Website: ${contact.website}` : null, contact.twitter ? `- X: ${contact.twitter}` : null);
  push(contact.notes ? `\n_${contact.notes}_` : null, "");
}
if (c.outreach_note) push("## Outreach note", "", c.outreach_note, "");
if (c.notes) push(c.source === "inbound" ? "## Their enquiry" : "## Officer notes", "", c.notes, "");

if (resolution) {
  push("## Profile match", "", `${resolution.method} · ${resolution.confidence}${resolution.matchedUrl ? ` · ${resolution.matchedUrl}` : ""}`, "");
  for (const s of resolution.steps) push(`- ${s}`);
  push("");
}

const work = linkedin?.positions.length
  ? linkedin.positions.map((p) => `- ${p.title ?? "Role"} at ${p.company ?? "Unknown"} (${p.start ?? "?"} → ${p.end ?? "present"})`)
  : (entity?.properties.workHistory ?? []).map((w) => `- ${w.title ?? "Role"} at ${w.company?.name ?? "Unknown"} (${w.dates?.from ?? "?"} → ${w.dates?.to ?? "present"})`);
const education = linkedin?.education.length
  ? linkedin.education.map((e) => `- ${[e.degree, e.fieldOfStudy].filter(Boolean).join(", ") || "Studied"} at ${e.school ?? "Unknown"}`)
  : (entity?.properties.educationHistory ?? []).map((e) => `- ${e.degree ?? "Studied"} at ${e.institution?.name ?? "Unknown"}`);
if (work.length || education.length) {
  push("## Background", "");
  if (work.length) push("### Career", "", ...work, "");
  if (education.length) push("### Education", "", ...education, "");
  const research = entity?.properties.research;
  if (research) push("### Research", "", `Works ${research.worksCount ?? "?"} · citations ${research.citationCount ?? "?"} · h-index ${research.hIndex ?? "?"}${research.areas?.length ? ` · ${research.areas.join(", ")}` : ""}`, "");
}
if ((c.highlights as string[]).length) {
  push("### Highlights", "");
  for (const h of c.highlights as string[]) push(`> ${h.replace(/\s+/g, " ").trim()}`, "");
}

if (answers.length) {
  push("## Persona interview", "", "_Answers from an AI persona built from public information — a prediction, not the person's own words._", "");
  for (const a of answers) {
    push(`### ${a.question}`, "");
    if (a.type === "open") {
      push(`> ${a.response ?? ""}`, "");
      continue;
    }
    const probs = a.probs as number[];
    (a.options as string[]).forEach((option, i) => push(`- ${option}: ${pct(probs[i] ?? 0)}`));
    if (a.expected !== null) push("", `Expected score: ${Math.round(a.expected)}/100`);
    if (a.reasoning) push("", `> ${a.reasoning}`);
    push("");
  }
}

if (persona) {
  push("## AI persona", "", "| Field | Value |", "| --- | --- |");
  push(
    row("Gender", persona.gender),
    row("Generation", persona.generation),
    row("Cultural background", persona.culturalBackground),
    row("Current city", persona.currentCity),
    row("Income (est.)", persona.income),
    row("Languages", persona.languages?.join(", ")),
  );
  push("");
  for (const [label, value] of [
    ["Biography", persona.biography],
    ["Personality", persona.personality],
    ["Demeanour", persona.demeanour],
    ["Attitudes", persona.attitudes],
    ["Motivation", persona.motivation],
    ["Behaviours", persona.behaviours],
    ["Interests", persona.interests],
  ] as const) {
    if (value) push(`### ${label}`, "", value, "");
  }
}

if (messages.length) {
  push("## Chat with persona", "");
  for (const m of messages) push(`**${m.role === "user" ? "Officer" : c.name}:** ${m.content}`, "");
}

const slug = String(c.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = `exports/${slug}.md`;
await Bun.write(out, lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n");
console.log(out);
