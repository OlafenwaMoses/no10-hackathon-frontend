import styled from "@emotion/styled";
import { useRef } from "react";
import {
  ISSUE_CATEGORIES,
  ISSUE_CATEGORY_LABELS,
  RESOLVED_VALUES,
  SUCCESS_CATEGORIES,
  SUCCESS_CATEGORY_LABELS,
  type IssueCategory,
} from "@api-types";
import SelectMenu from "../SelectMenu";
import TextInput from "../TextInput";
import TextArea from "../UI/TextArea";
import Checkbox from "../UI/Checkbox";
import { FormField, FormGrid, FormHint, FormLabel, FormSection, FormSectionTitle } from "./accountFormStyles";
import { RESOLVED_LABELS } from "../../lib/labels";
import emptyToNull from "../../lib/shortlist/emptyToNull";
import parseEnum from "../../lib/parseEnum";
import type { AccountDraft } from "../../lib/shortlist/toAccountDraft";

const NONE = "none";

const RESOLVED_OPTIONS = [
  { id: NONE, name: "Not set" },
  ...RESOLVED_VALUES.map((id) => ({ id, name: RESOLVED_LABELS[id] })),
];
const SUCCESS_OPTIONS = [
  { id: NONE, name: "Not converted" },
  ...SUCCESS_CATEGORIES.map((id) => ({ id, name: SUCCESS_CATEGORY_LABELS[id] })),
];

type AccountClosureSectionProps = {
  draft: AccountDraft;
  onChange: (patch: Partial<AccountDraft>) => void;
};

function AccountClosureSection({ draft, onChange }: AccountClosureSectionProps) {
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const solutionRef = useRef<HTMLTextAreaElement>(null);
  const outcomeRef = useRef<HTMLTextAreaElement>(null);

  const toggleCategory = (category: IssueCategory, checked: boolean) =>
    onChange({
      issueCategories: checked
        ? ISSUE_CATEGORIES.filter((item) => item === category || draft.issueCategories.includes(item))
        : draft.issueCategories.filter((item) => item !== category),
    });

  return (
    <FormSection>
      <FormSectionTitle>Closure</FormSectionTitle>
      <FormGrid>
        <FormField>
          <FormLabel htmlFor="account-closed-at">Date closed</FormLabel>
          <TextInput
            id="account-closed-at"
            type="date"
            value={draft.closedAt ?? ""}
            onChange={(event) => onChange({ closedAt: event.target.value || null })}
          />
          {!draft.closedAt && <FormHint>Defaults to today when saved</FormHint>}
        </FormField>
        <FormField>
          <FormLabel>Was the issue resolved?</FormLabel>
          <SelectMenu
            value={draft.resolved ?? NONE}
            onChange={(value) => onChange({ resolved: parseEnum(RESOLVED_VALUES, value) ?? null })}
            options={RESOLVED_OPTIONS}
          />
        </FormField>
        <FormField>
          <FormLabel>Success category</FormLabel>
          <SelectMenu
            value={draft.successCategory ?? NONE}
            onChange={(value) => onChange({ successCategory: parseEnum(SUCCESS_CATEGORIES, value) ?? null })}
            options={SUCCESS_OPTIONS}
          />
        </FormField>
        <FormField data-span="full">
          <FormLabel>Category of issue raised</FormLabel>
          <Chips>
            {ISSUE_CATEGORIES.map((category) => {
              const checked = draft.issueCategories.includes(category);
              return (
                <Chip
                  key={category}
                  data-on={checked}
                  onClick={() => toggleCategory(category, !checked)}
                >
                  <Checkbox
                    checked={checked}
                    label={ISSUE_CATEGORY_LABELS[category]}
                    onChange={(next) => toggleCategory(category, next)}
                  />
                  {ISSUE_CATEGORY_LABELS[category]}
                </Chip>
              );
            })}
          </Chips>
        </FormField>
        <FormField data-span="full">
          <FormLabel htmlFor="account-issue-details">Details</FormLabel>
          <TextArea
            id="account-issue-details"
            ref={detailsRef}
            value={draft.issueDetails ?? ""}
            onChange={(value) => onChange({ issueDetails: emptyToNull(value) })}
            minHeight={60}
            maxHeight={180}
            fontSize={13}
            placeholder="The issue they faced and which areas of HMG it relates to"
          />
        </FormField>
        <FormField data-span="full">
          <FormLabel htmlFor="account-solution">Solution offered</FormLabel>
          <TextArea
            id="account-solution"
            ref={solutionRef}
            value={draft.solutionOffered ?? ""}
            onChange={(value) => onChange({ solutionOffered: emptyToNull(value) })}
            minHeight={60}
            maxHeight={180}
            fontSize={13}
            placeholder="What the account management function provided, and which OGDs were involved"
          />
        </FormField>
        <FormField data-span="full">
          <FormLabel htmlFor="account-outcome">Overall outcome</FormLabel>
          <TextArea
            id="account-outcome"
            ref={outcomeRef}
            value={draft.outcome ?? ""}
            onChange={(value) => onChange({ outcome: emptyToNull(value) })}
            minHeight={60}
            maxHeight={180}
            fontSize={13}
            placeholder="Did they relocate to the UK or increase their presence here?"
          />
        </FormField>
      </FormGrid>
    </FormSection>
  );
}

export default AccountClosureSection;

const Chips = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
});

const Chip = styled.div(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  height: 30,
  padding: "0 10px 0 8px",
  borderRadius: 4,
  border: `1px solid ${theme.border100}`,
  backgroundColor: theme.surface00,
  fontSize: 12,
  color: theme.textSecondary,
  cursor: "pointer",
  userSelect: "none",
  transition: "border-color 150ms ease, color 150ms ease",
  "&[data-on='true']": {
    borderColor: theme.border200,
    color: theme.textPrimary,
  },
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: theme.surface50 },
  },
}));
