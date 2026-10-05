import styled from "@emotion/styled";

export const PageScroll = styled.div({
  height: "100%",
  overflowY: "auto",
  overflowX: "hidden",
});

export const PageInner = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 20,
  width: "100%",
  maxWidth: 1480,
  margin: "0 auto",
  padding: "24px 28px 48px",
});

export const SectionCard = styled.section(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${theme.border100}`,
  borderRadius: 8,
  backgroundColor: theme.surface00,
  overflow: "hidden",
}));

export const SectionHead = styled.header(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minHeight: 44,
  padding: "0 16px",
  borderBottom: `1px solid ${theme.borderFaint}`,
  fontSize: 13,
  fontWeight: 500,
  color: theme.textPrimary,
}));

export const SectionBody = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 14,
  padding: 16,
});

export const Eyebrow = styled.span(({ theme }) => ({
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: theme.textTertiary,
}));
