import styled from "@emotion/styled";
import { useEffect, useRef } from "react";

type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
  expands?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  minHeight?: number;
  maxHeight?: number;
  resizable?: boolean;
  height?: string | number;
  fontSize?: number;
  rows?: number;
  autoFocus?: boolean;
  border?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
};

function adjustHeight(
  textarea: HTMLTextAreaElement,
  maxHeight: number,
  manuallyResized: { current: boolean },
  autoHeight: { current: number },
  placeholder: string,
) {
  if (manuallyResized.current) return;
  const previous = textarea.style.height;
  const transition = textarea.style.transition;
  const grow = textarea.style.flexGrow;
  textarea.style.transition = "none";
  textarea.style.flexGrow = "0";
  textarea.placeholder = "";
  textarea.style.height = "auto";
  const target = Math.min(textarea.scrollHeight, maxHeight);
  textarea.placeholder = placeholder;
  textarea.style.flexGrow = grow;
  if (previous) {
    textarea.style.height = previous;
    void textarea.offsetHeight;
  }
  textarea.style.transition = transition;
  textarea.style.height = `${target}px`;
  autoHeight.current = target;
}

function TextArea({
  value,
  onChange,
  placeholder,
  ref,
  onKeyDown,
  onPaste,
  onFocus,
  onBlur,
  minHeight,
  maxHeight = 240,
  resizable = false,
  fontSize,
  expands = true,
  height,
  rows,
  autoFocus,
  border = true,
  disabled,
  className,
  id,
  ariaLabel,
}: TextAreaProps) {
  const manuallyResized = useRef(false);
  const autoHeight = useRef(0);

  const placeholderRef = useRef(placeholder ?? "");
  placeholderRef.current = placeholder ?? "";

  useEffect(() => {
    if (ref?.current && expands) {
      adjustHeight(ref.current, maxHeight, manuallyResized, autoHeight, placeholderRef.current);
    }
  }, [value, ref, expands, maxHeight, placeholder]);

  useEffect(() => {
    const textarea = ref?.current;
    if (!textarea || !expands) return;
    let width = textarea.clientWidth;
    const observer = new ResizeObserver(() => {
      if (textarea.clientWidth === width) return;
      width = textarea.clientWidth;
      adjustHeight(textarea, maxHeight, manuallyResized, autoHeight, placeholderRef.current);
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [ref, expands, maxHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (expands) {
      adjustHeight(e.target, maxHeight, manuallyResized, autoHeight, placeholderRef.current);
    }
  };

  return (
    <Wrapper
      autoFocus={autoFocus}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      ref={ref}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseUp={
        resizable
          ? (e) => {
              if (
                autoHeight.current > 0 &&
                Math.abs(e.currentTarget.offsetHeight - autoHeight.current) > 1
              ) {
                manuallyResized.current = true;
              }
            }
          : undefined
      }
      minHeight={minHeight}
      maxHeight={maxHeight}
      resizable={resizable}
      fontSize={fontSize}
      height={height}
      rows={rows}
      border={border}
      disabled={disabled}
      className={className}
      id={id}
      aria-label={ariaLabel}
    />
  );
}

export default TextArea;

const Wrapper = styled.textarea<{
  minHeight?: number;
  maxHeight?: number;
  resizable?: boolean;
  fontSize?: number;
  height?: string | number;
  border?: boolean;
}>(({ theme, minHeight, maxHeight, resizable, fontSize, height, border }) => ({
  all: "unset",
  background: "transparent",
  resize: resizable ? "vertical" : "none",
  maxHeight,
  overflowY: "auto",
  color: theme.textPrimary,
  fontSize: fontSize ?? 14,
  flexGrow: 1,
  padding: 8,
  border: border ? "1px solid" : "none",
  borderRadius: 4,
  borderColor: theme.border100,
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
  height: height ?? "auto",

  "&:focus": {
    outline: "none",
    boxShadow: "none",
  },

  "&:disabled": {
    cursor: "default",
  },

  "&::placeholder": {
    whiteSpace: "pre-line",
  },

  minHeight: minHeight || "auto",
}));
