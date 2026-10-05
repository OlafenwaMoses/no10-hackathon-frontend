import {
  BACKGROUND_CHECKS,
  BACKGROUND_CHECK_LABELS,
  RAG_VALUES,
  SHORTLIST_STAGES,
  SHORTLIST_STAGE_LABELS,
  SUPPORT_LEVELS,
  SUPPORT_LEVEL_LABELS,
} from "@api-types";
import SelectMenu from "../SelectMenu";
import TextInput from "../TextInput";
import { FormField, FormGrid, FormLabel, FormSection, FormSectionTitle } from "./accountFormStyles";
import { RAG_LABELS } from "../../lib/labels";
import parseEnum from "../../lib/parseEnum";
import type { AccountDraft } from "../../lib/shortlist/toAccountDraft";

const NONE = "none";

const STAGE_OPTIONS = SHORTLIST_STAGES.map((id) => ({ id, name: SHORTLIST_STAGE_LABELS[id] }));
const RAG_OPTIONS = [{ id: NONE, name: "Not set" }, ...RAG_VALUES.map((id) => ({ id, name: RAG_LABELS[id] }))];
const SUPPORT_OPTIONS = [
  { id: NONE, name: "Not set" },
  ...SUPPORT_LEVELS.map((id) => ({ id, name: SUPPORT_LEVEL_LABELS[id] })),
];
const BACKGROUND_OPTIONS = BACKGROUND_CHECKS.map((id) => ({ id, name: BACKGROUND_CHECK_LABELS[id] }));

type AccountPipelineSectionProps = {
  draft: AccountDraft;
  onChange: (patch: Partial<AccountDraft>) => void;
};

function AccountPipelineSection({ draft, onChange }: AccountPipelineSectionProps) {
  return (
    <FormSection>
      <FormSectionTitle>Pipeline</FormSectionTitle>
      <FormGrid>
        <FormField>
          <FormLabel>Stage</FormLabel>
          <SelectMenu
            value={draft.stage}
            onChange={(value) => onChange({ stage: parseEnum(SHORTLIST_STAGES, value) ?? draft.stage })}
            options={STAGE_OPTIONS}
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="account-priority">Priority</FormLabel>
          <TextInput
            id="account-priority"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            placeholder="e.g. 1"
            value={draft.priority ?? ""}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              onChange({ priority: Number.isFinite(parsed) ? parsed : null });
            }}
          />
        </FormField>
        <FormField>
          <FormLabel>Background check</FormLabel>
          <SelectMenu
            value={draft.backgroundCheck}
            onChange={(value) =>
              onChange({ backgroundCheck: parseEnum(BACKGROUND_CHECKS, value) ?? draft.backgroundCheck })
            }
            options={BACKGROUND_OPTIONS}
          />
        </FormField>
        <FormField>
          <FormLabel>Likelihood of success (RAG)</FormLabel>
          <SelectMenu
            value={draft.successRag ?? NONE}
            onChange={(value) => onChange({ successRag: parseEnum(RAG_VALUES, value) ?? null })}
            options={RAG_OPTIONS}
          />
        </FormField>
        <FormField>
          <FormLabel>Strength of relationship (RAG)</FormLabel>
          <SelectMenu
            value={draft.relationshipRag ?? NONE}
            onChange={(value) => onChange({ relationshipRag: parseEnum(RAG_VALUES, value) ?? null })}
            options={RAG_OPTIONS}
          />
        </FormField>
        <FormField>
          <FormLabel>Support level</FormLabel>
          <SelectMenu
            value={draft.supportLevel ?? NONE}
            onChange={(value) => onChange({ supportLevel: parseEnum(SUPPORT_LEVELS, value) ?? null })}
            options={SUPPORT_OPTIONS}
          />
        </FormField>
      </FormGrid>
    </FormSection>
  );
}

export default AccountPipelineSection;
