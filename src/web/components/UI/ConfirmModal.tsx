import styled from "@emotion/styled";
import { ReactNode } from "react";
import { P, Flex, Spacer } from "../../lib/utilityComponents";
import Button from "./Button";
import { closeModal } from "../ModalManager";

type ConfirmModalProps = {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
};

function ConfirmModal({ title, message, confirmLabel, onConfirm }: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <Outer>
      <P bold size="lg" funnel>
        {title}
      </P>
      <Spacer height={8} />
      <P textSecondary>{message}</P>
      <Spacer height={20} />
      <Flex gap={8} justifyContent="flex-end">
        <Button type="button" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </Flex>
    </Outer>
  );
}

export default ConfirmModal;

const Outer = styled.div(({ theme }) => ({
  backgroundColor: theme.surface100,
  borderRadius: 8,
  border: `1px solid ${theme.borderModal}`,
  width: 420,
  maxWidth: "calc(100vw - 32px)",
  padding: 24,
}));
