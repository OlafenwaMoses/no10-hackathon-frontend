import { createMiddleware } from "hono/factory";
import type { Bindings } from "../env";

export const withPassword = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  const expected = c.env.APP_PASSWORD;
  if (c.req.path.startsWith("/api/inbound")) return next();
  if (expected && c.req.header("x-app-password") !== expected) {
    return c.json({ error: "Unauthorised" }, 401);
  }
  await next();
});
