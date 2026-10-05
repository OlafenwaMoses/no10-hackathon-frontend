import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import type { Rag } from "@api-types";
import { RAG_LABELS } from "../../lib/labels";
import { RAG_TONES, toneForeground } from "../../lib/tones";

function RagIndicator({ rag, placeholder = "—" }: { rag: Rag | null; placeholder?: string }) {
  const theme = useTheme();
  if (!rag) return <Empty>{placeholder}</Empty>;

  return (
    <Wrapper>
      <Dot style={{ backgroundColor: toneForeground(theme, RAG_TONES[rag]) }} />
      {RAG_LABELS[rag]}
    </Wrapper>
  );
}

export default RagIndicator;

const Wrapper = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  color: theme.textSecondary,
  whiteSpace: "nowrap",
}));

const Dot = styled.span({
  width: 8,
  height: 8,
  flexShrink: 0,
  borderRadius: "50%",
});

const Empty = styled.span(({ theme }) => ({
  color: theme.textDisabled,
}));
