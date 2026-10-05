import styled from "@emotion/styled";
import type { Icon } from "@phosphor-icons/react";
import Tooltip from "./Tooltip";
import Loader from "./Loader";

type IconButtonProps = {
  size?: "sm" | "md" | "lg";
  iconSize?: number;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  icon?: Icon;
  isLoading?: boolean;
  tabIndex?: number;
  tooltip?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  padding?: number;
  radius?: number;
  hitArea?: { x: number; y: number };
  danger?: boolean;
  secondary?: boolean;
};

function IconButton({
  size = "md",
  iconSize: iconSizeOverride,
  onClick,
  disabled,
  icon: Icon,
  isLoading,
  tabIndex,
  tooltip,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  padding,
  radius,
  hitArea,
  danger,
  secondary,
}: IconButtonProps) {
  const iconSize = iconSizeOverride ?? (size === "lg" ? 24 : size === "md" ? 20 : 16);
  const accessibleName = ariaLabel ?? tooltip;

  const inner = (
    <Wrapper
      type="button"
      size={size}
      padding={padding}
      radius={radius}
      hitArea={hitArea}
      data-danger={danger || undefined}
      data-secondary={secondary || undefined}
      onClick={onClick}
      disabled={disabled}
      tabIndex={tabIndex}
      aria-label={ariaLabelledBy ? undefined : accessibleName}
      aria-labelledby={ariaLabelledBy}
    >
      {isLoading ? <Loader size={iconSize} /> : Icon && <Icon size={iconSize} />}
    </Wrapper>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} openDelay={500} presentational>
        {disabled ? <DisabledTarget>{inner}</DisabledTarget> : inner}
      </Tooltip>
    );
  }

  return inner;
}

export default IconButton;

const DisabledTarget = styled.span({
  display: "inline-flex",
  flexShrink: 0,
  cursor: "not-allowed",
});

const Wrapper = styled.button<{
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  padding?: number;
  radius?: number;
  hitArea?: { x: number; y: number };
}>(({ theme, size, disabled, padding, radius, hitArea }) => ({
  all: "unset",
  flexShrink: 0,
  cursor: "pointer",
  padding: padding ?? (size === "lg" ? 12 : size === "md" ? 10 : 8),
  borderRadius: radius ?? 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 200ms ease",
  color: theme.textPrimary,
  opacity: disabled ? 0.5 : 1,
  pointerEvents: disabled ? "none" : undefined,
  "&:hover": {
    backgroundColor: !disabled ? theme.transparentHover : undefined,
  },
  "&:active": {
    backgroundColor: theme.transparentActive,
    transform: "translateY(1px)",
  },
  "&[data-secondary]": {
    color: theme.textSecondary,
    "&:hover": {
      color: theme.textPrimary,
    },
  },
  "&[data-danger]": {
    "&:hover": {
      backgroundColor: !disabled ? theme.dangerHover : undefined,
      color: theme.danger,
    },
    "&:active": {
      backgroundColor: theme.dangerActive,
      color: theme.danger,
    },
  },

  ...(hitArea && {
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: -hitArea.y,
      bottom: -hitArea.y,
      left: -hitArea.x,
      right: -hitArea.x,
    },
  }),
}));
