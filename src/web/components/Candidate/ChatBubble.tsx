import styled from "@emotion/styled";
import { motion } from "motion/react";
import type { ChatMessage } from "@api-types";
import Avatar from "../Avatar";

type ChatBubbleProps = {
  message: ChatMessage;
  name: string;
  pictureUrl: string | null;
};

function ChatBubble({ message, name, pictureUrl }: ChatBubbleProps) {
  const fromUser = message.role === "user";

  return (
    <Row
      data-user={fromUser || undefined}
      initial={{ opacity: 0, transform: "translateY(6px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.22, ease: [0.165, 0.84, 0.44, 1] }}
    >
      {!fromUser && <Avatar name={name} src={pictureUrl} size={28} />}
      <Bubble data-user={fromUser || undefined}>{message.content}</Bubble>
    </Row>
  );
}

export default ChatBubble;

const Row = styled(motion.div)({
  display: "flex",
  alignItems: "flex-end",
  gap: 10,
  maxWidth: "82%",
  "&[data-user]": {
    alignSelf: "flex-end",
  },
});

const Bubble = styled.div(({ theme }) => ({
  padding: "10px 14px",
  borderRadius: 8,
  borderBottomLeftRadius: 2,
  fontSize: 14,
  lineHeight: 1.55,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  color: theme.textPrimary,
  backgroundColor: theme.surface00,
  border: `1px solid ${theme.border100}`,
  "&[data-user]": {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 2,
    backgroundColor: theme.userBubble,
    borderColor: "transparent",
  },
}));
