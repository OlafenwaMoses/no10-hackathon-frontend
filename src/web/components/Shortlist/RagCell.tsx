import { toast } from "sonner";
import { RAG_VALUES, type Rag, type ShortlistItem } from "@api-types";
import InlineSelect from "./InlineSelect";
import RagIndicator from "./RagIndicator";
import useUpdateShortlistEntry from "../../hooks/useUpdateShortlistEntry";

const OPTIONS = RAG_VALUES.map((value) => ({ value, label: <RagIndicator rag={value} /> }));

type RagCellProps = {
  item: ShortlistItem;
  field: "successRag" | "relationshipRag";
};

function RagCell({ item, field }: RagCellProps) {
  const { updateEntry } = useUpdateShortlistEntry();
  const label = field === "successRag" ? "Likelihood of success" : "Strength of relationship";

  const change = async (rag: Rag | null) => {
    try {
      await updateEntry({ entryId: item.id, body: { [field]: rag } });
    } catch (error) {
      toast.error(`Couldn't update ${label.toLowerCase()}`, {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <InlineSelect
      label={label}
      value={item[field]}
      options={OPTIONS}
      noneLabel="Not set"
      onChange={(rag) => void change(rag)}
      width={160}
    >
      <RagIndicator rag={item[field]} placeholder="Set" />
    </InlineSelect>
  );
}

export default RagCell;
