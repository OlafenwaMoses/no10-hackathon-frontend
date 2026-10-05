import { pgTable, text, uuid, foreignKey, index } from "drizzle-orm/pg-core";
import { createdAt, id } from "./helpers";
import { candidates } from "./candidates";

export const personaMessages = pgTable(
  "persona_messages",
  {
    id,
    candidateId: uuid().notNull(),
    role: text().$type<"user" | "model">().notNull(),
    content: text().notNull(),
    createdAt,
  },
  (table) => [
    foreignKey({
      columns: [table.candidateId],
      foreignColumns: [candidates.id],
      name: "persona_messages_candidate_id_fkey",
    }).onDelete("cascade"),
    index("persona_messages_candidate_id_idx").on(table.candidateId),
  ],
);
