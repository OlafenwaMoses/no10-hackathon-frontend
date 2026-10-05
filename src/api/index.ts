import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Bindings } from "./env";
import { withDb, type Database } from "./lib/db";
import { withPassword } from "./lib/password";
import { withQueryParams, type QueryParamsFn } from "./lib/query-params";
import candidates from "./routes/candidates";
import searches from "./routes/searches";
import stats from "./routes/stats";
import shortlist from "./routes/shortlist";
import inbound from "./routes/inbound";

export type AppEnv = {
  Bindings: Bindings;
  Variables: {
    db: Database;
    queryParams: QueryParamsFn;
  };
};

const app = new Hono<AppEnv>().basePath("/api");

app.use("*", withPassword);
app.use("*", withDb);
app.use("*", withQueryParams);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    if (err.status >= 500) console.error(`[${c.req.method}] ${c.req.path}:`, err);
    return c.json({ error: err.message }, err.status);
  }

  console.error(`[${c.req.method}] ${c.req.path}:`, err);
  return c.json({ error: "Internal server error" }, 500);
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.get("/", (c) => c.json({ status: "ok" }));

app.route("/candidates", candidates);
app.route("/searches", searches);
app.route("/stats", stats);
app.route("/shortlist", shortlist);
app.route("/inbound", inbound);

export default app;
