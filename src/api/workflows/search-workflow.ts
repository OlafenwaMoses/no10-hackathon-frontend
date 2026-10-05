import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";
import { and, count, eq, notInArray } from "drizzle-orm";
import { candidates, searches } from "../db/schema";
import { withDatabase, type Database } from "../lib/db-client";
import { discoverPeople } from "../pipeline/discover";
import { errorMessage } from "../pipeline/retry";
import { getTalentSearch, startTalentSearch, talentCsvToCandidates } from "../pipeline/talent-api";
import {
  ALL,
  type CreateSearchBody,
  type SearchCategoryChoice,
  type SearchSectorChoice,
  type SearchStatus,
} from "../types";

export type SearchWorkflowParams = { searchId: string; request?: CreateSearchBody };

type LoadedSearch = {
  category: SearchCategoryChoice;
  sector: SearchSectorChoice;
  query: string;
  numResults: number;
};

const BATCH_LIMIT = 100;
const MAX_POLLS = 40;
const TALENT_API_MAX_POLLS = 60;

export class SearchWorkflow extends WorkflowEntrypoint<CloudflareBindings, SearchWorkflowParams> {
  private db<T>(fn: (db: Database) => Promise<T>) {
    return withDatabase(this.env.DATABASE_URL, fn);
  }

  private setStatus(step: WorkflowStep, searchId: string, status: SearchStatus) {
    return step.do(`status ${status}`, async () => {
      await this.db((db) => db.update(searches).set({ status, error: null }).where(eq(searches.id, searchId)));
    });
  }

  private async waitForTalentSearch(step: WorkflowStep, request: CreateSearchBody) {
    const talentSearchId = await step.do("start talent api search", async () => {
      const started = await startTalentSearch(this.env, request);
      return started.id;
    });
    for (let poll = 0; poll < TALENT_API_MAX_POLLS; poll++) {
      const result = await step.do(`check talent api search ${poll}`, async () => {
        const { status, error } = await getTalentSearch(this.env, talentSearchId);
        return { status, error: error ?? null };
      });
      if (result.status === "ready") return talentSearchId;
      if (result.status === "failed") {
        throw new NonRetryableError(`Talent API search failed: ${result.error ?? "unknown error"}`);
      }
      await step.sleep(`talent api wait-${poll}`, "20 seconds");
    }
    throw new NonRetryableError("Talent API search did not finish within 20 minutes");
  }

  private async talentApiPeople(talentSearchId: string, search: LoadedSearch) {
    const result = await getTalentSearch(this.env, talentSearchId);
    if (!result.csv_base64) throw new NonRetryableError(`Talent API search ${talentSearchId} returned no CSV`);
    return talentCsvToCandidates(result.csv_base64, search);
  }

  private async exaPeople(search: LoadedSearch) {
    const queries = search.query
      .split("\n")
      .map((query) => query.trim())
      .filter(Boolean);
    const perQuery = Math.max(1, Math.ceil(search.numResults / queries.length));
    const batches = await Promise.all(queries.map((query) => discoverPeople(this.env.EXA_API_KEY, query, perQuery)));
    const unique = new Map(batches.flat().map((person) => [person.profileUrl, person]));
    return [...unique.values()].slice(0, search.numResults).map((person) => ({
      ...person,
      category: search.category === ALL ? ("highly_talented" as const) : search.category,
      sector: search.sector === ALL ? ("other" as const) : search.sector,
    }));
  }

  async run(event: WorkflowEvent<SearchWorkflowParams>, step: WorkflowStep) {
    const { searchId, request } = event.payload;

    try {
      const search = await step.do("load search", async () => {
        const [row] = await this.db((db) =>
          db
            .select({
              kind: searches.kind,
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

      const talentSearchId =
        search.kind === "search" && request && this.env.TALENT_API_URL
          ? await this.waitForTalentSearch(step, request)
          : null;

      const candidateIds = await step.do("discover candidates", async () => {
        if (search.kind === "import") {
          const rows = await this.db((db) =>
            db
              .select({ id: candidates.id })
              .from(candidates)
              .where(and(eq(candidates.searchId, searchId), eq(candidates.status, "discovered"))),
          );
          return rows.map((row) => row.id);
        }
        const people = talentSearchId
          ? await this.talentApiPeople(talentSearchId, search)
          : await this.exaPeople(search);
        return this.db(async (db) => {
          if (people.length) {
            await db
              .insert(candidates)
              .values(people.map((person) => ({ ...person, searchId, status: "discovered" as const })))
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
