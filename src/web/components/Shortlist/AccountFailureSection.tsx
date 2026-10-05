import { useRef } from "react";
import TextArea from "../UI/TextArea";
import { FormField, FormLabel, FormSection, FormSectionTitle } from "./accountFormStyles";
import emptyToNull from "../../lib/shortlist/emptyToNull";
import type { AccountDraft } from "../../lib/shortlist/toAccountDraft";

type AccountFailureSectionProps = {
  draft: AccountDraft;
  onChange: (patch: Partial<AccountDraft>) => void;
};

function AccountFailureSection({ draft, onChange }: AccountFailureSectionProps) {
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  return (
    <FormSection>
      <FormSectionTitle>Failure</FormSectionTitle>
      <FormField>
        <FormLabel htmlFor="account-failure-reason">Reason for failure</FormLabel>
        <TextArea
          id="account-failure-reason"
          ref={reasonRef}
          value={draft.failureReason ?? ""}
          onChange={(value) => onChange({ failureReason: emptyToNull(value) })}
          minHeight={60}
          maxHeight={180}
          fontSize={13}
          placeholder="e.g. Not GTT-level seniority, high reputational risk"
        />
      </FormField>
    </FormSection>
  );
}

export default AccountFailureSection;
