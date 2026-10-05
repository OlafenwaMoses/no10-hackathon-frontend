import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import Dropdown from "../UI/Dropdown";
import SelectMenuRow from "../SelectMenuRow";

const NONE = "__none__";

type InlineSelectProps<T extends string> = {
  label: string;
  value: T | null;
  options: { value: T; label: ReactNode }[];
  onChange: (value: T | null) => void;
  noneLabel?: string;
  width?: number;
  children: ReactNode;
};

function InlineSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  noneLabel,
  width = 200,
  children,
}: InlineSelectProps<T>) {
  return (
    <Stop
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Dropdown
        width={width}
        maxHeight={320}
        radioValue={value ?? NONE}
        onRadioValueChange={(next) => {
          if (next === NONE) {
            onChange(null);
            return;
          }
          const match = options.find((option) => option.value === next);
          if (match && match.value !== value) onChange(match.value);
        }}
        items={[
          ...(noneLabel
            ? [
                { kind: "radio" as const, value: NONE, node: <SelectMenuRow>{noneLabel}</SelectMenuRow> },
                { kind: "separator" as const },
              ]
            : []),
          ...options.map((option) => ({
            kind: "radio" as const,
            value: option.value,
            node: <SelectMenuRow>{option.label}</SelectMenuRow>,
          })),
        ]}
      >
        <Trigger type="button" aria-label={label}>
          <Content>{children}</Content>
          <Caret aria-hidden>
            <CaretDownIcon size={11} />
          </Caret>
        </Trigger>
      </Dropdown>
    </Stop>
  );
}

export default InlineSelect;

const Stop = styled.span({
  display: "inline-flex",
  maxWidth: "100%",
  minWidth: 0,
});

const Trigger = styled.button(({ theme }) => ({
  all: "unset",
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  maxWidth: "100%",
  minWidth: 0,
  height: 28,
  margin: "0 -6px",
  padding: "0 4px 0 6px",
  borderRadius: 4,
  cursor: "pointer",
  transition: "background-color 150ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": { backgroundColor: theme.transparentHover },
    "&:hover > span:last-of-type": { opacity: 1 },
  },
  "&[data-state='open']": { backgroundColor: theme.transparentActive },
  "&[data-state='open'] > span:last-of-type": { opacity: 1 },
  "&:focus-visible": { boxShadow: theme.focusRing },
}));

const Content = styled.span({
  display: "inline-flex",
  alignItems: "center",
  minWidth: 0,
  overflow: "hidden",
});

const Caret = styled.span(({ theme }) => ({
  display: "inline-flex",
  flexShrink: 0,
  color: theme.textTertiary,
  opacity: 0,
  transition: "opacity 150ms ease",
}));
