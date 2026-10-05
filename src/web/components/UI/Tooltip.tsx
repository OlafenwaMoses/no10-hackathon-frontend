import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  openDelay?: number;
  disabled?: boolean;
  presentational?: boolean;
  maxWidth?: number;
};

function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  openDelay = 100,
  disabled = false,
  presentational = false,
  maxWidth,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  if (disabled && open) setOpen(false);
  const trigger =
    presentational && isValidElement(children)
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
          "aria-describedby": undefined,
        })
      : children;
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root
        delayDuration={openDelay}
        open={disabled ? false : open}
        onOpenChange={setOpen}
      >
        <RadixTooltip.Trigger asChild>{trigger}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <Content
            sideOffset={0}
            side={side}
            align={align}
            collisionPadding={2}
            arrowPadding={14}
            maxWidth={maxWidth}
          >
            <Inner>{content}</Inner>
            <Arrow width={12} height={6} asChild>
              <svg viewBox="0 0 12 6" preserveAspectRatio="none">
                <path d="M0 0 L6 6 L12 0" />
              </svg>
            </Arrow>
          </Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

export default Tooltip;

const contentIn = keyframes({
  from: {
    opacity: 0,
    transform: "scale(0.97)",
  },
});

const Content = styled(RadixTooltip.Content, {
  shouldForwardProp: (prop) => prop !== "maxWidth",
})<{ maxWidth?: number }>(({ theme, maxWidth }) => ({
  transformOrigin: "var(--radix-tooltip-content-transform-origin)",
  "&[data-state='delayed-open'], &[data-state='instant-open']": {
    animation: `${contentIn} 0.16s var(--ease-out-quart)`,
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
  backgroundColor: theme.surface00,
  color: theme.textPrimary,
  border: `1px solid ${theme.border100}`,
  filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.1))",
  padding: "8px 10px",
  fontSize: 14,
  borderRadius: 8,
  maxWidth: maxWidth ?? 250,
  lineHeight: 1.45,
  zIndex: 1200,
}));

const Inner = styled.div({
  display: "block",
});

const Arrow = styled(RadixTooltip.Arrow)(({ theme }) => ({
  fill: theme.surface00,
  stroke: theme.border100,
  strokeWidth: 1,
  overflow: "visible",
}));
