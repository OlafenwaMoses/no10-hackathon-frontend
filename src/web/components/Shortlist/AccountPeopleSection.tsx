import TextInput from "../TextInput";
import { FormField, FormGrid, FormLabel, FormSection, FormSectionTitle } from "./accountFormStyles";
import emptyToNull from "../../lib/shortlist/emptyToNull";
import type { AccountDraft } from "../../lib/shortlist/toAccountDraft";

type AccountPeopleSectionProps = {
  draft: AccountDraft;
  onChange: (patch: Partial<AccountDraft>) => void;
  accountManagers: string[];
  relationshipHolders: string[];
};

function AccountPeopleSection({ draft, onChange, accountManagers, relationshipHolders }: AccountPeopleSectionProps) {
  return (
    <FormSection>
      <FormSectionTitle>People</FormSectionTitle>
      <FormGrid>
        <FormField>
          <FormLabel htmlFor="account-manager">GTT account manager</FormLabel>
          <TextInput
            id="account-manager"
            list="account-manager-options"
            autoComplete="off"
            placeholder="Who owns this account"
            value={draft.accountManager ?? ""}
            onChange={(event) => onChange({ accountManager: emptyToNull(event.target.value) })}
          />
          <datalist id="account-manager-options">
            {accountManagers.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </FormField>
        <FormField data-span="2">
          <FormLabel htmlFor="relationship-holder">Relationship holder</FormLabel>
          <TextInput
            id="relationship-holder"
            list="relationship-holder-options"
            autoComplete="off"
            placeholder="Who in HMG knows them, e.g. DSIT, No10, a named official"
            value={draft.relationshipHolder ?? ""}
            onChange={(event) => onChange({ relationshipHolder: emptyToNull(event.target.value) })}
          />
          <datalist id="relationship-holder-options">
            {relationshipHolders.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </FormField>
      </FormGrid>
    </FormSection>
  );
}

export default AccountPeopleSection;
