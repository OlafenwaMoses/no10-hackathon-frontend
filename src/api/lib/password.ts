import { createMiddleware } from "hono/factory";

export const withPassword = createMiddleware<{ Bindings: CloudflareBindings }>(async (c, next) => {
  const expected = c.env.APP_PASSWORD;
  if (expected && c.req.header("x-app-password") !== expected) {
    return c.json({ error: "Unauthorised" }, 401);
  }
  await next();
});
