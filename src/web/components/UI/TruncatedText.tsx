import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import Tooltip from "./Tooltip";

type TruncatedTextProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  text: string;
  side?: "top" | "right" | "bottom" | "left";
  openDelay?: number;
  maxWidth?: number;
};

function TruncatedText({
  text,
  side = "top",
  openDelay = 400,
  maxWidth,
  onPointerEnter,
  ...rest
}: TruncatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  const measure = (el: HTMLSpanElement) => setTruncated(el.scrollWidth > el.clientWidth);

  useLayoutEffect(() => {
    if (ref.current) measure(ref.current);
  }, [text]);

  return (
    <Tooltip
      content={text}
      side={side}
      align="start"
      openDelay={openDelay}
      maxWidth={maxWidth}
      disabled={!truncated}
    >
      <span
        ref={ref}
        {...rest}
        onPointerEnter={(event) => {
          measure(event.currentTarget);
          onPointerEnter?.(event);
        }}
      >
        {text}
      </span>
    </Tooltip>
  );
}

export default TruncatedText;
