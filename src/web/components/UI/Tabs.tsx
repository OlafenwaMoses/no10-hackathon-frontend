import styled from "@emotion/styled";
import { useLayoutEffect, useRef, useState } from "react";

type TabsProps<T extends string> = {
  items: { key: T; label: string; disabled?: boolean }[];
  value: T;
  onChange: (value: T) => void;
  onItemIntent?: (value: T) => void;
  label: string;
  flush?: boolean;
};

export const TAB_INSET = 8;

const CONTROL_HEIGHT = 36;
const TAB_LINE_HEIGHT = 20;

export const CONTROL_LIFT = 8;

const TAB_BOTTOM_GAP =
  CONTROL_LIFT + (CONTROL_HEIGHT - TAB_LINE_HEIGHT) / 2;

function Tabs<T extends string>({
  items,
  value,
  onChange,
  onItemIntent,
  label,
  flush,
}: TabsProps<T>) {
  const rowRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const active = tabRefs.current.get(value);
    if (!active) return;
    setMarker({ left: active.offsetLeft, width: active.offsetWidth });
  }, [value, items]);

  return (
    <TabRow
      ref={rowRef}
      role="tablist"
      aria-label={label}
      data-flush={flush || undefined}
    >
      {items.map((item) => (
        <Tab
          key={item.key}
          ref={(node: HTMLButtonElement | null) => {
            if (node) tabRefs.current.set(item.key, node);
            else tabRefs.current.delete(item.key);
          }}
          type="button"
          role="tab"
          aria-selected={value === item.key}
          data-active={value === item.key || undefined}
          disabled={item.disabled}
          onClick={() => onChange(item.key)}
          onMouseEnter={onItemIntent ? () => onItemIntent(item.key) : undefined}
          onFocus={onItemIntent ? () => onItemIntent(item.key) : undefined}
          onPointerDown={onItemIntent ? () => onItemIntent(item.key) : undefined}
        >
          {item.label}
        </Tab>
      ))}
      {marker && (
        <Underline
          aria-hidden
          style={{
            transform: `translateX(${marker.left}px)`,
            width: marker.width,
          }}
        />
      )}
    </TabRow>
  );
}

export default Tabs;

const TabRow = styled.div({
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  alignSelf: "stretch",
  gap: 2,
  minWidth: 0,
  flexShrink: 0,

  "&[data-flush]": {
    marginLeft: -TAB_INSET,
  },
});

const Tab = styled.button(({ theme }) => ({
  all: "unset",
  boxSizing: "border-box",
  position: "relative",
  display: "inline-flex",
  alignItems: "flex-end",
  padding: `0 ${TAB_INSET}px ${TAB_BOTTOM_GAP}px`,
  fontSize: 14,
  lineHeight: `${TAB_LINE_HEIGHT}px`,
  fontWeight: 450,
  whiteSpace: "nowrap",
  color: theme.textSecondary,
  cursor: "pointer",
  transition: "color 0.2s ease-out",
  "&[data-active]": {
    color: theme.textPrimary,
    fontWeight: 500,
  },
  "&:disabled": {
    cursor: "default",
    color: theme.textDisabled,
  },
  "&:focus-visible": {
    boxShadow: theme.focusRing,
  },
  "@media (hover: hover) and (pointer: fine)": {
    "&:not(:disabled):hover": {
      color: theme.textPrimary,
    },
  },
}));

const Underline = styled.span(({ theme }) => ({
  position: "absolute",
  left: 0,
  bottom: -1,
  height: 2,
  zIndex: 2,
  backgroundColor: theme.textPrimary,
  pointerEvents: "none",
  willChange: "transform",
  transition:
    "transform 0.28s var(--ease-out-quart), width 0.28s var(--ease-out-quart)",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}));
