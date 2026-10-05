import type { ShortlistEntry, UpdateShortlistBody } from "@api-types";
import type { AccountDraft } from "./toAccountDraft";

function normalise(value: AccountDraft[keyof AccountDraft]) {
  if (Array.isArray(value)) return [...value].sort().join("|");
  if (typeof value === "string") return value.trim() || null;
  return value;
}

export default function diffAccountDraft(entry: ShortlistEntry, draft: AccountDraft): UpdateShortlistBody {
  const patch: UpdateShortlistBody = {};
  for (const key of Object.keys(draft) as (keyof AccountDraft)[]) {
    if (normalise(draft[key]) !== normalise(entry[key])) Object.assign(patch, { [key]: draft[key] });
  }
  return patch;
}
