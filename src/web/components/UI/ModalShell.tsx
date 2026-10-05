import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { P, Spacer } from "../../lib/utilityComponents";
import CloseButton from "./CloseButton";

type ModalShellProps = {
  title?: ReactNode;
  header?: ReactNode;
  onClose?: () => void;
  closeDisabled?: boolean;
  closeTop?: number;
  width?: number;
  height?: number;
  padding?: "default" | "none";
  footer?: ReactNode;
  children: ReactNode;
};

function ModalShell({
  title,
  header,
  onClose,
  closeDisabled,
  closeTop,
  width = 440,
  height,
  padding = "default",
  footer,
  children,
}: ModalShellProps) {
  const flush = padding === "none";
  return (
    <Outer style={{ width, height }} data-padding={padding}>
      <CloseButton onClick={onClose} disabled={closeDisabled} top={closeTop} />
      {header ??
        (title && (
          <>
            <Title bold size="lg" funnel textPrimary>
              {title}
            </Title>
            <Spacer height={8} />
          </>
        ))}
      <Body data-padding={padding}>{children}</Body>
      {footer &&
        (flush ? (
          footer
        ) : (
          <>
            <Spacer height={20} />
            <Footer>{footer}</Footer>
          </>
        ))}
    </Outer>
  );
}

export default ModalShell;

const Outer = styled.div(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100vh - 96px)",
  padding: 24,
  backgroundColor: theme.surface100,
  borderRadius: 8,
  border: `1px solid ${theme.borderModal}`,
  overflow: "hidden",
  transition: "width 0.25s var(--ease-out-quart)",

  "&[data-padding='none']": {
    padding: 0,
  },
}));

const Title = styled(P)({
  paddingRight: 40,
  flexShrink: 0,
});

const Body = styled.div({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",

  "&[data-padding='none']": {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
});

const Footer = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 8,
  flexShrink: 0,
});
