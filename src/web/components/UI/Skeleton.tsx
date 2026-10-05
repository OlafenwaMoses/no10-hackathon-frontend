import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  circle?: boolean;
  className?: string;
};

function Skeleton({
  width = "100%",
  height = 12,
  radius = 4,
  circle = false,
  className,
}: SkeletonProps) {
  return (
    <Block
      aria-hidden="true"
      className={className}
      style={{ width, height, borderRadius: circle ? "50%" : radius }}
    />
  );
}

export default Skeleton;

const shimmer = keyframes({
  "100%": {
    transform: "translateX(100%)",
  },
});

const Block = styled.div(({ theme }) => ({
  position: "relative",
  flexShrink: 0,
  overflow: "hidden",
  backgroundColor: theme.transparentHover,
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    transform: "translateX(-100%)",
    backgroundImage: `linear-gradient(90deg, transparent, ${theme.transparentHover}, transparent)`,
    animation: `${shimmer} 1.4s ease-in-out infinite`,
  },
  "@media (prefers-reduced-motion: reduce)": {
    "&::after": {
      animation: "none",
    },
  },
}));
