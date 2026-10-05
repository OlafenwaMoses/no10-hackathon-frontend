import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";
import { and, eq, ne } from "drizzle-orm";
import { candidates, interviewAnswers } from "../db/schema";
import { withDatabase, type Database } from "../lib/db-client";
import { enrichUkLinks } from "../pipeline/enrich";
import { interviewPersona, type InterviewAnswerRow } from "../pipeline/interview";
import { buildPersona } from "../pipeline/persona";
import { classifyCandidate } from "../pipeline/classify";
import { renderProfileText } from "../pipeline/profile-text";
import { resolveManualCandidate } from "../pipeline/resolve";
import { buildInterviewQuestions } from "../pipeline/questions";
import { errorMessage } from "../pipeline/retry";
import { scoreCandidate, ukLinkScore } from "../pipeline/score";

export type CandidateWorkflowParams = { candidateId: string };

const STEP_CONFIG = {
  retries: { limit: 3, delay: "10 seconds", backoff: "exponential" },
  timeout: "5 minutes",
} as const;

export class CandidateWorkflow extends WorkflowEntrypoint<CloudflareBindings, CandidateWorkflowParams> {
  private db<T>(fn: (db: Database) => Promise<T>) {
    return withDatabase(this.env.DATABASE_URL, fn);
  }

  async run(event: WorkflowEvent<CandidateWorkflowParams>, step: WorkflowStep) {
    const { candidateId } = event.payload;

    try {
      await step.do("resolve", STEP_CONFIG, async () => {
        const [candidate] = await this.db((db) => db.select().from(candidates).where(eq(candidates.id, candidateId)));
        if (!candidate) throw new NonRetryableError(`Candidate ${candidateId} not found`);
        if (candidate.source === "search") return false;
        if (candidate.resolution && candidate.resolution.method !== "manual_only") return false;

        await this.db((db) =>
          db.update(candidates).set({ status: "resolving", error: null }).where(eq(candidates.id, candidateId)),
        );
        const resolved = await resolveManualCandidate(this.env, candidate);
        await this.db(async (db) => {
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

      const enriched = await step.do("enrich", STEP_CONFIG, async () => {
        const candidate = await this.db(async (db) => {
          await db.update(candidates).set({ status: "enriching", error: null }).where(eq(candidates.id, candidateId));
          const [row] = await db.select().from(candidates).where(eq(candidates.id, candidateId));
          return row;
        });
        if (!candidate) throw new NonRetryableError(`Candidate ${candidateId} not found`);

        const ukLinks = await enrichUkLinks(this.env.EXA_API_KEY, candidate);
        const profileText = renderProfileText({ ...candidate, ukLinks });
        await this.db((db) =>
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

      const persona = await step.do("build persona", STEP_CONFIG, async () => {
        await this.db((db) =>
          db.update(candidates).set({ status: "building_persona" }).where(eq(candidates.id, candidateId)),
        );
        const result = await buildPersona(this.env, enriched.profileText);
        await this.db((db) => db.update(candidates).set({ persona: result }).where(eq(candidates.id, candidateId)));
        return result;
      });

      const classification = await step.do("classify", STEP_CONFIG, async () => {
        const { classification: result, netWorth } = await classifyCandidate(this.env, {
          profileText: enriched.profileText,
          persona,
          ukLinks: enriched.ukLinks,
          searchCategory: enriched.category,
          searchSector: enriched.sector,
        });
        await this.db((db) =>
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

      await step.do("start interview", STEP_CONFIG, async () => {
        await this.db(async (db) => {
          await db.update(candidates).set({ status: "interviewing" }).where(eq(candidates.id, candidateId));
          await db.delete(interviewAnswers).where(eq(interviewAnswers.candidateId, candidateId));
        });
      });

      const answers: InterviewAnswerRow[] = [];
      for (const question of buildInterviewQuestions(classification.category)) {
        const answer = await step.do(`interview ${question.key}`, STEP_CONFIG, async () => {
          const row = await interviewPersona(this.env, { id: candidateId }, persona, enriched.ukLinks, question, answers);
          await this.db((db) =>
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
        answers.push(answer);
      }

      await step.do("score", STEP_CONFIG, async () => {
        await this.db((db) => db.update(candidates).set({ status: "scoring" }).where(eq(candidates.id, candidateId)));
        const score = await scoreCandidate(this.env, enriched, persona, enriched.ukLinks, answers);
        await this.db((db) =>
          db
            .update(candidates)
            .set({
              status: "scored",
              score,
              overallScore: score.overall,
              opennessScore: score.openness,
              ukLinkScore: score.ukLinks,
            })
            .where(eq(candidates.id, candidateId)),
        );
        return score.overall;
      });
    } catch (error) {
      const message = errorMessage(error);
      await step.do("mark candidate failed", async () => {
        await this.db((db) =>
          db.update(candidates).set({ status: "failed", error: message }).where(eq(candidates.id, candidateId)),
        );
      });
    }
  }
}
