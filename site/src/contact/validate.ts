import { FIELDS, type FieldErrors, type FormValues } from "./fields";
import { normaliseUrl } from "./normalise-url";
import { CATEGORIES, INTENTS, SECTORS, TIMELINES } from "./options";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+()\-\s.]{6,30}$/;

const oneOf = (list: readonly string[], value: string) => value === "" || list.includes(value);

const tooLong = (value: string, max: number) => value.length > max;

export const validate = (values: FormValues): FieldErrors => {
  const errors: FieldErrors = {};
  if (!values.name) errors.name = "Enter your full name";
  else if (tooLong(values.name, 200)) errors.name = "Full name must be 200 characters or fewer";

  if (!values.email) errors.email = "Enter your email address";
  else if (!EMAIL.test(values.email) || tooLong(values.email, 254)) {
    errors.email = "Enter an email address in the correct format, like name@example.com";
  }

  if (values.phone && !PHONE.test(values.phone)) {
    errors.phone = "Enter a telephone number, like 020 7946 0000 or +44 20 7946 0000";
  }
  if (tooLong(values.organisation, 200)) errors.organisation = "Organisation must be 200 characters or fewer";
  if (tooLong(values.role, 200)) errors.role = "Role must be 200 characters or fewer";
  if (values.profileUrl && (tooLong(values.profileUrl, 500) || !normaliseUrl(values.profileUrl))) {
    errors.profileUrl = "Enter a web address in the correct format, like https://www.linkedin.com/in/your-name";
  }
  if (tooLong(values.country, 100)) errors.country = "Country must be 100 characters or fewer";
  if (!oneOf(CATEGORIES, values.category)) errors.category = "Select what best describes you";
  if (!oneOf(SECTORS, values.sector)) errors.sector = "Select your sector";
  if (!oneOf(INTENTS.map((intent) => intent.value), values.intent)) errors.intent = "Select what you are looking to do";
  if (!oneOf(TIMELINES, values.timeline)) errors.timeline = "Select your timeline";
  if (tooLong(values.message, 2000)) errors.message = "Message must be 2,000 characters or fewer";
  if (values.consent !== "yes") {
    errors.consent = "Confirm that you agree to the Global Talent Taskforce contacting you and storing your details";
  }

  return Object.fromEntries(FIELDS.filter((field) => errors[field]).map((field) => [field, errors[field]]));
};
