import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";

export function createDb(connectionString: string) {
  const client = postgres(connectionString, { prepare: false, max: 5 });
  const db = drizzle(client, { schema, casing: "snake_case" });
  return { db, close: () => client.end({ timeout: 5 }) };
}

export type Database = ReturnType<typeof createDb>["db"];

export async function withDatabase<T>(connectionString: string, fn: (db: Database) => Promise<T>): Promise<T> {
  const { db, close } = createDb(connectionString);
  try {
    return await fn(db);
  } finally {
    await close();
  }
}
