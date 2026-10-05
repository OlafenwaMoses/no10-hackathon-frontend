import { useRef } from "react";
import { LEAD_SOURCES, LEAD_SOURCE_LABELS } from "@api-types";
import SelectMenu from "../SelectMenu";
import TextInput from "../TextInput";
import TextArea from "../UI/TextArea";
import { FormField, FormGrid, FormLabel, FormSection, FormSectionTitle } from "./accountFormStyles";
import emptyToNull from "../../lib/shortlist/emptyToNull";
import parseEnum from "../../lib/parseEnum";
import type { AccountDraft } from "../../lib/shortlist/toAccountDraft";

const SOURCE_OPTIONS = LEAD_SOURCES.map((id) => ({ id, name: LEAD_SOURCE_LABELS[id] }));

type AccountLeadSectionProps = {
  draft: AccountDraft;
  onChange: (patch: Partial<AccountDraft>) => void;
};

function AccountLeadSection({ draft, onChange }: AccountLeadSectionProps) {
  const nextStepRef = useRef<HTMLTextAreaElement>(null);

  return (
    <FormSection>
      <FormSectionTitle>Lead</FormSectionTitle>
      <FormGrid>
        <FormField>
          <FormLabel>Source of lead</FormLabel>
          <SelectMenu
            value={draft.leadSource}
            onChange={(value) => onChange({ leadSource: parseEnum(LEAD_SOURCES, value) ?? draft.leadSource })}
            options={SOURCE_OPTIONS}
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="account-origin-date">Origin date</FormLabel>
          <TextInput
            id="account-origin-date"
            type="date"
            value={draft.originDate}
            onChange={(event) => {
              if (event.target.value) onChange({ originDate: event.target.value });
            }}
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="account-data-hub">Link to Data Hub</FormLabel>
          <TextInput
            id="account-data-hub"
            inputMode="url"
            placeholder="https://…"
            value={draft.dataHubLink ?? ""}
            onChange={(event) => onChange({ dataHubLink: emptyToNull(event.target.value) })}
          />
        </FormField>
        <FormField data-span="full">
          <FormLabel htmlFor="account-next-step">Next step</FormLabel>
          <TextArea
            id="account-next-step"
            ref={nextStepRef}
            value={draft.nextStep ?? ""}
            onChange={(value) => onChange({ nextStep: emptyToNull(value) })}
            minHeight={60}
            maxHeight={160}
            fontSize={13}
            placeholder="e.g. Henry to set up intro call"
          />
        </FormField>
      </FormGrid>
    </FormSection>
  );
}

export default AccountLeadSection;
