import styled from "@emotion/styled";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ResidenceRegion, Sector, TalentCategory } from "@api-types";
import {
  RESIDENCE_REGIONS,
  RESIDENCE_REGION_LABELS,
  SECTORS,
  SECTOR_LABELS,
  TALENT_CATEGORIES,
  TALENT_CATEGORY_LABELS,
} from "../lib/labels";
import ModalShell from "./UI/ModalShell";
import Button from "./UI/Button";
import TextArea from "./UI/TextArea";
import TextInput from "./TextInput";
import SelectMenu from "./SelectMenu";
import Loader from "./UI/Loader";
import { closeModal } from "./ModalManager";
import { P } from "../lib/utilityComponents";
import { ApiError } from "../lib/api";
import parseEnum from "../lib/parseEnum";
import useCreateCandidate from "../hooks/useCreateCandidate";

const AUTO = "auto";

const REGION_OPTIONS = [
  { id: AUTO, name: "Unknown / let AI decide" },
  ...RESIDENCE_REGIONS.map((id) => ({ id, name: id === "other" ? "Other…" : RESIDENCE_REGION_LABELS[id] })),
];

const CATEGORY_OPTIONS = [
  { id: AUTO, name: "Let AI decide" },
  ...TALENT_CATEGORIES.map((id) => ({ id, name: TALENT_CATEGORY_LABELS[id] })),
];

const SECTOR_OPTIONS = [{ id: AUTO, name: "Let AI decide" }, ...SECTORS.map((id) => ({ id, name: SECTOR_LABELS[id] }))];

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function normaliseUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function existingCandidateId(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 409) return null;
  const body = error.body;
  if (typeof body === "object" && body !== null && "candidateId" in body && typeof body.candidateId === "string") {
    return body.candidateId;
  }
  return null;
}

function AddPersonModal() {
  const navigate = useNavigate();
  const { createCandidate, isCreating } = useCreateCandidate();
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [title, setTitle] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [region, setRegion] = useState<ResidenceRegion | undefined>(undefined);
  const [customRegion, setCustomRegion] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<TalentCategory | undefined>(undefined);
  const [sector, setSector] = useState<Sector | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const nameValid = name.trim().length > 0;

  const openCandidate = (candidateId: string) => {
    closeModal();
    void navigate({ to: "/candidates/$candidateId", params: { candidateId } });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!nameValid || isCreating) return;
    try {
      const candidate = await createCandidate({
        name: name.trim(),
        organisation: optional(organisation),
        title: optional(title),
        profileUrl: normaliseUrl(profileUrl),
        region,
        customRegion: region === "other" ? optional(customRegion) : undefined,
        location: optional(location),
        notes: optional(notes),
        category,
        sector,
      });
      toast.success(`${candidate.name} added`, {
        description: "Finding their profile, then researching UK links and building a persona.",
      });
      openCandidate(candidate.id);
    } catch (error) {
      const candidateId = existingCandidateId(error);
      if (candidateId) {
        toast.info("Already in the talent database", {
          description: "This profile is already tracked — opening the existing record.",
        });
        openCandidate(candidateId);
        return;
      }
      toast.error("Couldn't add this person", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <form onSubmit={(event) => void submit(event)}>
      <ModalShell
        title="Add person"
        width={560}
        footer={
          <>
            <Button type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!nameValid || isCreating}>
              {isCreating && <Loader size={14} color="currentColor" />}
              Add person
            </Button>
          </>
        }
      >
        <P textSecondary size="sm">
          Add someone you already know about. We'll find their profile, research their UK links and interview an AI
          persona of them, like any search result.
        </P>
        <Fields>
          <Field>
            <Label htmlFor="person-name">Name</Label>
            <TextInput
              id="person-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              autoFocus
              required
            />
          </Field>
          <Row>
            <Field>
              <Label htmlFor="person-organisation">
                Organisation <Optional>optional</Optional>
              </Label>
              <TextInput
                id="person-organisation"
                value={organisation}
                onChange={(event) => setOrganisation(event.target.value)}
                placeholder="e.g. Mistral AI"
              />
            </Field>
            <Field>
              <Label htmlFor="person-title">
                Role / title <Optional>optional</Optional>
              </Label>
              <TextInput
                id="person-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Co-founder & CEO"
              />
            </Field>
          </Row>
          <Field>
            <Label htmlFor="person-url">
              LinkedIn or profile URL <Optional>optional</Optional>
            </Label>
            <TextInput
              id="person-url"
              inputMode="url"
              value={profileUrl}
              onChange={(event) => setProfileUrl(event.target.value)}
              placeholder="https://www.linkedin.com/in/…"
            />
          </Field>
          <Row>
            <Field>
              <Label>Current residence</Label>
              <SelectMenu
                value={region ?? AUTO}
                onChange={(value) => setRegion(parseEnum(RESIDENCE_REGIONS, value))}
                options={REGION_OPTIONS}
              />
            </Field>
            <Field>
              <Label htmlFor="person-city">
                City <Optional>optional</Optional>
              </Label>
              <TextInput
                id="person-city"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. San Francisco"
              />
            </Field>
          </Row>
          {region === "other" && (
            <Field>
              <Label htmlFor="person-custom-region">Which region?</Label>
              <TextInput
                id="person-custom-region"
                value={customRegion}
                onChange={(event) => setCustomRegion(event.target.value)}
                placeholder="e.g. Nordics, Israel, Gulf states"
              />
            </Field>
          )}
          <Row>
            <Field>
              <Label>Type of individual</Label>
              <SelectMenu
                value={category ?? AUTO}
                onChange={(value) => setCategory(parseEnum(TALENT_CATEGORIES, value))}
                options={CATEGORY_OPTIONS}
              />
            </Field>
            <Field>
              <Label>Taskforce priority sector</Label>
              <SelectMenu
                value={sector ?? AUTO}
                onChange={(value) => setSector(parseEnum(SECTORS, value))}
                options={SECTOR_OPTIONS}
              />
            </Field>
          </Row>
          <Field>
            <Label htmlFor="person-notes">
              Notes <Optional>optional</Optional>
            </Label>
            <TextArea
              id="person-notes"
              ref={notesRef}
              value={notes}
              onChange={setNotes}
              minHeight={88}
              maxHeight={200}
              placeholder="Anything you know — how you heard of them, relationship holder, context. This is treated as verified information."
            />
          </Field>
        </Fields>
      </ModalShell>
    </form>
  );
}

export default AddPersonModal;

const Fields = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 14,
  marginTop: 18,
});

const Row = styled.div({
  display: "flex",
  gap: 12,
});

const Field = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  flex: 1,
  minWidth: 0,
});

const Label = styled.label(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  color: theme.textSecondary,
}));

const Optional = styled.span(({ theme }) => ({
  marginLeft: 4,
  fontWeight: 400,
  color: theme.textTertiary,
}));
