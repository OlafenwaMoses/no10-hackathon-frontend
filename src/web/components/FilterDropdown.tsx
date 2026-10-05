import styled from "@emotion/styled";
import { CaretDownIcon } from "@phosphor-icons/react";
import Dropdown from "./UI/Dropdown";
import SelectMenuRow from "./SelectMenuRow";
import { GhostToolbarTrigger } from "./UI/ToolbarStyles";

const ALL = "__all__";

type FilterDropdownProps<T extends string> = {
  label: string;
  allLabel: string;
  value: T | undefined;
  options: { value: T; label: string }[];
  onChange: (value: T | undefined) => void;
};

function FilterDropdown<T extends string>({
  label,
  allLabel,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  const selected = options.find((option) => option.value === value);

  return (
    <Dropdown
      width={220}
      radioValue={value ?? ALL}
      onRadioValueChange={(next) => {
        const match = options.find((option) => option.value === next);
        onChange(match?.value);
      }}
      items={[
        { kind: "radio", value: ALL, node: <SelectMenuRow>{allLabel}</SelectMenuRow> },
        { kind: "separator" },
        ...options.map((option) => ({
          kind: "radio" as const,
          value: option.value,
          node: <SelectMenuRow>{option.label}</SelectMenuRow>,
        })),
      ]}
    >
      <GhostToolbarTrigger type="button" data-active={selected ? true : undefined} aria-label={label}>
        <TriggerLabel>{label}</TriggerLabel>
        {selected && <TriggerValue>{selected.label}</TriggerValue>}
        <CaretDownIcon size={12} />
      </GhostToolbarTrigger>
    </Dropdown>
  );
}

export default FilterDropdown;

const TriggerLabel = styled.span({});

const TriggerValue = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  height: 20,
  padding: "0 7px",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 500,
  color: theme.textPrimary,
  backgroundColor: theme.selectedBg,
}));
