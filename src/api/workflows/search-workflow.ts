import { and, count, eq, notInArray } from "drizzle-orm";
import { FatalError, sleep } from "workflow";
import { start } from "workflow/api";
import { candidates, searches } from "../db/schema";
import { readEnv } from "../env";
import { withDatabase, type Database } from "../lib/db-client";
import { withBackoff } from "../lib/with-backoff";
import { discoverPeople } from "../pipeline/discover";
import { errorMessage } from "../pipeline/retry";
import { getTalentSearch, startTalentSearch, talentCsvToCandidates } from "../pipeline/talent-api";
import {
  ALL,
  type CreateSearchBody,
  type SearchCategoryChoice,
  type SearchKind,
  type SearchSectorChoice,
  type SearchStatus,
} from "../types";
import { candidateWorkflow } from "./candidate-workflow";

export type SearchWorkflowParams = { searchId: string; request?: CreateSearchBody };

type LoadedSearch = {
  kind: SearchKind;
  category: SearchCategoryChoice;
  sector: SearchSectorChoice;
  query: string;
  numResults: number;
};

const MAX_POLLS = 40;
const TALENT_API_MAX_POLLS = 60;

function db<T>(fn: (db: Database) => Promise<T>) {
  return withDatabase(readEnv().DATABASE_URL, fn);
}

async function loadSearch(searchId: string): Promise<LoadedSearch> {
  "use step";
  return withBackoff(async () => {
    const [row] = await db((db) =>
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
    if (!row) throw new FatalError(`Search ${searchId} not found`);
    return row;
  });
}

async function setSearchStatus(searchId: string, status: SearchStatus) {
  "use step";
  await withBackoff(() =>
    db((db) => db.update(searches).set({ status, error: null }).where(eq(searches.id, searchId))),
  );
}

async function startTalentApiSearch(request: CreateSearchBody) {
  "use step";
  return withBackoff(async () => {
    const started = await startTalentSearch(readEnv(), request);
    return started.id;
  });
}

async function checkTalentApiSearch(talentSearchId: string) {
  "use step";
  return withBackoff(async () => {
    const { status, error } = await getTalentSearch(readEnv(), talentSearchId);
    return { status, error: error ?? null };
  });
}

async function waitForTalentSearch(request: CreateSearchBody) {
  const talentSearchId = await startTalentApiSearch(request);
  for (let poll = 0; poll < TALENT_API_MAX_POLLS; poll++) {
    const result = await checkTalentApiSearch(talentSearchId);
    if (result.status === "ready") return talentSearchId;
    if (result.status === "failed") throw new Error(`Talent API search failed: ${result.error ?? "unknown error"}`);
    await sleep("20s");
  }
  throw new Error("Talent API search did not finish within 20 minutes");
}

async function talentApiPeople(talentSearchId: string, search: LoadedSearch) {
  const result = await getTalentSearch(readEnv(), talentSearchId);
  if (!result.csv_base64) throw new FatalError(`Talent API search ${talentSearchId} returned no CSV`);
  return talentCsvToCandidates(result.csv_base64, search);
}

async function exaPeople(search: LoadedSearch) {
  const queries = search.query
    .split("\n")
    .map((query) => query.trim())
    .filter(Boolean);
  const perQuery = Math.max(1, Math.ceil(search.numResults / queries.length));
  const apiKey = readEnv().EXA_API_KEY;
  const batches = await Promise.all(queries.map((query) => discoverPeople(apiKey, query, perQuery)));
  const unique = new Map(batches.flat().map((person) => [person.profileUrl, person]));
  return [...unique.values()].slice(0, search.numResults).map((person) => ({
    ...person,
    category: search.category === ALL ? ("highly_talented" as const) : search.category,
    sector: search.sector === ALL ? ("other" as const) : search.sector,
  }));
}

async function discoverCandidates(searchId: string, search: LoadedSearch, talentSearchId: string | null) {
  "use step";
  return withBackoff(async () => {
    if (search.kind === "import") {
      const rows = await db((db) =>
        db
          .select({ id: candidates.id })
          .from(candidates)
          .where(and(eq(candidates.searchId, searchId), eq(candidates.status, "discovered"))),
      );
      return rows.map((row) => row.id);
    }
    const people = talentSearchId ? await talentApiPeople(talentSearchId, search) : await exaPeople(search);
    return db(async (db) => {
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
}

async function countRemaining(searchId: string) {
  "use step";
  return withBackoff(async () => {
    const [row] = await db((db) =>
      db
        .select({ value: count() })
        .from(candidates)
        .where(and(eq(candidates.searchId, searchId), notInArray(candidates.status, ["scored", "failed"]))),
    );
    return row?.value ?? 0;
  });
}

async function markSearchFailed(searchId: string, message: string) {
  "use step";
  await withBackoff(() =>
    db((db) => db.update(searches).set({ status: "failed", error: message }).where(eq(searches.id, searchId))),
  );
}

export async function searchWorkflow({ searchId, request }: SearchWorkflowParams) {
  "use workflow";

  try {
    const search = await loadSearch(searchId);

    await setSearchStatus(searchId, "discovering");

    const talentSearchId =
      search.kind === "search" && request && process.env.TALENT_API_URL ? await waitForTalentSearch(request) : null;

    const candidateIds = await discoverCandidates(searchId, search, talentSearchId);

    await setSearchStatus(searchId, "processing");

    await Promise.all(candidateIds.map((candidateId) => start(candidateWorkflow, [{ candidateId }])));

    for (let poll = 0; poll < MAX_POLLS && candidateIds.length > 0; poll++) {
      await sleep("20s");
      const remaining = await countRemaining(searchId);
      if (remaining === 0) break;
    }

    await setSearchStatus(searchId, "complete");
  } catch (error) {
    await markSearchFailed(searchId, errorMessage(error));
  }
}
