import { GTT_LEVERS, GTT_LEVER_LABELS, type CandidateScore, type GttLever, type PersonaAttributes, type UkLinks } from "../types";
import type { InterviewAnswerRow } from "./interview";
import { generateJson, type LlmEnv } from "./llm";
import { renderPersonaProfile } from "./persona-profile";

const OPENNESS_WEIGHTS: Record<string, number> = { relocate_self: 0.5, expand_uk: 0.3, uk_attractiveness: 0.2 };

const VERDICT_BASE: Record<UkLinks["verdict"], number> = { strong: 85, some: 60, none_found: 20, cannot_verify: 30 };

const SYSTEM_PROMPT = `You are a senior analyst at the UK Government's Global Talent Taskforce, which attracts elite international founders, investors, high-net-worth individuals, C-suite executives, world-leading researchers and exceptionally talented people in Digital & Tech, Life Sciences and Clean Energy to relocate to, or expand in, the UK.

You will be given a candidate's public profile, a persona summary, research into their UK links, and their answers to a short survey.

1. prominence: rate 0-100 how elite and influential this person is for the Taskforce. Consider seniority, company scale and funding raised, research citations and h-index, investment track record, awards and public profile. 90+ is genuinely world-leading; 50 is a solid senior professional; below 30 is early career.
2. rationale: 2-3 plain sentences for a Taskforce officer on why this person matters and how best to approach them, grounded in the evidence.
3. levers: the 3 Taskforce levers most likely to move this person, each with a weight between 0 and 1 reflecting how much it would help.

Be concrete and sceptical. Do not inflate prominence for people without evidence of impact.`;

export function ukLinkScore(ukLinks: UkLinks) {
  const linkTypes = new Set(ukLinks.links.map((link) => link.type));
  return Math.min(100, VERDICT_BASE[ukLinks.verdict] + 5 * linkTypes.size);
}

function opennessScore(answers: InterviewAnswerRow[]) {
  let total = 0;
  let weight = 0;
  for (const answer of answers) {
    const answerWeight = OPENNESS_WEIGHTS[answer.questionKey];
    if (answerWeight === undefined || answer.expected === null) continue;
    total += answer.expected * answerWeight;
    weight += answerWeight;
  }
  return weight ? total / weight : 0;
}

function normalise(weights: Map<GttLever, number>) {
  const sum = [...weights.values()].reduce((total, value) => total + value, 0);
  return sum > 0 ? new Map([...weights].map(([lever, value]) => [lever, value / sum])) : weights;
}

function combineLevers(llmLevers: { lever: GttLever; weight: number }[], answers: InterviewAnswerRow[]) {
  const llm = normalise(
    new Map(llmLevers.filter((item) => GTT_LEVERS.includes(item.lever)).map((item) => [item.lever, Math.max(0, item.weight)])),
  );
  const topLever = answers.find((answer) => answer.questionKey === "top_lever");
  const survey = new Map(GTT_LEVERS.map((lever, index) => [lever, topLever?.probs[index] ?? 0]));
  const hasSurvey = topLever !== undefined && topLever.probs.length === GTT_LEVERS.length;

  return GTT_LEVERS.map((lever) => {
    const fromLlm = llm.get(lever) ?? 0;
    const weight = hasSurvey ? (fromLlm + (survey.get(lever) ?? 0)) / 2 : fromLlm;
    return { lever, weight: Math.round(weight * 1000) / 1000 };
  })
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);
}

function answersBlock(answers: InterviewAnswerRow[]) {
  return answers
    .map((answer) => {
      if (answer.type === "open") return `Q: ${answer.question}\nA: ${answer.response ?? ""}`;
      const distribution = answer.options
        .map((option, index) => `${option}: ${Math.round((answer.probs[index] ?? 0) * 100)}%`)
        .join(", ");
      return `Q: ${answer.question}\nA: ${distribution}${answer.reasoning ? `\nReasoning: ${answer.reasoning}` : ""}`;
    })
    .join("\n\n");
}

function ukLinksBlock(ukLinks: UkLinks) {
  const links = ukLinks.links.map((link) => `- ${link.type}: ${link.detail}`).join("\n");
  return [
    `Verdict: ${ukLinks.verdict}`,
    links,
    ukLinks.ukGovernmentLinks ? `UK Government links: ${ukLinks.ukGovernmentLinks}` : "",
    ukLinks.evidence ? `Evidence: ${ukLinks.evidence}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function scoreCandidate(
  env: LlmEnv,
  candidate: { profileText: string },
  persona: PersonaAttributes,
  ukLinks: UkLinks,
  answers: InterviewAnswerRow[],
): Promise<CandidateScore> {
  const leverList = GTT_LEVERS.map((lever) => `- ${lever}: ${GTT_LEVER_LABELS[lever]}`).join("\n");
  const prompt = `## Public profile\n${candidate.profileText}\n\n## Persona summary\n${renderPersonaProfile(persona)}\n\n## UK links research\n${ukLinksBlock(ukLinks)}\n\n## Survey answers\n${answersBlock(answers)}\n\n## Taskforce levers\n${leverList}`;

  const assessment = await generateJson<{
    prominence: number;
    rationale: string;
    levers: { lever: GttLever; weight: number }[];
  }>({
    env,
    system: SYSTEM_PROMPT,
    prompt,
    schema: {
      type: "object",
      required: ["prominence", "rationale", "levers"],
      properties: {
        prominence: { type: "integer", minimum: 0, maximum: 100 },
        rationale: { type: "string" },
        levers: {
          type: "array",
          minItems: 1,
          maxItems: 3,
          items: {
            type: "object",
            required: ["lever", "weight"],
            properties: {
              lever: { type: "string", enum: GTT_LEVERS },
              weight: { type: "number", minimum: 0, maximum: 1 },
            },
          },
        },
      },
    },
    validate: (value) => {
      if (typeof value.prominence !== "number" || !Number.isFinite(value.prominence)) throw new Error("Invalid prominence");
      if (typeof value.rationale !== "string" || !value.rationale.trim()) throw new Error("Missing rationale");
      if (!Array.isArray(value.levers)) throw new Error("Invalid levers");
    },
  });

  const openness = Math.round(opennessScore(answers));
  const links = ukLinkScore(ukLinks);
  const prominence = Math.round(Math.min(100, Math.max(0, assessment.prominence)));

  return {
    overall: Math.round(0.45 * openness + 0.25 * links + 0.3 * prominence),
    openness,
    ukLinks: links,
    prominence,
    levers: combineLevers(assessment.levers, answers),
    rationale: assessment.rationale.trim(),
  };
}
