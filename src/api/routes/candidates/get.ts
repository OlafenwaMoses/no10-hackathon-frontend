import type { Context } from "hono";
import { asc, eq } from "drizzle-orm";
import { candidates, interviewAnswers, searches, shortlistEntries } from "../../db/schema";
import { toCandidateListItem } from "../../lib/candidate-list-item";
import type { CandidateDetail } from "../../types";
import type { AppEnv } from "../../index";

export async function get(c: Context<AppEnv, "/:candidateId">) {
  const { db } = c.var;
  const candidateId = c.req.param("candidateId");

  const [row] = await db
    .select({ candidate: candidates, searchName: searches.name, shortlist: shortlistEntries })
    .from(candidates)
    .leftJoin(searches, eq(searches.id, candidates.searchId))
    .leftJoin(shortlistEntries, eq(shortlistEntries.candidateId, candidates.id))
    .where(eq(candidates.id, candidateId));
  if (!row) return c.json({ error: "Candidate not found" }, 404);

  const answers = await db
    .select()
    .from(interviewAnswers)
    .where(eq(interviewAnswers.candidateId, candidateId))
    .orderBy(asc(interviewAnswers.createdAt));

  const { candidate } = row;
  const detail: CandidateDetail = {
    ...toCandidateListItem(candidate, row.shortlist?.stage ?? null),
    shortlist: row.shortlist,
    searchId: candidate.searchId,
    searchName: row.searchName,
    entity: candidate.entity,
    highlights: candidate.highlights,
    notes: candidate.notes,
    linkedinProfile: candidate.linkedinProfile,
    resolution: candidate.resolution,
    profileText: candidate.profileText,
    ukLinks: candidate.ukLinks,
    persona: candidate.persona,
    classification: candidate.classification,
    netWorth: candidate.netWorth,
    contact: candidate.contact,
    outreachNote: candidate.outreachNote,
    contactedAt: candidate.contactedAt,
    score: candidate.score,
    error: candidate.error,
    answers: answers.map((a) => ({
      id: a.id,
      questionKey: a.questionKey,
      question: a.question,
      type: a.type,
      options: a.options,
      probs: a.probs,
      reasoning: a.reasoning,
      response: a.response,
      expected: a.expected,
    })),
  };

  return c.json(detail);
}
