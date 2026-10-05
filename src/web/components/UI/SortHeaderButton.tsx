import styled from "@emotion/styled";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import Tooltip from "./Tooltip";
import type { SortDirection } from "../../hooks/useTableSort";

type SortHeaderButtonProps = {
  children: ReactNode;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
};

function SortHeaderButton({ children, active, direction, onClick }: SortHeaderButtonProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) return;
    const measure = () => setTruncated(label.scrollWidth > label.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    return () => observer.disconnect();
  }, [children]);

  return (
    <Tooltip content={children} disabled={!truncated} align="start" openDelay={400}>
      <Button type="button" onClick={onClick}>
        <Label ref={labelRef}>{children}</Label>
        <Caret>
          {active &&
            (direction === "asc" ? (
              <CaretDownIcon size={12} weight="bold" />
            ) : (
              <CaretUpIcon size={12} weight="bold" />
            ))}
        </Caret>
      </Button>
    </Tooltip>
  );
}

export default SortHeaderButton;

const Button = styled.button(({ theme }) => ({
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  maxWidth: "100%",
  cursor: "pointer",
  color: "inherit",
  fontWeight: "inherit",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  borderRadius: 4,
  transition: "color 200ms ease",

  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      color: theme.textPrimary,
    },
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.fillPrimary}`,
    outlineOffset: 2,
  },
}));

const Label = styled.span({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const Caret = styled.span({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 12,
  flexShrink: 0,
});
