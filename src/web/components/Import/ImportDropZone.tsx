import styled from "@emotion/styled";
import { useRef, useState, type DragEvent } from "react";
import { FileArrowUpIcon } from "@phosphor-icons/react";
import Button from "../UI/Button";
import Loader from "../UI/Loader";

export const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"] as const;

type ImportDropZoneProps = {
  onFile: (file: File) => void;
  isParsing: boolean;
};

function ImportDropZone({ onFile, isParsing }: ImportDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && !isParsing) onFile(file);
  };

  return (
    <Zone
      data-dragging={isDragging}
      data-busy={isParsing}
      onClick={() => !isParsing && inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <HiddenInput
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onFile(file);
        }}
      />
      <IconRing>{isParsing ? <Loader size={20} /> : <FileArrowUpIcon size={22} />}</IconRing>
      <Title>{isParsing ? "Reading spreadsheet…" : "Drop a spreadsheet here"}</Title>
      <Sub>Excel (.xlsx, .xls) or CSV · read in your browser, nothing is uploaded until you import</Sub>
      <Button
        type="button"
        size="sm"
        disabled={isParsing}
        onClick={(event) => {
          event.stopPropagation();
          inputRef.current?.click();
        }}
      >
        Choose file
      </Button>
    </Zone>
  );
}

export default ImportDropZone;

const Zone = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  marginTop: 18,
  padding: "36px 24px",
  border: `1px dashed ${theme.border200}`,
  borderRadius: 8,
  backgroundColor: theme.surface50,
  cursor: "pointer",
  textAlign: "center",
  transition: "background-color 150ms ease, border-color 150ms ease",
  "&:hover, &[data-dragging='true']": {
    borderColor: theme.textTertiary,
    backgroundColor: theme.surface200,
  },
  "&[data-busy='true']": {
    cursor: "progress",
  },
}));

const HiddenInput = styled.input({
  display: "none",
});

const IconRing = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  marginBottom: 8,
  borderRadius: "50%",
  backgroundColor: theme.surface200,
  border: `1px solid ${theme.border100}`,
  color: theme.textTertiary,
}));

const Title = styled.span(({ theme }) => ({
  fontSize: 15,
  fontWeight: 500,
  color: theme.textPrimary,
}));

const Sub = styled.span(({ theme }) => ({
  marginBottom: 12,
  fontSize: 12,
  color: theme.textTertiary,
}));
