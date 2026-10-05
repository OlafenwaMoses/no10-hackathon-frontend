import {
  Fragment,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { P } from "../../lib/utilityComponents";
import { fadeInAndSlideDown, fadeInAndSlideUp, fadeOutAndSlideDown } from "../../lib/animations";
import Tooltip from "./Tooltip";

type DropdownContentItem =
  | ReactNode
  | { kind: "label"; node: ReactNode }
  | { kind: "static"; node: ReactNode }
  | { kind: "separator" }
  | {
      kind: "item";
      node: ReactNode;
      disabled?: boolean;
      keepOpen?: boolean;
      onSelect?: (event: Event) => void;
    }
  | { kind: "radio"; node: ReactNode; value: string; onSelect?: (event: Event) => void }
  | { kind: "sub"; trigger: ReactNode; items: DropdownContentItem[]; width?: string | number };

type DropdownProps = {
  children: ReactNode;
  items: DropdownContentItem[];
  align?: "start" | "center" | "end";
  alignOffset?: number;
  width?: string | number;
  maxHeight?: string | number;
  side?: "bottom" | "left" | "right" | "top";
  open?: boolean;
  setOpen?: (open: boolean) => void;
  label?: string;
  scrollFade?: boolean;
  peekRows?: number;
  peekExtra?: number;
  onCloseFocus?: () => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  tooltip?: string;
  header?: ReactNode;
  triggerTooltip?: string;
  triggerTooltipDisabled?: boolean;
  radioValue?: string;
  onRadioValueChange?: (value: string) => void;
  closeOnScroll?: boolean;
};

function renderItems(items: DropdownContentItem[]) {
  return items.map((entry, index) => {
    const isObject =
      typeof entry === "object" && entry !== null && "kind" in (entry as Record<string, unknown>);
    if (isObject) {
      const typed = entry as Exclude<DropdownContentItem, ReactNode>;
      if (typed.kind === "label") {
        return <SectionLabel key={`label-${index}`}>{typed.node}</SectionLabel>;
      }
      if (typed.kind === "static") {
        return <Fragment key={`static-${index}`}>{typed.node}</Fragment>;
      }
      if (typed.kind === "separator") {
        return <Separator key={`sep-${index}`} />;
      }
      if (typed.kind === "item") {
        const { keepOpen, onSelect } = typed;
        return (
          <Item
            asChild={isValidElement(typed.node)}
            key={`item-${index}`}
            disabled={typed.disabled}
            onSelect={
              keepOpen || onSelect
                ? (e) => {
                    if (keepOpen) e.preventDefault();
                    onSelect?.(e);
                  }
                : undefined
            }
          >
            {typed.node}
          </Item>
        );
      }
      if (typed.kind === "radio") {
        return (
          <RadioItem
            asChild={isValidElement(typed.node)}
            key={`radio-${index}`}
            value={typed.value}
            onSelect={typed.onSelect}
          >
            {typed.node}
          </RadioItem>
        );
      }
      if (typed.kind === "sub") {
        return (
          <RadixDropdown.Sub key={`sub-${index}`}>
            <SubTrigger>{typed.trigger}</SubTrigger>
            <RadixDropdown.Portal>
              <SubContent sideOffset={10} alignOffset={0} width={typed.width}>
                {renderItems(typed.items)}
              </SubContent>
            </RadixDropdown.Portal>
          </RadixDropdown.Sub>
        );
      }
    }
    return (
      <Item asChild key={`node-${index}`}>
        {entry as ReactNode}
      </Item>
    );
  });
}

function Dropdown({
  children,
  items,
  width,
  maxHeight,
  side,
  align,
  alignOffset,
  label,
  open,
  setOpen,
  scrollFade,
  peekRows,
  peekExtra = 0,
  onCloseFocus,
  onEscapeKeyDown,
  tooltip,
  header,
  triggerTooltip,
  triggerTooltipDisabled,
  radioValue,
  onRadioValueChange,
  closeOnScroll,
}: DropdownProps) {
  const scrollElRef = useRef<HTMLDivElement | null>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const [peekHeight, setPeekHeight] = useState<number | undefined>(undefined);
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open ?? internalOpen;
  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (setOpen) {
        setOpen(next);
      } else {
        setInternalOpen(next);
      }
    },
    [setOpen],
  );

  useEffect(() => {
    if (!isOpen || !closeOnScroll) return;
    const onScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-radix-menu-content]")) return;
      handleOpenChange(false);
    };
    document.addEventListener("scroll", onScroll, true);
    return () => document.removeEventListener("scroll", onScroll, true);
  }, [isOpen, closeOnScroll, handleOpenChange]);

  const measureFades = useCallback((el: HTMLDivElement) => {
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowTopFade(el.scrollTop > 4);
    setShowBottomFade(distanceFromBottom > 4);
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollElRef.current;
    if (el) measureFades(el);
  }, [measureFades]);

  const measurePeek = useCallback(
    (node: HTMLDivElement) => {
      if (peekRows == null) return;
      const rowEls = node.querySelectorAll<HTMLElement>('[role="menuitem"]');
      const firstRow = rowEls[0];

      if (firstRow && rowEls.length > peekRows) {
        const cs = getComputedStyle(node);
        const gap = parseFloat(cs.rowGap) || 0;
        const padTop = parseFloat(cs.paddingTop) || 0;
        const rowH = firstRow.offsetHeight;
        const maxH = typeof maxHeight === "number" ? maxHeight : parseFloat(String(maxHeight));
        const computed = padTop + peekRows * (rowH + gap) + rowH / 2 + peekExtra;
        setPeekHeight(maxH ? Math.min(computed, maxH) : computed);
      } else {
        setPeekHeight(undefined);
      }
    },
    [peekRows, peekExtra, maxHeight],
  );

  const setScrollRef = useCallback(
    (node: HTMLDivElement | null) => {
      scrollElRef.current = node;
      if (!node) return;
      measurePeek(node);
      measureFades(node);
    },
    [measurePeek, measureFades],
  );

  useEffect(() => {
    const node = scrollElRef.current;
    if (!node) return;
    measurePeek(node);
    measureFades(node);
  }, [items.length, measurePeek, measureFades]);

  const usesFade = scrollFade || peekRows != null;
  const effectiveMaxHeight = peekRows != null && peekHeight != null ? peekHeight : maxHeight;

  const triggerWrapper = <TriggerWrapper asChild>{children}</TriggerWrapper>;
  const trigger = tooltip ? (
    <Tooltip content={tooltip} openDelay={400} disabled={isOpen}>
      {triggerWrapper}
    </Tooltip>
  ) : (
    triggerWrapper
  );

  const scrollContent = (
    <Scroll
      ref={usesFade ? setScrollRef : undefined}
      onScroll={usesFade ? onScroll : undefined}
    >
      {label && (
        <Label>
          <P textSecondary size="sm">
            {label}
          </P>
        </Label>
      )}
      {renderItems(items)}
    </Scroll>
  );

  return (
    <Wrapper modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      {triggerTooltip ? (
        <Tooltip content={triggerTooltip} disabled={triggerTooltipDisabled} openDelay={500}>
          {trigger}
        </Tooltip>
      ) : (
        trigger
      )}
      <RadixDropdown.Portal>
        <Content
          align={align ?? "start"}
          alignOffset={alignOffset}
          sideOffset={4}
          width={width}
          maxHeight={effectiveMaxHeight}
          side={side}
          onEscapeKeyDown={onEscapeKeyDown}
          onCloseAutoFocus={
            onCloseFocus
              ? (e) => {
                  e.preventDefault();
                  onCloseFocus();
                }
              : undefined
          }
        >
          {header}
          <Body>
            {usesFade && <TopFade visible={showTopFade} />}
            {onRadioValueChange ? (
              <RadixDropdown.RadioGroup asChild value={radioValue} onValueChange={onRadioValueChange}>
                {scrollContent}
              </RadixDropdown.RadioGroup>
            ) : (
              scrollContent
            )}
            {usesFade && <BottomFade visible={showBottomFade} />}
          </Body>
        </Content>
      </RadixDropdown.Portal>
    </Wrapper>
  );
}

export default Dropdown;

const Wrapper = styled(RadixDropdown.Root)({
  zIndex: 3,
});

const TriggerWrapper = styled(RadixDropdown.Trigger)({});

const Content = styled(RadixDropdown.Content, {
  shouldForwardProp: (prop) => prop !== "width" && prop !== "maxHeight",
})<{ width?: number | string; maxHeight?: number | string }>(({ theme, width, maxHeight }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.surface00,
  backdropFilter: "blur(8px)",
  border: `1px solid ${theme.border100}`,
  borderRadius: 4,
  boxShadow: theme.shadowDropdown,
  zIndex: 1100,
  width: width ?? "200px",
  maxHeight: maxHeight ?? "400px",
  overflow: "hidden",
  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",

  "&[data-side='bottom']": {
    animation: `${fadeInAndSlideDown} 0.18s var(--ease-out-quart)`,
  },

  "&[data-side='top']": {
    animation: `${fadeInAndSlideUp} 0.18s var(--ease-out-quart)`,
  },

  "&[data-state='closed']": {
    animation: `${fadeOutAndSlideDown} 0.13s var(--ease-out-cubic)`,
  },
}));

const Body = styled.div({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
});

const Scroll = styled.div({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 8,
});

const BottomFade = styled.div<{ visible: boolean }>(({ theme, visible }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 40,
  zIndex: 1,
  pointerEvents: "none",
  borderRadius: "0 0 4px 4px",
  background: `linear-gradient(to bottom, ${theme.surface00}00, ${theme.surface00})`,
  backdropFilter: "blur(0.5px)",
  WebkitBackdropFilter: "blur(0.5px)",
  maskImage: "linear-gradient(to bottom, transparent, black 70%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 70%)",
  opacity: visible ? 1 : 0,
  transition: "opacity 200ms ease",
}));

const TopFade = styled.div<{ visible: boolean }>(({ theme, visible }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  height: 32,
  zIndex: 1,
  pointerEvents: "none",
  borderRadius: "4px 4px 0 0",
  background: `linear-gradient(to top, ${theme.surface00}00, ${theme.surface00})`,
  backdropFilter: "blur(0.5px)",
  WebkitBackdropFilter: "blur(0.5px)",
  maskImage: "linear-gradient(to top, transparent, black 70%)",
  WebkitMaskImage: "linear-gradient(to top, transparent, black 70%)",
  opacity: visible ? 1 : 0,
  transition: "opacity 200ms ease",
}));

const SubContent = styled(RadixDropdown.SubContent, {
  shouldForwardProp: (prop) => prop !== "width",
})<{ width?: number | string }>(({ theme, width }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  backgroundColor: theme.surface00,
  backdropFilter: "blur(8px)",
  border: `1px solid ${theme.border100}`,
  borderRadius: 4,
  boxShadow: theme.shadowDropdown,
  padding: 8,
  zIndex: 1101,
  width: width ?? "140px",
  animation: `${fadeInAndSlideDown} 0.15s var(--ease-out-quart)`,
}));

const SubTrigger = styled(RadixDropdown.SubTrigger)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  borderRadius: 4,
  padding: 8,
  outline: "none",
  fontSize: 14,

  "&:hover, &[data-state='open']": {
    backgroundColor: theme.transparentHover,
    outline: "none",
  },
  "&:active": {
    backgroundColor: theme.transparentActive,
    outline: "none",
  },
}));

const Item = styled(RadixDropdown.Item)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  borderRadius: 4,
  padding: 8,
  outline: "none",
  fontSize: 14,
  whiteSpace: "nowrap",

  "&:hover": {
    backgroundColor: theme.transparentHover,
    outline: "none",
  },
  "&:active": {
    backgroundColor: theme.transparentActive,
    outline: "none",
  },
  "&[data-disabled]": {
    cursor: "default",
    "&:hover, &:active": { backgroundColor: "transparent" },
  },
}));

const RadioItem = Item.withComponent(RadixDropdown.RadioItem);

const Label = styled(RadixDropdown.Label)({
  padding: 8,
  paddingBottom: 0,
});

const SectionLabel = styled.div(({ theme }) => ({
  padding: 8,
  paddingTop: 6,
  paddingBottom: 2,
  color: theme.textTertiary,
  fontSize: 12,
  fontWeight: 600,
  cursor: "default",

  "&:first-of-type": {
    paddingTop: 8,
  },
}));

const Separator = styled(RadixDropdown.Separator)(({ theme }) => ({
  height: 1,
  minHeight: 1,
  flexShrink: 0,
  alignSelf: "stretch",
  backgroundColor: theme.border100,
  margin: "2px 6px",
  borderRadius: 1,
}));
