import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./helpers";
import type { SearchCategoryChoice, SearchKind, SearchSectorChoice, SearchStatus } from "../../types";

export const searches = pgTable("searches", {
  id,
  name: text().notNull(),
  kind: text().$type<SearchKind>().notNull().default("search"),
  category: text().$type<SearchCategoryChoice>().notNull(),
  sector: text().$type<SearchSectorChoice>().notNull(),
  region: text(),
  query: text().notNull(),
  numResults: integer().notNull().default(10),
  status: text().$type<SearchStatus>().notNull().default("queued"),
  workflowId: text(),
  error: text(),
  createdAt,
  updatedAt,
});
