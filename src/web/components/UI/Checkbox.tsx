import styled from "@emotion/styled";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";

type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

function Checkbox({ checked, indeterminate, disabled, onChange, label }: CheckboxProps) {
  const state = indeterminate ? "mixed" : checked;
  return (
    <Box
      type="button"
      role="checkbox"
      aria-checked={state}
      aria-label={label}
      data-on={checked || !!indeterminate}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
    >
      {indeterminate ? (
        <MinusIcon size={11} weight="bold" />
      ) : (
        checked && <CheckIcon size={11} weight="bold" />
      )}
    </Box>
  );
}

export default Checkbox;

const Box = styled.button(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 16,
  height: 16,
  padding: 0,
  borderRadius: 4,
  border: `1px solid ${theme.border200}`,
  backgroundColor: theme.surface00,
  color: theme.textOnPrimary,
  cursor: "pointer",
  transition: "background-color 150ms ease, border-color 150ms ease",
  "&[data-on='true']": {
    backgroundColor: theme.fillPrimary,
    borderColor: theme.fillPrimary,
  },
  "&:focus-visible": {
    outline: "none",
    boxShadow: theme.focusRing,
  },
  "&:disabled": {
    opacity: 0.4,
    cursor: "not-allowed",
  },
}));
