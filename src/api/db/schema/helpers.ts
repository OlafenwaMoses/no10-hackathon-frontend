import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid()
  .default(sql`gen_random_uuid()`)
  .primaryKey()
  .notNull();

export const createdAt = timestamp({
  withTimezone: true,
  mode: "string",
})
  .defaultNow()
  .notNull();

export const updatedAt = timestamp({
  withTimezone: true,
  mode: "string",
})
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date().toISOString());
