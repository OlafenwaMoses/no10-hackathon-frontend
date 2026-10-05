import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";
import { and, count, eq, notInArray } from "drizzle-orm";
import { candidates, searches } from "../db/schema";
import { withDatabase, type Database } from "../lib/db-client";
import { discoverPeople } from "../pipeline/discover";
import { errorMessage } from "../pipeline/retry";
import type { SearchStatus } from "../types";

export type SearchWorkflowParams = { searchId: string };

const BATCH_LIMIT = 100;
const MAX_POLLS = 40;

export class SearchWorkflow extends WorkflowEntrypoint<CloudflareBindings, SearchWorkflowParams> {
  private db<T>(fn: (db: Database) => Promise<T>) {
    return withDatabase(this.env.DATABASE_URL, fn);
  }

  private setStatus(step: WorkflowStep, searchId: string, status: SearchStatus) {
    return step.do(`status ${status}`, async () => {
      await this.db((db) => db.update(searches).set({ status, error: null }).where(eq(searches.id, searchId)));
    });
  }

  async run(event: WorkflowEvent<SearchWorkflowParams>, step: WorkflowStep) {
    const { searchId } = event.payload;

    try {
      const search = await step.do("load search", async () => {
        const [row] = await this.db((db) =>
          db
            .select({
              category: searches.category,
              sector: searches.sector,
              query: searches.query,
              numResults: searches.numResults,
            })
            .from(searches)
            .where(eq(searches.id, searchId)),
        );
        if (!row) throw new NonRetryableError(`Search ${searchId} not found`);
        return row;
      });

      await this.setStatus(step, searchId, "discovering");

      const candidateIds = await step.do("discover candidates", async () => {
        const people = await discoverPeople(this.env.EXA_API_KEY, search.query, search.numResults);
        return this.db(async (db) => {
          if (people.length) {
            await db
              .insert(candidates)
              .values(
                people.map((person) => ({
                  ...person,
                  searchId,
                  category: search.category,
                  sector: search.sector,
                  status: "discovered" as const,
                })),
              )
              .onConflictDoNothing({ target: candidates.profileUrl });
          }
          const rows = await db
            .select({ id: candidates.id })
            .from(candidates)
            .where(and(eq(candidates.searchId, searchId), eq(candidates.status, "discovered")));
          return rows.map((row) => row.id);
        });
      });

      await this.setStatus(step, searchId, "processing");

      await step.do("dispatch candidates", async () => {
        const startedAt = Date.now();
        for (let index = 0; index < candidateIds.length; index += BATCH_LIMIT) {
          const batch = candidateIds.slice(index, index + BATCH_LIMIT);
          await this.env.CANDIDATE_WORKFLOW.createBatch(
            batch.map((candidateId) => ({ id: `candidate-${candidateId}-${startedAt}`, params: { candidateId } })),
          );
        }
        return candidateIds.length;
      });

      for (let poll = 0; poll < MAX_POLLS && candidateIds.length > 0; poll++) {
        await step.sleep(`wait-${poll}`, "20 seconds");
        const remaining = await step.do(`count remaining ${poll}`, async () => {
          const [row] = await this.db((db) =>
            db
              .select({ value: count() })
              .from(candidates)
              .where(and(eq(candidates.searchId, searchId), notInArray(candidates.status, ["scored", "failed"]))),
          );
          return row?.value ?? 0;
        });
        if (remaining === 0) break;
      }

      await this.setStatus(step, searchId, "complete");
    } catch (error) {
      const message = errorMessage(error);
      await step.do("mark search failed", async () => {
        await this.db((db) =>
          db.update(searches).set({ status: "failed", error: message }).where(eq(searches.id, searchId)),
        );
      });
    }
  }
}
