import styled from "@emotion/styled";
import type { ReactNode } from "react";

type PersonaQuoteProps = {
  children: ReactNode;
  large?: boolean;
};

function PersonaQuote({ children, large }: PersonaQuoteProps) {
  return <Quote data-large={large || undefined}>“{children}”</Quote>;
}

export default PersonaQuote;

const Quote = styled.blockquote(({ theme }) => ({
  margin: 0,
  paddingLeft: 12,
  borderLeft: `2px solid ${theme.border200}`,
  fontFamily: theme.fontSerif,
  fontSize: 14,
  lineHeight: 1.55,
  color: theme.textSecondary,
  "&[data-large]": {
    fontSize: 15,
    color: theme.textPrimary,
    borderLeftColor: theme.highlight,
  },
}));
