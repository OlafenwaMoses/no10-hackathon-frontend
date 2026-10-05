import { toast } from "sonner";
import { SHORTLIST_STAGES, type ShortlistItem, type ShortlistStage } from "@api-types";
import InlineSelect from "./InlineSelect";
import ShortlistStagePill from "./ShortlistStagePill";
import openAccountRecord from "./openAccountRecord";
import { SHORTLIST_STAGE_LABELS } from "../../lib/labels";
import useUpdateShortlistEntry from "../../hooks/useUpdateShortlistEntry";

const OPTIONS = SHORTLIST_STAGES.map((value) => ({ value, label: SHORTLIST_STAGE_LABELS[value] }));

function StageCell({ item }: { item: ShortlistItem }) {
  const { updateEntry } = useUpdateShortlistEntry();

  const change = async (stage: ShortlistStage | null) => {
    if (!stage) return;
    try {
      await updateEntry({ entryId: item.id, body: { stage } });
      const needsDetails = stage === "closed" || stage === "failed";
      toast.success(`${item.candidate.name}: ${SHORTLIST_STAGE_LABELS[stage]}`, {
        action: needsDetails
          ? {
              label: stage === "closed" ? "Add closure details" : "Add reason",
              onClick: () => openAccountRecord({ ...item, stage }, item.candidate),
            }
          : undefined,
        duration: needsDetails ? 8000 : undefined,
      });
    } catch (error) {
      toast.error("Couldn't update the stage", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <InlineSelect label="Stage" value={item.stage} options={OPTIONS} onChange={(stage) => void change(stage)} width={220}>
      <ShortlistStagePill stage={item.stage} />
    </InlineSelect>
  );
}

export default StageCell;
