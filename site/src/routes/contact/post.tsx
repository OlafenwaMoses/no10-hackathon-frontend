import type { Context } from "hono";
import { buildPayload } from "../../contact/build-payload";
import { readForm } from "../../contact/read-form";
import { sendToTalentDatabase } from "../../contact/send-to-talent-database";
import { validate } from "../../contact/validate";
import type { AppEnv } from "../../env";
import { ContactPage } from "../../pages/ContactPage";

const CONFIRMATION = "/get-in-touch/confirmation";

export const postContact = async (c: Context<AppEnv>) => {
  const { values, isBot } = readForm(await c.req.parseBody());
  if (isBot) return c.redirect(CONFIRMATION, 303);

  const errors = validate(values);
  if (Object.keys(errors).length > 0) return c.html(<ContactPage values={values} errors={errors} />, 400);

  const sent = await sendToTalentDatabase(c.env, buildPayload(values));
  if (!sent) return c.html(<ContactPage values={values} errors={{}} submitError />, 502);

  return c.redirect(CONFIRMATION, 303);
};
