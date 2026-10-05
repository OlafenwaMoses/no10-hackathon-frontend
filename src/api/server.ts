import { defineHandler } from "nitro/h3";
import app from "./index";
import { readEnv } from "./env";
import { workflowBinding } from "./lib/workflow-binding";
import { candidateWorkflow } from "./workflows/candidate-workflow";
import { searchWorkflow } from "./workflows/search-workflow";

const SEARCH_WORKFLOW = workflowBinding(searchWorkflow);
const CANDIDATE_WORKFLOW = workflowBinding(candidateWorkflow);

export default defineHandler((event) =>
  app.fetch(
    event.req,
    { ...readEnv(), SEARCH_WORKFLOW, CANDIDATE_WORKFLOW },
    {
      waitUntil: (promise) => event.waitUntil(promise),
      passThroughOnException: () => undefined,
      props: {},
    },
  ),
);
