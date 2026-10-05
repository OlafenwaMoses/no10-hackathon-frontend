import styled from "@emotion/styled";
import type { CSSProperties } from "react";
import { lightTheme } from "./themes";

type ThemeColors = keyof typeof lightTheme;

type HeadingProps = {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  bold?: boolean;
  color?: string;
  fontWeight?: "300" | "400" | "500" | "600" | "700" | "800";
  removeLineHeight?: boolean;
  center?: boolean;
  className?: string;
  children?: React.ReactNode;
} & { [key in ThemeColors]?: boolean };

export function Heading({
  h1,
  h2,
  h3,
  h4,
  h5,
  bold,
  color,
  fontWeight,
  removeLineHeight,
  center,
  className,
  children,
  ...props
}: HeadingProps) {
  function getTextType() {
    if (h1) return "h1";
    if (h2) return "h2";
    if (h3) return "h3";
    if (h4) return "h4";
    if (h5) return "h5";
    return "h3";
  }

  const colorProp = (Object.keys(lightTheme) as ThemeColors[]).find((key) => props[key]);

  return (
    <StyledHeading
      className={className}
      as={getTextType()}
      h1={h1}
      h2={h2}
      h3={h3}
      h4={h4}
      h5={h5}
      bold={bold}
      color={color}
      fontWeight={fontWeight}
      removeLineHeight={removeLineHeight}
      center={center}
      colorProp={colorProp}
    >
      {children}
    </StyledHeading>
  );
}

const StyledHeading = styled.div<HeadingProps & { colorProp: ThemeColors | undefined }>(
  ({
    h1,
    h2,
    h3,
    h4,
    h5,
    bold,
    color,
    fontWeight,
    removeLineHeight,
    center,
    colorProp,
    theme,
  }) => ({
    color: color || (colorProp ? theme[colorProp as keyof typeof theme] : "inherit"),
    fontFamily: theme.fontDisplay,
    fontSize: 40,
    fontWeight: fontWeight ? fontWeight : bold ? 450 : 350,
    lineHeight: "110%",
    margin: 0,
    padding: 0,
    ...(h1 && {
      fontSize: 52,
      lineHeight: "140%",
    }),
    ...(h2 && {
      fontSize: 40,
      lineHeight: "140%",
    }),
    ...(h3 && {
      fontSize: 34,
      lineHeight: "150%",
    }),
    ...(h4 && {
      fontSize: 24,
      lineHeight: "140%",
    }),
    ...(h5 && {
      fontSize: 18,
      lineHeight: "170%",
    }),
    ...(removeLineHeight && { lineHeight: "100%" }),
    ...(center && { textAlign: "center" }),
  }),
);

type PProps = {
  size?: "sm" | "md" | "lg";
  bold?: boolean;
  color?: string;
  center?: boolean;
  justify?: boolean;
  width?: number | string;
  maxWidth?: number | string;
  removeLineHeight?: boolean;
  noWrap?: boolean;
  fontWeight?: "300" | "400" | "450" | "500" | "600" | "700" | "800";
  truncate?: boolean;
  funnel?: boolean;
} & { [key in ThemeColors]?: boolean };

export const P = styled.p<PProps>(
  ({
    size,
    bold,
    color,
    center,
    width,
    maxWidth,
    removeLineHeight,
    justify,
    noWrap,
    theme,
    fontWeight,
    truncate,
    funnel,
    ...props
  }) => {
    const colorProp = (Object.keys(lightTheme) as ThemeColors[]).find((key) => props[key]);

    return {
      fontSize: size === "lg" ? 16 : size === "sm" ? 12 : 14,
      fontWeight: fontWeight ? fontWeight : bold ? 500 : 400,
      lineHeight: removeLineHeight ? "100%" : "150%",
      color: color || (colorProp ? theme[colorProp as keyof typeof theme] : "inherit"),
      textAlign: center ? "center" : justify ? "justify" : "left",
      maxWidth,
      width,
      ...(funnel && { fontFamily: theme.fontDisplay, fontWeight: bold ? 500 : 350 }),
      ...(noWrap && { whiteSpace: "nowrap", overflow: "hidden" }),
      ...(truncate && {
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
    };
  },
);

type FlexProps = {
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  flexDirection?: CSSProperties["flexDirection"];
  flexWrap?: CSSProperties["flexWrap"];
  flexGrow?: CSSProperties["flexGrow"];
  alignSelf?: CSSProperties["alignSelf"];
  gap?: CSSProperties["gap"];
  width?: CSSProperties["width"];
  minWidth?: CSSProperties["minWidth"];
  height?: CSSProperties["height"];
  column?: boolean;
};

export const Flex = styled.div<FlexProps>((props) => ({
  display: "flex",
  justifyContent: props.justifyContent || "",
  alignItems: props.alignItems || "",
  flexDirection: props.column ? "column" : props.flexDirection || "row",
  flexWrap: props.flexWrap || "nowrap",
  gap: props.gap,
  alignSelf: props.alignSelf || "auto",
  flexGrow: props.flexGrow || 0,
  width: props.width,
  minWidth: props.minWidth,
  height: props.height,
}));

export const Spacer = styled.div<{ height?: number; width?: number }>(({ height, width }) => ({
  height,
  width,
  flexShrink: 0,
}));
