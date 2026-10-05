import type { Context } from "hono";
import { findPersona } from "../content/personas";
import type { AppEnv } from "../env";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PersonaPage } from "../pages/routes/PersonaPage";

export const getPersona = (c: Context<AppEnv>) => {
  const persona = findPersona(c.req.param("persona") ?? "");
  if (!persona) return c.html(<NotFoundPage path={c.req.path} />, 404);
  return c.html(<PersonaPage persona={persona} path={c.req.path} />);
};
