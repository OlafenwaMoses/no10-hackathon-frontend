import type { CSSObject, Theme } from "@emotion/react";

export const selectStyle = (theme: Theme): CSSObject => ({
  height: 36,
  padding: "0 36px 0 12px",
  borderRadius: 4,
  border: "1px solid",
  borderColor: theme.border100,
  backgroundColor: theme.surface00,
  color: theme.textPrimary,
  outline: "none",
  width: "100%",
  appearance: "none",
  backgroundImage:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="%23AAAAAA" d="M5.5 7.5l4.5 4.5 4.5-4.5"/></svg>\')',
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  ["&:focus"]: {
    borderColor: theme.fillPrimary,
    boxShadow: theme.focusRing,
  },
  ["&:disabled"]: {
    color: theme.textTertiary,
    backgroundColor: theme.surface100,
    borderColor: theme.border200,
    cursor: "not-allowed",
  },
});
