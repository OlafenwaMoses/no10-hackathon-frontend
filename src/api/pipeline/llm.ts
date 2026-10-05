import type { ChatMessage } from "../types";
import type { JsonSchema } from "./json-schema";
import { withRetries } from "./retry";

export type LlmEnv = Pick<CloudflareBindings, "OPENAI_API_KEY" | "OPENAI_MODEL">;

type Effort = "none" | "low" | "medium" | "high";

type OpenAIMessagePart = { type: string; text?: string; refusal?: string };

type OpenAIResponse = {
  status: string;
  output: { type: string; content?: OpenAIMessagePart[] }[];
  incomplete_details?: { reason?: string } | null;
  error?: { message?: string } | null;
};

type StrictSchema = Omit<JsonSchema, "properties" | "items"> & {
  properties?: Record<string, StrictSchema>;
  items?: StrictSchema;
  additionalProperties?: false;
};

type OpenAIRequest = {
  env: LlmEnv;
  system: string;
  messages: ChatMessage[];
  effort: Effort;
  schema?: JsonSchema;
};

const OPENAI_URL = "https://api.openai.com/v1/responses";
const ATTEMPTS = 3;
const TIMEOUT_MS = 180_000;

function toStrictSchema(schema: JsonSchema): StrictSchema {
  const { properties, items, ...rest } = schema;
  if (properties) {
    return {
      ...rest,
      properties: Object.fromEntries(Object.entries(properties).map(([key, value]) => [key, toStrictSchema(value)])),
      required: Object.keys(properties),
      additionalProperties: false,
    };
  }
  return items ? { ...rest, items: toStrictSchema(items) } : rest;
}

async function callOpenAI({ env, system, messages, effort, schema }: OpenAIRequest) {
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      reasoning: { effort },
      instructions: system,
      input: messages.map((message) => ({
        role: message.role === "model" ? "assistant" : "user",
        content: message.content,
      })),
      store: false,
      ...(schema
        ? { text: { format: { type: "json_schema", name: "output", schema: toStrictSchema(schema), strict: true } } }
        : {}),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status}): ${(await response.text()).slice(0, 1000)}`);
  }

  const data: OpenAIResponse = await response.json();
  if (data.status !== "completed") {
    throw new Error(`OpenAI response not completed: ${data.incomplete_details?.reason ?? data.error?.message ?? data.status}`);
  }
  const parts = data.output.filter((item) => item.type === "message").flatMap((item) => item.content ?? []);
  const refusal = parts.find((part) => part.type === "refusal");
  if (refusal) throw new Error(`OpenAI refused: ${refusal.refusal ?? ""}`);
  const text = parts
    .map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error("OpenAI returned no text");
  return text;
}

function stripFences(text: string) {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export async function generateJson<T>(options: {
  env: LlmEnv;
  system: string;
  prompt: string;
  schema: JsonSchema;
  effort?: Effort;
  validate?: (value: T) => void;
}): Promise<T> {
  return withRetries(ATTEMPTS, async () => {
    const text = await callOpenAI({
      env: options.env,
      system: options.system,
      messages: [{ role: "user", content: options.prompt }],
      effort: options.effort ?? "low",
      schema: options.schema,
    });
    const value: T = JSON.parse(stripFences(text));
    options.validate?.(value);
    return value;
  });
}

export async function generateText(options: {
  env: LlmEnv;
  system: string;
  messages: ChatMessage[];
  effort?: Effort;
}) {
  return withRetries(ATTEMPTS, () =>
    callOpenAI({ env: options.env, system: options.system, messages: options.messages, effort: options.effort ?? "low" }),
  );
}
