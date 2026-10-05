import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUpIcon, ChatCircleDotsIcon } from "@phosphor-icons/react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import TextArea from "../UI/TextArea";
import IconButton from "../UI/IconButton";
import Loader from "../UI/Loader";
import { P } from "../../lib/utilityComponents";
import useCandidateChat from "../../hooks/useCandidateChat";

const SUGGESTIONS = [
  "What would it take for you to move to the UK?",
  "What do you think of the UK's tech and research ecosystem?",
  "Which UK Government support would matter most to you?",
  "What's holding you back from relocating?",
];

type PersonaChatProps = {
  candidateId: string;
  name: string;
  firstName: string;
  pictureUrl: string | null;
  ready: boolean;
};

function PersonaChat({ candidateId, name, firstName, pictureUrl, ready }: PersonaChatProps) {
  const { messages, isLoading, sendMessage, isSending } = useCandidateChat(candidateId, ready);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
  }, [messages.length, isSending]);

  const send = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;
    setDraft("");
    try {
      await sendMessage(trimmed);
    } catch (error) {
      setDraft(trimmed);
      toast.error(`${firstName} couldn't reply`, {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  if (!ready) {
    return (
      <Placeholder>
        <ChatCircleDotsIcon size={22} />
        <P textSecondary center size="sm">
          You can chat with {firstName}'s persona once it has been built.
        </P>
      </Placeholder>
    );
  }

  return (
    <Wrapper>
      <Messages ref={scrollRef}>
        {isLoading ? (
          <Placeholder>
            <Loader size={20} />
          </Placeholder>
        ) : messages.length === 0 ? (
          <Intro>
            <P textSecondary center size="sm" maxWidth={420}>
              Ask {firstName}'s AI persona anything about relocating, their priorities or how they'd react to a
              pitch. Answers are simulated from public information.
            </P>
            <Suggestions>
              {SUGGESTIONS.map((suggestion) => (
                <Suggestion key={suggestion} type="button" onClick={() => void send(suggestion)}>
                  {suggestion}
                </Suggestion>
              ))}
            </Suggestions>
          </Intro>
        ) : (
          messages.map((message, index) => (
            <ChatBubble key={index} message={message} name={name} pictureUrl={pictureUrl} />
          ))
        )}
        {isSending && <TypingIndicator name={name} pictureUrl={pictureUrl} />}
      </Messages>
      <Composer onClick={() => inputRef.current?.focus()}>
        <TextArea
          ref={inputRef}
          value={draft}
          onChange={setDraft}
          border={false}
          maxHeight={160}
          rows={1}
          placeholder={`Ask ${firstName} a question…`}
          ariaLabel={`Message ${firstName}`}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send(draft);
            }
          }}
        />
        <IconButton
          icon={ArrowUpIcon}
          size="sm"
          aria-label="Send"
          disabled={!draft.trim() || isSending}
          onClick={() => void send(draft)}
        />
      </Composer>
    </Wrapper>
  );
}

export default PersonaChat;

const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  height: 620,
});

const Messages = styled.div({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  padding: 20,
  overflowY: "auto",
});

const Placeholder = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  flex: 1,
  padding: "56px 24px",
  color: theme.textTertiary,
}));

const Intro = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  flex: 1,
});

const Suggestions = styled.div({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 8,
  maxWidth: 560,
});

const Suggestion = styled.button(({ theme }) => ({
  all: "unset",
  padding: "7px 12px",
  borderRadius: 9999,
  fontSize: 13,
  color: theme.textSecondary,
  backgroundColor: theme.surface00,
  border: `1px solid ${theme.border100}`,
  cursor: "pointer",
  transition: "background-color 200ms ease, color 200ms ease, border-color 200ms ease",
  "@media (hover: hover) and (pointer: fine)": {
    "&:hover": {
      color: theme.textPrimary,
      borderColor: theme.border200,
      backgroundColor: theme.surface50,
    },
  },
  "&:focus-visible": { boxShadow: theme.focusRing },
}));

const Composer = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  gap: 8,
  margin: "0 16px 16px",
  padding: "6px 6px 6px 8px",
  borderRadius: 8,
  border: `1px solid ${theme.border200}`,
  backgroundColor: theme.surface00,
  cursor: "text",
  transition: "border-color 0.2s ease-out, box-shadow 0.2s ease-out",
  "&:focus-within": {
    borderColor: theme.textTertiary,
    boxShadow: theme.focusRing,
  },
}));
