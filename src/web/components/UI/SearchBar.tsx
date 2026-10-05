import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";

const DEBOUNCE_MS = 250;

type SearchBarProps = {
  onQueryChange: (query: string) => void;
  placeholder: string;
  label: string;
  defaultQuery?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
};

function SearchBar({
  onQueryChange,
  placeholder,
  label,
  defaultQuery = "",
  fullWidth,
  autoFocus,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultQuery);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => onQueryChange(value.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, onQueryChange]);

  const clear = () => {
    setValue("");
    onQueryChange("");
    inputRef.current?.focus();
  };

  return (
    <Field data-full-width={fullWidth || undefined}>
      <MagnifyingGlassIcon size={16} />
      <Input
        ref={inputRef}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={label}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            clear();
          }
        }}
      />
      {value.length > 0 && (
        <ClearButton type="button" aria-label="Clear search" onClick={clear}>
          <XIcon size={13} />
        </ClearButton>
      )}
    </Field>
  );
}

export default SearchBar;

const Field = styled.div(({ theme }) => ({
  position: "relative",
  flexShrink: 1,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 10px",
  height: 36,
  width: 240,
  minWidth: 0,
  maxWidth: "100%",
  boxSizing: "border-box",
  borderRadius: 4,
  border: `1px solid ${theme.border100}`,
  backgroundColor: theme.surface00,
  color: theme.textTertiary,
  transition: "border-color 0.2s ease-out, box-shadow 0.2s ease-out",
  "&:focus-within": {
    borderColor: theme.textPrimary,
    boxShadow: theme.focusRing,
  },
  "&[data-full-width]": { width: "100%" },
}));

const Input = styled.input(({ theme }) => ({
  all: "unset",
  flex: 1,
  minWidth: 0,
  fontSize: 13,
  color: theme.textPrimary,
  "&::placeholder": {
    color: theme.textTertiary,
  },
}));

const ClearButton = styled.button(({ theme }) => ({
  all: "unset",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  padding: 2,
  borderRadius: 4,
  color: theme.textTertiary,
  cursor: "pointer",
  transition: "color 0.2s ease-out",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      color: theme.textPrimary,
    },
  },
  "&:focus-visible": {
    boxShadow: theme.focusRing,
  },
}));
