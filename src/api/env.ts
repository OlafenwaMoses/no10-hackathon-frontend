import type { CandidateWorkflowParams } from "./workflows/candidate-workflow";
import type { SearchWorkflowParams } from "./workflows/search-workflow";

const DEFAULT_OPENAI_MODEL = "gpt-6-luna";

export type EnvVars = {
  OPENAI_MODEL: string;
  DATABASE_URL: string;
  EXA_API_KEY: string;
  OPENAI_API_KEY: string;
  APP_PASSWORD: string;
  REVERSE_CONTACT_API_KEY: string;
  INBOUND_SECRET: string;
  TALENT_API_URL: string;
  TALENT_API_KEY: string;
};

export type WorkflowBinding<Params> = {
  create(options: { id: string; params: Params }): Promise<{ id: string }>;
};

export type Bindings = EnvVars & {
  SEARCH_WORKFLOW: WorkflowBinding<SearchWorkflowParams>;
  CANDIDATE_WORKFLOW: WorkflowBinding<CandidateWorkflowParams>;
};

export function readEnv(): EnvVars {
  const env = process.env;
  return {
    OPENAI_MODEL: env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
    DATABASE_URL: env.DATABASE_URL ?? "",
    EXA_API_KEY: env.EXA_API_KEY ?? "",
    OPENAI_API_KEY: env.OPENAI_API_KEY ?? "",
    APP_PASSWORD: env.APP_PASSWORD ?? "",
    REVERSE_CONTACT_API_KEY: env.REVERSE_CONTACT_API_KEY ?? "",
    INBOUND_SECRET: env.INBOUND_SECRET ?? "",
    TALENT_API_URL: env.TALENT_API_URL ?? "",
    TALENT_API_KEY: env.TALENT_API_KEY ?? "",
  };
}
