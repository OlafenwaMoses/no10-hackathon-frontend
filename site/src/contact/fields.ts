export const FIELDS = [
  "name",
  "email",
  "phone",
  "organisation",
  "role",
  "profileUrl",
  "country",
  "category",
  "sector",
  "intent",
  "timeline",
  "message",
  "consent",
] as const;

export type FieldName = (typeof FIELDS)[number];

export type FormValues = Record<FieldName, string>;

export type FieldErrors = Partial<Record<FieldName, string>>;

export const HONEYPOT_FIELD = "nickname";

export const emptyValues = (): FormValues =>
  Object.fromEntries(FIELDS.map((field) => [field, ""])) as FormValues;
