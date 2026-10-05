import styled from "@emotion/styled";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { CandidateDetail, OutreachStatus } from "@api-types";
import Button from "../UI/Button";
import TextArea from "../UI/TextArea";
import Loader from "../UI/Loader";
import SelectMenu from "../SelectMenu";
import { OUTREACH_STATUSES, OUTREACH_STATUS_LABELS } from "../../lib/labels";
import formatRelativeTime from "../../lib/formatRelativeTime";
import parseEnum from "../../lib/parseEnum";
import useUpdateOutreach from "../../hooks/useUpdateOutreach";

const STATUS_OPTIONS = OUTREACH_STATUSES.map((id) => ({ id, name: OUTREACH_STATUS_LABELS[id] }));

function OutreachForm({ candidate }: { candidate: CandidateDetail }) {
  const { updateOutreach, isSaving } = useUpdateOutreach(candidate.id);
  const [status, setStatus] = useState<OutreachStatus>(candidate.outreachStatus);
  const [note, setNote] = useState(candidate.outreachNote ?? "");
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const dirty = status !== candidate.outreachStatus || note.trim() !== (candidate.outreachNote ?? "").trim();

  const save = async () => {
    if (!dirty || isSaving) return;
    try {
      await updateOutreach({ status, note: note.trim() });
      toast.success("Outreach updated", { description: `${candidate.name}: ${OUTREACH_STATUS_LABELS[status]}.` });
    } catch (error) {
      toast.error("Couldn't update outreach", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <Fields>
      <Field>
        <Label>Status</Label>
        <SelectMenu
          value={status}
          onChange={(value) => setStatus(parseEnum(OUTREACH_STATUSES, value) ?? status)}
          options={STATUS_OPTIONS}
        />
      </Field>
      <Field>
        <Label htmlFor="outreach-note">Note</Label>
        <TextArea
          id="outreach-note"
          ref={noteRef}
          value={note}
          onChange={setNote}
          minHeight={80}
          maxHeight={200}
          placeholder="Who reached out, how, and what was said…"
        />
      </Field>
      <Footer>
        <Meta>{candidate.contactedAt ? `First contacted ${formatRelativeTime(candidate.contactedAt)}` : null}</Meta>
        <Button type="button" variant="primary" size="sm" disabled={!dirty || isSaving} onClick={() => void save()}>
          {isSaving && <Loader size={14} color="currentColor" />}
          Save
        </Button>
      </Footer>
    </Fields>
  );
}

export default OutreachForm;

const Fields = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

const Field = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 6,
});

const Label = styled.label(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.textSecondary,
}));

const Footer = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
});

const Meta = styled.span(({ theme }) => ({
  fontSize: 12,
  color: theme.textTertiary,
}));
