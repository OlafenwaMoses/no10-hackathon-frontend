import { pgTable, text, real, jsonb, uuid, foreignKey, unique } from "drizzle-orm/pg-core";
import { createdAt, id } from "./helpers";
import { candidates } from "./candidates";
import type { InterviewQuestionType } from "../../types";

export const interviewAnswers = pgTable(
  "interview_answers",
  {
    id,
    candidateId: uuid().notNull(),
    questionKey: text().notNull(),
    question: text().notNull(),
    type: text().$type<InterviewQuestionType>().notNull(),
    options: text().array().notNull().default([]),
    probs: jsonb().$type<number[]>().notNull().default([]),
    reasoning: text(),
    response: text(),
    expected: real(),
    createdAt,
  },
  (table) => [
    foreignKey({
      columns: [table.candidateId],
      foreignColumns: [candidates.id],
      name: "interview_answers_candidate_id_fkey",
    }).onDelete("cascade"),
    unique("interview_answers_candidate_question_key").on(table.candidateId, table.questionKey),
  ],
);
