import { emptyValues, FIELDS, HONEYPOT_FIELD, type FormValues } from "./fields";

type Body = Record<string, string | File | (string | File)[]>;

const firstString = (value: Body[string] | undefined) => {
  const item = Array.isArray(value) ? value[0] : value;
  return typeof item === "string" ? item.trim() : "";
};

export const readForm = (body: Body) => {
  const values: FormValues = emptyValues();
  for (const field of FIELDS) values[field] = firstString(body[field]);
  return { values, isBot: firstString(body[HONEYPOT_FIELD]) !== "" };
};
