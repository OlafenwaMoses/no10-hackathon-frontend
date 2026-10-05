import type { FormValues } from "./fields";
import type { InboundPayload } from "./inbound-payload";
import { normaliseUrl } from "./normalise-url";
import { INTENTS } from "./options";

const optional = (value: string) => (value === "" ? undefined : value);

export const buildPayload = (values: FormValues): InboundPayload => ({
  name: values.name,
  email: values.email,
  phone: optional(values.phone),
  organisation: optional(values.organisation),
  role: optional(values.role),
  profileUrl: values.profileUrl ? (normaliseUrl(values.profileUrl) ?? undefined) : undefined,
  country: optional(values.country),
  category: optional(values.category),
  sector: optional(values.sector),
  intent: INTENTS.find((intent) => intent.value === values.intent)?.value,
  timeline: optional(values.timeline),
  message: optional(values.message),
});
