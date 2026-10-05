import styled from "@emotion/styled";
import type { InputHTMLAttributes } from "react";

type TextInputProps = {
  width?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function TextInput({ width, ...props }: TextInputProps) {
  return <StyledInput style={{ width }} {...props} />;
}

export default TextInput;

const StyledInput = styled.input(({ theme }) => ({
  all: "unset",
  height: 36,
  padding: "0 12px",
  borderRadius: 4,
  border: "1px solid",
  borderColor: theme.border100,
  backgroundColor: theme.surface00,
  color: theme.textPrimary,
  outline: "none",
  boxSizing: "border-box",
  flex: "1 1 auto",
  minWidth: 0,
  maxWidth: "100%",

  ["&::placeholder"]: {
    color: theme.textTertiary,
  },
  ["&:focus"]: {
    borderColor: theme.fillPrimary,
    boxShadow: theme.focusRing,
  },
}));
