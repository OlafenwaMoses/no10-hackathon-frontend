import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { RAG_VALUES, type Rag } from "@api-types";
import MixBar from "../MixBar";
import { RAG_LABELS } from "../../lib/labels";
import { RAG_TONES, toneForeground } from "../../lib/tones";

type RagBreakdownProps = {
  label: string;
  counts: Record<Rag, number>;
};

function RagBreakdown({ label, counts }: RagBreakdownProps) {
  const theme = useTheme();

  return (
    <Wrapper>
      <Label>{label}</Label>
      <MixBar
        segments={RAG_VALUES.map((rag) => ({
          key: rag,
          label: RAG_LABELS[rag],
          count: counts[rag],
          tone: RAG_TONES[rag],
        }))}
      />
      <Counts>
        {RAG_VALUES.map((rag) => (
          <Count key={rag}>
            <Dot style={{ backgroundColor: toneForeground(theme, RAG_TONES[rag]) }} />
            {RAG_LABELS[rag]}
            <Value>{counts[rag]}</Value>
          </Count>
        ))}
      </Counts>
    </Wrapper>
  );
}

export default RagBreakdown;

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minWidth: 0,
});

const Label = styled.span(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.textTertiary,
}));

const Counts = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: "4px 14px",
});

const Count = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  color: theme.textSecondary,
}));

const Dot = styled.span({
  width: 7,
  height: 7,
  borderRadius: "50%",
});

const Value = styled.span(({ theme }) => ({
  fontWeight: 600,
  color: theme.textPrimary,
  fontVariantNumeric: "tabular-nums",
}));
