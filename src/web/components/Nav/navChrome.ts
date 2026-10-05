import styled from "@emotion/styled";
import { createLink } from "@tanstack/react-router";

export const NAV_WIDTH = 200;
export const RAIL_WIDTH = 56;
export const MIN_WIDTH = 180;
export const MAX_WIDTH = 216;
export const COLLAPSE_BELOW = 140;
export const FORCE_COLLAPSE_QUERY = "(max-width: 799px)";

export const Rail = styled.nav(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  flexShrink: 0,
  width: NAV_WIDTH,
  height: "100%",
  backgroundColor: theme.surface100,
  borderRight: `1px solid ${theme.border100}`,
  transition: "width 0.3s var(--ease-in-quart)",

  "&[data-collapsed]": {
    width: RAIL_WIDTH,
  },
  "&[data-resizing]": {
    transition: "none",
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));

export const TopSlot = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: 55,
  flexShrink: 0,
  padding: "0 8px",
  overflow: "hidden",
  borderBottom: `1px solid ${theme.border100}`,
}));

const RailButton = styled.a(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  height: 36,
  flexShrink: 0,
  padding: "0 10px",
  border: "none",
  background: "none",
  borderRadius: 4,
  font: "inherit",
  fontSize: 14,
  cursor: "pointer",
  textDecoration: "none",
  color: theme.textSecondary,
  transition: "background-color 200ms ease, color 200ms ease",

  "& svg": {
    flexShrink: 0,
  },

  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      backgroundColor: theme.transparentHover,
      color: theme.textPrimary,
    },
  },
  "&:active": {
    backgroundColor: theme.transparentActive,
  },
  "&:focus-visible": {
    boxShadow: theme.focusRing,
  },

  "&[data-status='active']:not([data-fallback]), &[data-current]": {
    backgroundColor: theme.selectedBg,
    color: theme.textPrimary,
  },

  "&[data-muted]": {
    color: theme.textTertiary,
  },
}));

export const NavRow = createLink(RailButton);

export const RailAction = styled(RailButton.withComponent("button"))({
  width: 40,
  flexShrink: 0,
});

const LogoAnchor = styled(RailButton)(({ theme }) => ({
  justifyContent: "center",
  width: 40,
  padding: 0,
  color: theme.textPrimary,

  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      backgroundColor: "transparent",
      color: theme.textPrimary,
    },
  },
  "&:active": {
    backgroundColor: "transparent",
  },
  "&&[data-status='active']": {
    backgroundColor: "transparent",
  },
}));

export const LogoLink = createLink(LogoAnchor);

export const IconSlot = styled.span({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 20,
  height: 20,
});

export const RowLabel = styled.span({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  opacity: 1,
  visibility: "visible",
  transition: "opacity 0.12s ease 0.18s, visibility 0s linear 0.18s",

  "[data-collapsed] &": {
    opacity: 0,
    visibility: "hidden",
    transition: "opacity 0.1s ease, visibility 0s linear 0.1s",
  },
});

export const Items = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 2,
  padding: "12px 8px",
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
});

export const Footer = styled.div({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 4,
  flexShrink: 0,
  padding: "0 8px 12px",
  overflow: "hidden",

  "[data-collapsed] &": {
    flexDirection: "column-reverse",
    alignItems: "stretch",
    gap: 2,
  },
});

export const SwitcherSlot = styled.div({
  display: "flex",
  alignItems: "center",
  flex: 1,
  minWidth: 0,
  opacity: 1,
  visibility: "visible",
  transition: "opacity 0.12s ease 0.18s, visibility 0s linear 0.18s",

  "[data-collapsed] &": {
    opacity: 0,
    visibility: "hidden",
    transition: "opacity 0.1s ease, visibility 0s linear 0.1s",
  },
});
