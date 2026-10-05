import styled from "@emotion/styled";
import type { ButtonHTMLAttributes, Ref } from "react";

type ButtonProps = {
  variant?: "primary" | "dark" | "secondary" | "muted" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  ref?: Ref<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ variant = "secondary", size = "md", ref, ...props }: ButtonProps) {
  return <StyledButton ref={ref} data-variant={variant} size={size} {...props} />;
}

export default Button;

const StyledButton = styled.button<{ size: "sm" | "md" | "lg" }>(({ theme, size }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  height: size === "sm" ? 36 : size === "md" ? 40 : 44,
  padding: size === "sm" ? "0 16px" : size === "md" ? "0 18px" : "0 20px",
  borderRadius: 4,
  border: "1px solid",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1,
  whiteSpace: "nowrap",
  transition: "all 0.2s ease-out",
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  backgroundColor: theme.surface00,
  color: theme.textPrimary,
  borderColor: theme.border100,
  "&:hover": {
    backgroundColor: theme.transparentHover,
  },
  "&:active": {
    backgroundColor: theme.transparentActive,
    transform: "translateY(1px)",
  },
  "&[data-variant='primary']": {
    backgroundColor: theme.fillPrimary,
    color: theme.textOnPrimary,
    borderColor: theme.fillPrimary,
  },
  "&[data-variant='primary']:hover": {
    backgroundColor: theme.fillPrimaryHover,
  },
  "&[data-variant='primary']:active": {
    backgroundColor: theme.fillPrimaryActive,
    transform: "translateY(1px)",
  },
  "&[data-variant='dark']": {
    backgroundColor: theme.textPrimary,
    color: theme.surface00,
    borderColor: theme.textPrimary,
  },
  "&[data-variant='dark']:not(:disabled):hover": {
    backgroundColor: theme.textPrimary,
    opacity: 0.85,
  },
  "&[data-variant='dark']:not(:disabled):active": {
    backgroundColor: theme.textPrimary,
    opacity: 0.75,
    transform: "translateY(1px)",
  },
  "&[data-variant='danger']": {
    color: theme.danger,
    borderColor: theme.dangerBorder,
    backgroundColor: "transparent",
  },
  "&[data-variant='danger']:hover": {
    backgroundColor: theme.dangerHover,
  },
  "&[data-variant='danger']:active": {
    backgroundColor: theme.dangerActive,
    transform: "translateY(1px)",
  },
  "&[data-variant='muted']": {
    color: theme.textSecondary,
    backgroundColor: theme.surface100,
    width: "100%",

    "&:hover": {
      backgroundColor: theme.transparentHover,
    },
    "&:active": {
      backgroundColor: theme.transparentActive,
      transform: "translateY(1px)",
    },
  },
  "&[data-variant='ghost']": {
    color: theme.textSecondary,
    backgroundColor: "transparent",
    borderColor: "transparent",
    "&:hover": {
      backgroundColor: theme.transparentHover,
    },
    "&:active": {
      backgroundColor: theme.transparentActive,
      transform: "translateY(1px)",
    },
  },
}));
