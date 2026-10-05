import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import React, { useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  isClosing?: boolean;
  width?: string;
  fullScreen?: boolean;
  zIndex?: number;
};

function Modal({ children, onClose, width, zIndex, isClosing = false, fullScreen }: ModalProps) {
  const backdropMouseDownRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    backdropMouseDownRef.current = e.target === e.currentTarget;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const releasedOnBackdrop = e.target === e.currentTarget;
    if (backdropMouseDownRef.current && releasedOnBackdrop) {
      onClose();
    }
    backdropMouseDownRef.current = false;
  };

  const root = document.getElementById("root");
  if (!root) return null;

  return createPortal(
    <Wrapper
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      zIndex={zIndex}
      isClosing={isClosing}
    >
      <Content
        role="dialog"
        aria-modal="true"
        isClosing={isClosing}
        width={width}
        fullScreen={!!fullScreen}
      >
        {children}
      </Content>
    </Wrapper>,
    root,
  );
}

export default Modal;

const opacity = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const opacityOut = keyframes({
  from: {
    opacity: 1,
  },
  to: {
    opacity: 0,
  },
});

const scale = keyframes({
  "0%": {
    transform: "scale(0.5)",
    opacity: 0,
  },
  "100%": {
    transform: "scale(1)",
    opacity: 1,
  },
});

const scaleOut = keyframes({
  "0%": {
    transform: "scale(1)",
    opacity: 1,
  },
  "100%": {
    transform: "scale(0.8)",
    opacity: 0,
  },
});

const Wrapper = styled.div<{ zIndex?: number; isClosing: boolean }>(
  ({ zIndex, isClosing, theme }) => ({
    position: "absolute",
    height: "100%",
    width: "100%",
    color: theme.textPrimary,
    top: 0,
    left: 0,
    backgroundColor: theme.backdrop,
    backdropFilter: "blur(3px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000 + (zIndex ?? 0),
    animation: isClosing
      ? `${opacityOut} 0.25s var(--ease-out-cubic) forwards`
      : `${opacity} 0.2s var(--ease-out-quart)`,
  }),
);

const Content = styled.div<{
  isClosing: boolean;
  width?: string;
  fullScreen: boolean;
}>(({ isClosing, width, fullScreen }) => ({
  "--translate": "0px, 0px",
  position: "absolute",
  width: width || (fullScreen ? "100%" : "fit-content"),
  height: fullScreen ? "100%" : "auto",
  borderRadius: fullScreen ? 0 : 16,
  animation: isClosing
    ? `${scaleOut} 0.25s var(--ease-out-cubic) forwards`
    : `${scale} 0.2s var(--ease-out-quart)`,
  zIndex: 3,

  transformOrigin: "center",
}));
