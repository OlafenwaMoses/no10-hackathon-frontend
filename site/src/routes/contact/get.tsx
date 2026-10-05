import type { Context } from "hono";
import { emptyValues } from "../../contact/fields";
import { CATEGORIES } from "../../contact/options";
import type { AppEnv } from "../../env";
import { ContactPage } from "../../pages/ContactPage";

export const getContact = (c: Context<AppEnv>) => {
  const values = emptyValues();
  const category = c.req.query("category") ?? "";
  if (CATEGORIES.some((item) => item === category)) values.category = category;
  return c.html(<ContactPage values={values} errors={{}} />);
};
