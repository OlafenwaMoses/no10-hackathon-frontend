import styled from "@emotion/styled";
import IconButton from "./IconButton";
import { XIcon } from "@phosphor-icons/react";
import { closeModal } from "../ModalManager";

type CloseButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  top?: number;
};

function CloseButton({ onClick, disabled, top }: CloseButtonProps) {
  return (
    <IconPlacer style={top === undefined ? undefined : { top }}>
      <IconButton
        icon={XIcon}
        size="sm"
        aria-label="Close"
        disabled={disabled}
        onClick={onClick ?? (() => closeModal())}
      />
    </IconPlacer>
  );
}

export default CloseButton;

const IconPlacer = styled.div({
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 10,
  pointerEvents: "auto",
});
