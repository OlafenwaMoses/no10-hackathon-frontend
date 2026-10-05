import { createMiddleware } from "hono/factory";
import type { Bindings } from "../env";
import { createDb, type Database } from "./db-client";

export type { Database } from "./db-client";

type DbEnv = {
  Bindings: Bindings;
  Variables: { db: Database };
};

export const withDb = createMiddleware<DbEnv>(async (c, next) => {
  const { db, close } = createDb(c.env.DATABASE_URL);
  c.set("db", db);
  try {
    await next();
  } finally {
    c.executionCtx.waitUntil(close());
  }
});
