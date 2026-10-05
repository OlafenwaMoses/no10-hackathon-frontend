import type { Context } from "hono";
import { desc } from "drizzle-orm";
import { searches } from "../../db/schema";
import { searchColumns } from "../../lib/search-columns";
import type { SearchListItem } from "../../types";
import type { AppEnv } from "../../index";

export async function list(c: Context<AppEnv>) {
  const { db } = c.var;

  const rows = await db.select(searchColumns).from(searches).orderBy(desc(searches.createdAt)).limit(200);

  return c.json(rows satisfies SearchListItem[]);
}
