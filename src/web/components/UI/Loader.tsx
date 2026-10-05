import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

type LoaderProps = {
  size?: number;
  color?: string;
};

function Loader({ size = 48, color }: LoaderProps) {
  return (
    <Spinner
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size, color, borderWidth: Math.max(1.5, size / 10) }}
    />
  );
}

export default Loader;

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
});

const Spinner = styled.span(({ theme }) => ({
  display: "inline-block",
  flexShrink: 0,
  boxSizing: "border-box",
  borderRadius: "50%",
  borderStyle: "solid",
  borderColor: theme.border200,
  borderTopColor: "currentColor",
  color: theme.textPrimary,
  animation: `${spin} 0.8s linear infinite`,
  "@media (prefers-reduced-motion: reduce)": {
    animationDuration: "1.6s",
  },
}));
