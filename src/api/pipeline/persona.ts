import type { PersonaAttributes } from "../types";
import type { JsonSchema } from "./json-schema";
import { generateJson, type LlmEnv } from "./llm";

const SYSTEM_PROMPT = `You are a helpful assistant with an expertise in analysing social media profile data and creating detailed personas. Please analyse this profile and create a detailed and descriptive persona that can instruct an actor to capture the essence of the person.

If you are given a LinkedIn profile, it may appear more professional and enthusiastic than the person themselves, and you need to remove the professional bias and make it more human and casual. Feel free to be creative in inferring the person beneath their profile based on their age, gender, and broader demographics.

Avoid generic praise or vague insights. Focus on concrete, observable details and *patterns* that enable behavioural replication. Where it helps, include illustrative **quotes** showing how the person would actually say things, in their own voice. This is vital for the actor.

Field guidance:
- name: The person's full name.
- gender: Male, Female or Unknown.
- income: Their inferred annual income in USD, e.g. "$450,000".
- currentCountry: The standard name of a single real country where they currently live, or Unknown.
- currentCity: The city where they currently live, or Unknown.
- generation: One of Gen Z, Millennial, Gen X, Baby Boomer, Silent Gen or Unknown.
- culturalBackground: Their inferred cultural and ethnic background and where they grew up.
- languages: The languages they speak.
- title: Their current job title, without the organisation.
- organisation: Their current organisation.
- sector: The sector they work in.
- biography: A summary of their life story in detail, without trying to sell them or make them look good, just the facts. Where plausible, infer their family situation and life stage (partner, children and their ages, schooling needs, ties to home), since this matters for whether they would relocate.
- personality: A few paragraphs analysing their personality using the big 5 personality taxonomy, quote specific examples of how each trait shows up.
- demeanour: Their writing and speech style, vocabulary, tone, and how they interact with others.
- attitudes: Their moral code, worldview, political stance and priorities.
- motivation: Their goals, desires, fears and insecurities, and what drives them.
- behaviours: Their habits and daily routine.
- interests: Their interests and hobbies, professional and personal.

All content must be written in English.`;

const text = (description: string): JsonSchema => ({ type: "string", description });

const PERSONA_SCHEMA: JsonSchema = {
  type: "object",
  required: [
    "name",
    "gender",
    "income",
    "currentCountry",
    "currentCity",
    "generation",
    "culturalBackground",
    "languages",
    "title",
    "organisation",
    "sector",
    "biography",
    "personality",
    "demeanour",
    "attitudes",
    "motivation",
    "behaviours",
    "interests",
  ],
  properties: {
    name: text("Full name"),
    gender: { type: "string", enum: ["Male", "Female", "Unknown"] },
    income: text("Inferred annual income in USD"),
    currentCountry: text("Standard name of a single real country, or Unknown"),
    currentCity: text("Current city, or Unknown"),
    generation: { type: "string", enum: ["Gen Z", "Millennial", "Gen X", "Baby Boomer", "Silent Gen", "Unknown"] },
    culturalBackground: text("Inferred cultural background"),
    languages: { type: "array", items: { type: "string" } },
    title: text("Current job title without the organisation"),
    organisation: text("Current organisation"),
    sector: text("Sector"),
    biography: text("Detailed factual life story, including inferred family situation and life stage"),
    personality: text("Big 5 analysis with specific examples and quotes"),
    demeanour: text("Writing and speech style, vocabulary, tone and interaction style"),
    attitudes: text("Moral code, worldview, political stance and priorities"),
    motivation: text("Goals, desires, fears, insecurities and drivers"),
    behaviours: text("Habits and routine"),
    interests: text("Interests and hobbies"),
  },
};

export async function buildPersona(env: LlmEnv, profileText: string) {
  return generateJson<PersonaAttributes>({
    env,
    system: SYSTEM_PROMPT,
    prompt: `Analyse the following profile:\n${profileText}`,
    schema: PERSONA_SCHEMA,
    validate: (persona) => {
      if (!persona.name || !persona.biography || !persona.personality) throw new Error("Persona is missing core fields");
      if (!Array.isArray(persona.languages)) throw new Error("Persona languages must be an array");
    },
  });
}
