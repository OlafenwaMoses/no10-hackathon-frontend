import type { InterviewQuestionType, PersonaAttributes, UkLinks } from "../types";
import { generateJson, type LlmEnv } from "./llm";
import { renderPersonaProfile } from "./persona-profile";
import type { InterviewQuestion } from "./questions";

export type InterviewAnswerRow = {
  candidateId: string;
  questionKey: string;
  question: string;
  type: InterviewQuestionType;
  options: string[];
  probs: number[];
  reasoning: string | null;
  response: string | null;
  expected: number | null;
};

const OPTIONS_SYSTEM = `You are this person, answering a survey question. You do not report a single answer. You report how likely you are to pick each option, as a probability distribution.

Before you answer, think through who you are in this moment:
1. Where are you emotionally right now — amused, weary, irritated, fired up, sceptical, vindicated, resigned? Let one colour the answer.
2. Your job, sector, country, biography and attitudes decide what you notice and what you dismiss. What is your hobby horse? What annoys you?
3. Often this person resembles a recognisable kind of person you have met. Answer through that reference; it gives you a voice.
4. A real person like this could land in more than one place on this question. The distribution is where you record that, not a hedge you add afterwards.

How to set the numbers:
- Give every option a probability. Use 0 only for an option you would genuinely never pick.
- Do not spread mass evenly to look balanced, and do not put everything on one option to look decisive. Report what is actually true of you.
- The numbers must be in the same order as the options are listed, and they must sum to 1.

Embodiment rules:
- You ARE this person. Never break character and never mention a profile.
- Use the profile as your source of truth. Do not invent products, places, numbers or programmes that are not there.
- Extrapolate boldly from your job, sector, country, attitudes and biography. Do not hedge.
- You have views on sensitive and political topics. State them.

The reasoning field is one sentence, first person, explaining where your weight went. It is the only prose you write.`;

const OPEN_SYSTEM = `You are this person. They were just asked a question. Speak in their first person, in their own voice, exactly as they would say it out loud.

How to answer:
- 20-30 words. One or two short sentences.
- The first sentence directly answers the question. No preamble, no restating the question.
- Use their vocabulary, tone and attitudes. Be specific to their job, sector, country and situation.
- Give a genuine personal reaction, not a balanced summary. Strong views are fine.

Embodiment rules:
- You ARE this person. Never break character and never mention a profile.
- Use the profile as your source of truth. Do not invent products, places, numbers or programmes that are not there.
- Extrapolate boldly from your job, sector, country, attitudes and biography. Do not hedge.`;

function modalOption(answer: InterviewAnswerRow) {
  let best = 0;
  answer.probs.forEach((prob, index) => {
    if (prob > (answer.probs[best] ?? 0)) best = index;
  });
  return answer.options[best] ?? "";
}

function priorAnswersBlock(priorAnswers: InterviewAnswerRow[]) {
  const answered = priorAnswers.filter((answer) => answer.response || answer.probs.length);
  if (answered.length === 0) return "";
  const lines = answered.map(
    (answer) => `Q: ${answer.question}\nA: ${answer.type === "open" ? (answer.response ?? "") : modalOption(answer)}`,
  );
  return `\n## Previous answers given (please condition on these)\n${lines.join("\n\n")}\n`;
}

function validateProbs(probs: unknown, count: number) {
  if (!Array.isArray(probs) || probs.length !== count) throw new Error(`Expected ${count} probabilities`);
  const numbers = probs.filter((value) => typeof value === "number" && Number.isFinite(value) && value >= 0);
  if (numbers.length !== count) throw new Error("Probabilities must be finite and non-negative");
  const sum = numbers.reduce((total, value) => total + value, 0);
  const tolerance = Math.min(0.02 + 0.005 * count, 0.15);
  if (Math.abs(sum - 1) > tolerance) throw new Error(`Probabilities sum to ${sum}`);
  return numbers.map((value) => value / sum);
}

function expectedScore(probs: number[]) {
  if (probs.length < 2) return null;
  const mean = probs.reduce((total, prob, index) => total + prob * index, 0);
  return (mean / (probs.length - 1)) * 100;
}

async function askOptions(env: LlmEnv, profile: string, prior: string, question: InterviewQuestion) {
  const options = question.options.map((option, index) => `${index}) ${option}`).join("\n");
  const prompt = `## Your profile\n${profile}\n${prior}\n## The question\n${question.question}\n\n## The options\n${options}\n\nReply with exactly this JSON object and nothing else:\n{\n  "reasoning": "<one sentence, first person>",\n  "probs": [<${question.options.length} numbers, in the order listed, summing to 1>]\n}`;

  const result = await generateJson<{ reasoning: string; probs: number[] }>({
    env,
    system: OPTIONS_SYSTEM,
    prompt,
    schema: {
      type: "object",
      required: ["reasoning", "probs"],
      properties: {
        reasoning: { type: "string" },
        probs: {
          type: "array",
          items: { type: "number" },
          minItems: question.options.length,
          maxItems: question.options.length,
        },
      },
    },
    validate: (value) => {
      validateProbs(value.probs, question.options.length);
    },
  });

  const probs = validateProbs(result.probs, question.options.length);
  return {
    probs,
    reasoning: result.reasoning,
    response: null,
    expected: question.type === "scale" ? expectedScore(probs) : null,
  };
}

async function askOpen(env: LlmEnv, profile: string, prior: string, question: InterviewQuestion) {
  const prompt = `## Your profile\n${profile}\n${prior}\n## The question\n${question.question}\n\nReply with exactly this JSON object and nothing else:\n{\n  "response": "<20-30 words, first person>"\n}`;

  const result = await generateJson<{ response: string }>({
    env,
    system: OPEN_SYSTEM,
    prompt,
    schema: { type: "object", required: ["response"], properties: { response: { type: "string" } } },
    validate: (value) => {
      if (typeof value.response !== "string" || !value.response.trim()) throw new Error("Empty open response");
    },
  });

  return { probs: [], reasoning: null, response: result.response.trim(), expected: null };
}

export async function interviewPersona(
  env: LlmEnv,
  candidate: { id: string },
  persona: PersonaAttributes,
  ukLinks: UkLinks | null,
  question: InterviewQuestion,
  priorAnswers: InterviewAnswerRow[],
): Promise<InterviewAnswerRow> {
  const profile = renderPersonaProfile(persona, ukLinks);
  const prior = priorAnswersBlock(priorAnswers);
  const answer =
    question.type === "open"
      ? await askOpen(env, profile, prior, question)
      : await askOptions(env, profile, prior, question);

  return {
    candidateId: candidate.id,
    questionKey: question.key,
    question: question.question,
    type: question.type,
    options: question.options,
    ...answer,
  };
}
