import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Avatar from "../Avatar";

type TypingIndicatorProps = {
  name: string;
  pictureUrl: string | null;
};

function TypingIndicator({ name, pictureUrl }: TypingIndicatorProps) {
  return (
    <Row aria-label={`${name} is typing`}>
      <Avatar name={name} src={pictureUrl} size={28} />
      <Bubble>
        <Dot />
        <Dot />
        <Dot />
      </Bubble>
    </Row>
  );
}

export default TypingIndicator;

const bounce = keyframes({
  "0%, 60%, 100%": { opacity: 0.3, transform: "translateY(0)" },
  "30%": { opacity: 1, transform: "translateY(-3px)" },
});

const Row = styled.div({
  display: "flex",
  alignItems: "flex-end",
  gap: 10,
});

const Bubble = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 4,
  height: 38,
  padding: "0 14px",
  borderRadius: 8,
  borderBottomLeftRadius: 2,
  backgroundColor: theme.surface00,
  border: `1px solid ${theme.border100}`,
}));

const Dot = styled.span(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  backgroundColor: theme.textTertiary,
  animation: `${bounce} 1.2s ease-in-out infinite`,
  "&:nth-of-type(2)": { animationDelay: "0.15s" },
  "&:nth-of-type(3)": { animationDelay: "0.3s" },
}));
