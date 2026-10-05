import { and, eq, ne } from "drizzle-orm";
import { FatalError } from "workflow";
import { candidates, interviewAnswers } from "../db/schema";
import { readEnv } from "../env";
import { withDatabase, type Database } from "../lib/db-client";
import { withBackoff } from "../lib/with-backoff";
import { classifyCandidate } from "../pipeline/classify";
import { enrichUkLinks } from "../pipeline/enrich";
import { interviewPersona, type InterviewAnswerRow } from "../pipeline/interview";
import { buildPersona } from "../pipeline/persona";
import { renderProfileText } from "../pipeline/profile-text";
import { buildInterviewQuestions, type InterviewQuestion } from "../pipeline/questions";
import { resolveManualCandidate } from "../pipeline/resolve";
import { errorMessage } from "../pipeline/retry";
import { scoreCandidate, ukLinkScore } from "../pipeline/score";
import type { PersonaAttributes, Sector, TalentCategory, UkLinks } from "../types";

export type CandidateWorkflowParams = { candidateId: string };

type Enriched = {
  ukLinks: UkLinks;
  profileText: string;
  category: TalentCategory;
  sector: Sector;
};

function db<T>(fn: (db: Database) => Promise<T>) {
  return withDatabase(readEnv().DATABASE_URL, fn);
}

async function resolveCandidate(candidateId: string) {
  "use step";
  return withBackoff(async () => {
    const [candidate] = await db((db) => db.select().from(candidates).where(eq(candidates.id, candidateId)));
    if (!candidate) throw new FatalError(`Candidate ${candidateId} not found`);
    if (candidate.source === "search") return false;
    if (candidate.resolution && candidate.resolution.method !== "manual_only") return false;

    await db((db) =>
      db.update(candidates).set({ status: "resolving", error: null }).where(eq(candidates.id, candidateId)),
    );
    const resolved = await resolveManualCandidate(readEnv(), candidate);
    await db(async (db) => {
      let profileUrl = resolved.profileUrl;
      if (profileUrl && profileUrl !== candidate.profileUrl) {
        const [existing] = await db
          .select({ id: candidates.id })
          .from(candidates)
          .where(and(eq(candidates.profileUrl, profileUrl), ne(candidates.id, candidateId)));
        if (existing) {
          resolved.resolution.steps.push(`Matched profile ${profileUrl} is already in the database as another candidate`);
          profileUrl = candidate.profileUrl;
        }
      }
      await db
        .update(candidates)
        .set({ ...resolved, profileUrl })
        .where(eq(candidates.id, candidateId));
    });
    return true;
  });
}

async function enrichCandidate(candidateId: string): Promise<Enriched> {
  "use step";
  return withBackoff(async () => {
    const candidate = await db(async (db) => {
      await db.update(candidates).set({ status: "enriching", error: null }).where(eq(candidates.id, candidateId));
      const [row] = await db.select().from(candidates).where(eq(candidates.id, candidateId));
      return row;
    });
    if (!candidate) throw new FatalError(`Candidate ${candidateId} not found`);

    const ukLinks = await enrichUkLinks(readEnv().EXA_API_KEY, candidate);
    const profileText = renderProfileText({ ...candidate, ukLinks });
    await db((db) =>
      db
        .update(candidates)
        .set({
          ukLinks,
          ukLinkScore: ukLinkScore(ukLinks),
          country: ukLinks.currentCountry ?? candidate.country,
          profileText,
        })
        .where(eq(candidates.id, candidateId)),
    );
    return { ukLinks, profileText, category: candidate.category, sector: candidate.sector };
  });
}

async function buildCandidatePersona(candidateId: string, profileText: string) {
  "use step";
  return withBackoff(async () => {
    await db((db) => db.update(candidates).set({ status: "building_persona" }).where(eq(candidates.id, candidateId)));
    const result = await buildPersona(readEnv(), profileText);
    await db((db) => db.update(candidates).set({ persona: result }).where(eq(candidates.id, candidateId)));
    return result;
  });
}

async function classify(candidateId: string, enriched: Enriched, persona: PersonaAttributes) {
  "use step";
  return withBackoff(async () => {
    const { classification: result, netWorth } = await classifyCandidate(readEnv(), {
      profileText: enriched.profileText,
      persona,
      ukLinks: enriched.ukLinks,
      searchCategory: enriched.category,
      searchSector: enriched.sector,
    });
    await db((db) =>
      db
        .update(candidates)
        .set({
          classification: result,
          category: result.category,
          sector: result.sector,
          subSector: result.subSector,
          criteria: result.criteria,
          residenceRegion: result.residenceRegion,
          nationality: result.nationality,
          netWorth,
          netWorthBand: netWorth.band,
          netWorthUsd: netWorth.estimateUsd,
        })
        .where(eq(candidates.id, candidateId)),
    );
    return result;
  });
}

async function startInterview(candidateId: string) {
  "use step";
  await withBackoff(() =>
    db(async (db) => {
      await db.update(candidates).set({ status: "interviewing" }).where(eq(candidates.id, candidateId));
      await db.delete(interviewAnswers).where(eq(interviewAnswers.candidateId, candidateId));
    }),
  );
}

async function interview(
  candidateId: string,
  persona: PersonaAttributes,
  ukLinks: UkLinks,
  question: InterviewQuestion,
  answers: InterviewAnswerRow[],
) {
  "use step";
  return withBackoff(async () => {
    const row = await interviewPersona(readEnv(), { id: candidateId }, persona, ukLinks, question, answers);
    await db((db) =>
      db
        .insert(interviewAnswers)
        .values(row)
        .onConflictDoUpdate({
          target: [interviewAnswers.candidateId, interviewAnswers.questionKey],
          set: {
            question: row.question,
            type: row.type,
            options: row.options,
            probs: row.probs,
            reasoning: row.reasoning,
            response: row.response,
            expected: row.expected,
          },
        }),
    );
    return row;
  });
}

async function score(candidateId: string, enriched: Enriched, persona: PersonaAttributes, answers: InterviewAnswerRow[]) {
  "use step";
  return withBackoff(async () => {
    await db((db) => db.update(candidates).set({ status: "scoring" }).where(eq(candidates.id, candidateId)));
    const result = await scoreCandidate(readEnv(), enriched, persona, enriched.ukLinks, answers);
    await db((db) =>
      db
        .update(candidates)
        .set({
          status: "scored",
          score: result,
          overallScore: result.overall,
          opennessScore: result.openness,
          ukLinkScore: result.ukLinks,
        })
        .where(eq(candidates.id, candidateId)),
    );
    return result.overall;
  });
}

async function markCandidateFailed(candidateId: string, message: string) {
  "use step";
  await withBackoff(() =>
    db((db) => db.update(candidates).set({ status: "failed", error: message }).where(eq(candidates.id, candidateId))),
  );
}

export async function candidateWorkflow({ candidateId }: CandidateWorkflowParams) {
  "use workflow";

  try {
    await resolveCandidate(candidateId);
    const enriched = await enrichCandidate(candidateId);
    const persona = await buildCandidatePersona(candidateId, enriched.profileText);
    const classification = await classify(candidateId, enriched, persona);
    await startInterview(candidateId);

    const answers: InterviewAnswerRow[] = [];
    for (const question of buildInterviewQuestions(classification.category)) {
      answers.push(await interview(candidateId, persona, enriched.ukLinks, question, answers));
    }

    await score(candidateId, enriched, persona, answers);
  } catch (error) {
    await markCandidateFailed(candidateId, errorMessage(error));
  }
}
