import styled from "@emotion/styled";

export const TableFrame = styled.div(({ theme }) => ({
  width: "100%",
  overflowX: "auto",
  border: `1px solid ${theme.border200}`,
  borderRadius: 8,
  backgroundColor: theme.surface00,
}));

export const DataTable = styled.table(({ theme }) => ({
  width: "100%",
  tableLayout: "fixed",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: 13,
  "& th": {
    textAlign: "left",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    height: 38,
    padding: "0 14px",
    fontSize: 12,
    fontWeight: 500,
    color: theme.textTertiary,
    backgroundColor: theme.surface100,
    borderBottom: `1px solid ${theme.border200}`,
  },
  "& td": {
    height: 58,
    padding: "8px 14px",
    verticalAlign: "middle",
    color: theme.textSecondary,
    backgroundColor: "var(--row-bg, transparent)",
    borderBottom: `1px solid ${theme.borderFaint}`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    transition: "background-color 150ms ease",
  },
  "& tbody tr:last-of-type td": {
    borderBottom: "none",
  },
}));

export const ClickableRow = styled.tr(({ theme }) => ({
  cursor: "pointer",
  outline: "none",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      "--row-bg": theme.surface50,
    },
  },
  "&:focus-visible": {
    "--row-bg": theme.surface50,
    boxShadow: `inset 0 0 0 2px ${theme.border200}`,
  },
}));

export const Blank = styled.span(({ theme }) => ({
  color: theme.textDisabled,
}));
