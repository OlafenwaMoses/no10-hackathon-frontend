import { FileXlsIcon } from "@phosphor-icons/react";
import Pill from "./UI/Pill";

function ImportedTag() {
  return (
    <Pill tone="teal" icon={<FileXlsIcon size={12} weight="bold" />}>
      Imported
    </Pill>
  );
}

export default ImportedTag;
