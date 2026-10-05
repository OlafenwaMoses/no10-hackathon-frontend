import styled from "@emotion/styled";
import type { ComponentProps } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import Icon from "./UI/Icon";

function SelectMenuRow({ children, ...props }: ComponentProps<"button">) {
  return (
    <RowButton type="button" {...props}>
      <RowLabel>{children}</RowLabel>
      <RowCheck aria-hidden>
        <Icon icon={CheckIcon} size={14} weight="bold" />
      </RowCheck>
    </RowButton>
  );
}

export default SelectMenuRow;

const RowButton = styled.button(({ theme }) => ({
  all: "unset",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  minWidth: 0,
  flexShrink: 0,
  cursor: "pointer",
  borderRadius: 4,
  padding: 8,
  color: theme.textPrimary,
  fontSize: 14,

  "&[data-indented='true']": {
    paddingLeft: 20,
  },

  "&:hover, &[data-highlighted]": {
    backgroundColor: theme.transparentHover,
    outline: "none",
  },
  "&:active": {
    backgroundColor: theme.transparentActive,
    outline: "none",
  },
}));

const RowLabel = styled.span({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const RowCheck = styled.span({
  display: "none",
  flexShrink: 0,

  "[data-state='checked'] &": {
    display: "flex",
  },
});
