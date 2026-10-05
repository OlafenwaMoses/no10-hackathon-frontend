import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { searches } from "../../db/schema";
import { isOneOf } from "../../lib/is-one-of";
import { buildSearchQueries, resolveSearchRegion, searchName } from "../../pipeline/queries";
import { ALL, SEARCH_REGIONS, SEARCH_SECTORS, TALENT_CATEGORIES, type CreateSearchBody, type SearchListItem } from "../../types";
import type { AppEnv } from "../../index";

export async function create(c: Context<AppEnv>) {
  const { db } = c.var;
  const body = await c.req.json<CreateSearchBody>();

  if (body.category !== ALL && !isOneOf(TALENT_CATEGORIES, body.category)) return c.json({ error: "Invalid category" }, 400);
  if (body.sector !== ALL && !isOneOf(SEARCH_SECTORS, body.sector)) return c.json({ error: "Invalid sector" }, 400);

  if (body.region && !isOneOf(SEARCH_REGIONS, body.region)) return c.json({ error: "Invalid region" }, 400);
  const region = resolveSearchRegion(body.region, body.customRegion);
  const numResults = Math.min(Math.max(Math.round(body.numResults ?? 10), 1), 100);
  const query = body.query?.trim() || buildSearchQueries(body.category, body.sector, region?.phrase).join("\n");

  const [search] = await db
    .insert(searches)
    .values({
      name: searchName(body.category, body.sector, region?.label),
      category: body.category,
      sector: body.sector,
      region: region?.label ?? null,
      query,
      numResults,
    })
    .returning();

  const instance = await c.env.SEARCH_WORKFLOW.create({
    id: `search-${search.id}`,
    params: { searchId: search.id },
  });
  await db.update(searches).set({ workflowId: instance.id }).where(eq(searches.id, search.id));

  const item: SearchListItem = {
    id: search.id,
    name: search.name,
    kind: search.kind,
    category: search.category,
    sector: search.sector,
    region: search.region,
    query: search.query,
    numResults: search.numResults,
    status: search.status,
    error: search.error,
    candidateCount: 0,
    scoredCount: 0,
    createdAt: search.createdAt,
  };
  return c.json(item, 201);
}
