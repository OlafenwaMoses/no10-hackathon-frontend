import styled from "@emotion/styled";

export const GhostToolbarTrigger = styled.button(({ theme }) => ({
  all: "unset",
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 36,
  padding: "0 10px",
  borderRadius: 4,
  border: "1px solid transparent",
  backgroundColor: "transparent",
  fontSize: 13,
  color: theme.textSecondary,
  cursor: "pointer",
  whiteSpace: "nowrap",
  flexShrink: 0,
  transition: "color 0.2s ease, background-color 0.2s ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      color: theme.textPrimary,
      backgroundColor: theme.transparentHover,
    },
  },
  "&:focus-visible": {
    boxShadow: theme.focusRing,
  },
  "&[data-state='open'], &[aria-expanded='true']": {
    color: theme.textPrimary,
    backgroundColor: theme.transparentActive,
  },
  "&[data-active]": {
    color: theme.textPrimary,
  },
  "&:disabled": {
    color: theme.textTertiary,
    cursor: "default",
  },
}));
