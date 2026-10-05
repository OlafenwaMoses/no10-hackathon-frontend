import styled from "@emotion/styled";
import Dropdown from "./UI/Dropdown";
import SelectMenuRow from "./SelectMenuRow";
import { selectStyle } from "./SelectStyles";

type SelectMenuOption = {
  id: string;
  name: string;
};

type OptionGroup = {
  label: string;
  items: SelectMenuOption[];
};

type SelectMenuProps = {
  value: string | undefined;
  onChange: (id: string) => void;
  options?: SelectMenuOption[];
  groups?: OptionGroup[];
  placeholder?: string;
  disabled?: boolean;
};

function SelectMenu({ value, onChange, options, groups, placeholder, disabled }: SelectMenuProps) {
  const flatOptions = groups ? groups.flatMap((g) => g.items) : (options ?? []);
  const selectedName = flatOptions.find((o) => o.id === value)?.name ?? flatOptions[0]?.name;

  const renderRow = (option: SelectMenuOption, indented: boolean) => ({
    kind: "radio" as const,
    value: option.id,
    node: <SelectMenuRow data-indented={indented}>{option.name}</SelectMenuRow>,
  });

  const items = groups
    ? groups.flatMap((group) => [
        ...(group.label
          ? [{ kind: "static" as const, node: <SelectGroupLabel>{group.label}</SelectGroupLabel> }]
          : []),
        ...group.items.map((item) => renderRow(item, !!group.label)),
      ])
    : (options ?? []).map((option) => renderRow(option, false));

  return (
    <Dropdown
      items={items}
      width="var(--radix-dropdown-menu-trigger-width)"
      scrollFade
      radioValue={value}
      onRadioValueChange={onChange}
    >
      <SelectTriggerButton type="button" disabled={disabled}>
        <SelectTriggerLabel data-placeholder={!selectedName}>
          {selectedName ?? placeholder ?? ""}
        </SelectTriggerLabel>
      </SelectTriggerButton>
    </Dropdown>
  );
}

export default SelectMenu;

const SelectTriggerButton = styled.button(({ theme }) => ({
  ...selectStyle(theme),
  display: "flex",
  alignItems: "center",
  textAlign: "left",
  cursor: "pointer",
}));

const SelectTriggerLabel = styled.span(({ theme }) => ({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",

  "&[data-placeholder='true']": {
    color: theme.textTertiary,
  },
}));

const SelectGroupLabel = styled.div(({ theme }) => ({
  flexShrink: 0,
  padding: "8px 8px 2px",
  color: theme.textTertiary,
  fontSize: 12,
  fontWeight: 600,
  cursor: "default",
}));
