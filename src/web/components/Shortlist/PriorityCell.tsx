import styled from "@emotion/styled";
import { toast } from "sonner";
import type { ShortlistItem } from "@api-types";
import InlineSelect from "./InlineSelect";
import useUpdateShortlistEntry from "../../hooks/useUpdateShortlistEntry";

const MAX_PRIORITY = 10;

function PriorityCell({ item }: { item: ShortlistItem }) {
  const { updateEntry } = useUpdateShortlistEntry();
  const current = item.priority === null ? null : String(item.priority);
  const values = Array.from({ length: Math.max(MAX_PRIORITY, item.priority ?? 0) }, (_, index) => String(index + 1));

  const change = async (value: string | null) => {
    try {
      await updateEntry({ entryId: item.id, body: { priority: value === null ? null : Number(value) } });
    } catch (error) {
      toast.error("Couldn't update the priority", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <InlineSelect
      label="Priority"
      value={current}
      options={values.map((value) => ({ value, label: `Priority ${value}` }))}
      noneLabel="No priority"
      onChange={(value) => void change(value)}
      width={160}
    >
      {item.priority === null ? <Empty>Set</Empty> : <Badge>{item.priority}</Badge>}
    </InlineSelect>
  );
}

export default PriorityCell;

const Badge = styled.span(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 22,
  height: 22,
  padding: "0 6px",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
  color: theme.textPrimary,
  backgroundColor: theme.surface200,
}));

const Empty = styled.span(({ theme }) => ({
  fontSize: 13,
  color: theme.textDisabled,
}));
