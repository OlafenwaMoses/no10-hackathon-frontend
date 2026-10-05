import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";

type ModalContent = ReactNode | ((close: () => void, id: string) => ReactNode);

interface ModalEntry {
  id: string;
  content: ModalContent;
  isClosing: boolean;
}

type ShowModalFn = (content: ModalContent) => string;
type CloseModalFn = () => void;

const dismissGuards = new Map<string, () => boolean>();

let showModal: ShowModalFn | null = null;
let hideModal: CloseModalFn | null = null;
let hideAllModals: CloseModalFn | null = null;

function ModalManager() {
  const [stack, setStack] = useState<ModalEntry[]>([]);

  const closeModal = (id: string) => {
    setStack((s) => s.map((m) => (m.id === id ? { ...m, isClosing: true } : m)));
    setTimeout(() => {
      dismissGuards.delete(id);
      setStack((s) => s.filter((m) => m.id !== id));
    }, 250);
  };

  const requestClose = (id: string) => {
    if (dismissGuards.get(id)?.()) return;
    closeModal(id);
  };

  useEffect(() => {
    showModal = (content) => {
      const id = crypto.randomUUID();
      setStack((s) => [...s, { id, content, isClosing: false }]);
      return id;
    };

    hideModal = () => {
      if (stack.length === 0) return;
      closeModal(stack[stack.length - 1].id);
    };

    hideAllModals = () => {
      setStack((s) => s.map((m) => ({ ...m, isClosing: true })));
      setTimeout(() => {
        setStack([]);
      }, 250);
    };

    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack.length > 0) {
        const topModal = stack[stack.length - 1];
        if (topModal && !topModal.isClosing) {
          if (dismissGuards.get(topModal.id)?.()) return;
          closeModal(topModal.id);
        }
      }
    };
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
    };
  }, [stack]);

  if (!stack.length) return null;

  const root = document.getElementById("root");
  if (!root) return null;

  return createPortal(
    <>
      {stack.map(({ id, content, isClosing }, i) => (
        <Modal key={id} zIndex={1 + i} isClosing={isClosing} onClose={() => requestClose(id)}>
          {typeof content === "function" ? content(() => closeModal(id), id) : content}
        </Modal>
      ))}
    </>,
    root,
  );
}

export default ModalManager;

export function openModal(content: ModalContent) {
  return showModal?.(content);
}

export function closeModal() {
  hideModal?.();
}

export function registerModalDismissGuard(id: string, guard: (() => boolean) | null) {
  if (guard) dismissGuards.set(id, guard);
  else dismissGuards.delete(id);
}

export function closeAllModals() {
  hideAllModals?.();
}
