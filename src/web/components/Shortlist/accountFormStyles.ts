import styled from "@emotion/styled";

export const FormSection = styled.section(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  paddingTop: 18,
  borderTop: `1px solid ${theme.borderFaint}`,
  "&:first-of-type": { paddingTop: 0, borderTop: "none" },
}));

export const FormSectionTitle = styled.h3(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  margin: 0,
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
}));

export const FormGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px 12px",
  "@media (max-width: 720px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
});

export const FormField = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 0,
  "&[data-span='2']": { gridColumn: "span 2" },
  "&[data-span='full']": { gridColumn: "1 / -1" },
});

export const FormLabel = styled.label(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.textSecondary,
}));

export const FormHint = styled.span(({ theme }) => ({
  fontSize: 11,
  color: theme.textTertiary,
}));
