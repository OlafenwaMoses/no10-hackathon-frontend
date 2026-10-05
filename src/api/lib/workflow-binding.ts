import { start } from "workflow/api";
import type { WorkflowBinding } from "../env";

export function workflowBinding<Params>(workflow: (params: Params) => Promise<void>): WorkflowBinding<Params> {
  return {
    async create({ params }) {
      const run = await start(workflow, [params]);
      return { id: run.runId };
    },
  };
}
