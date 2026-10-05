import styled from "@emotion/styled";
import type { ReactNode } from "react";
import Skeleton from "./UI/Skeleton";

type StatTileProps = {
  label: string;
  value: ReactNode;
  suffix?: string;
  footer?: ReactNode;
  isLoading?: boolean;
};

function StatTile({ label, value, suffix, footer, isLoading }: StatTileProps) {
  return (
    <Tile>
      <Label>{label}</Label>
      {isLoading ? (
        <Skeleton width={72} height={30} />
      ) : (
        <ValueRow>
          <Value>{value}</Value>
          {suffix && <Suffix>{suffix}</Suffix>}
        </ValueRow>
      )}
      <Footer>{isLoading ? <Skeleton width="70%" height={10} /> : footer}</Footer>
    </Tile>
  );
}

export default StatTile;

const Tile = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minWidth: 0,
  padding: "16px 18px",
  border: `1px solid ${theme.border100}`,
  borderRadius: 8,
  backgroundColor: theme.surface00,
}));

const Label = styled.span(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.textTertiary,
}));

const ValueRow = styled.div({
  display: "flex",
  alignItems: "baseline",
  gap: 4,
  minWidth: 0,
  height: 34,
});

const Value = styled.span(({ theme }) => ({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  paddingBottom: 4,
  marginBottom: -4,
  fontFamily: theme.fontDisplay,
  fontSize: 32,
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  fontVariantNumeric: "tabular-nums",
  color: theme.textPrimary,
}));

const Suffix = styled.span(({ theme }) => ({
  flexShrink: 0,
  fontSize: 13,
  color: theme.textTertiary,
}));

const Footer = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minHeight: 18,
  fontSize: 12,
  color: theme.textTertiary,
}));
