import styled from "@emotion/styled";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { SearchCategoryChoice, SearchRegion, SearchSectorChoice } from "@api-types";
import {
  ALL,
  ALL_CATEGORIES_LABEL,
  ALL_SECTORS_LABEL,
  RESIDENCE_REGION_LABELS,
  SEARCH_REGIONS,
  SEARCH_SECTORS,
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
import parseEnum from "../lib/parseEnum";
import useCreateSearch from "../hooks/useCreateSearch";

const MIN_PEOPLE = 5;
const MAX_PEOPLE = 50;
const GLOBAL = "global";

const REGION_OPTIONS = [
  { id: GLOBAL, name: "All regions (global)" },
  ...SEARCH_REGIONS.map((id) => ({ id, name: id === "other" ? "Other…" : RESIDENCE_REGION_LABELS[id] })),
];

const CATEGORY_CHOICES = [ALL, ...TALENT_CATEGORIES] as const;
const SECTOR_CHOICES = [ALL, ...SEARCH_SECTORS] as const;

const CATEGORY_OPTIONS = [
  { id: ALL, name: ALL_CATEGORIES_LABEL },
  ...TALENT_CATEGORIES.map((id) => ({ id, name: TALENT_CATEGORY_LABELS[id] })),
];

const SECTOR_OPTIONS = [
  { id: ALL, name: ALL_SECTORS_LABEL },
  ...SEARCH_SECTORS.map((id) => ({ id, name: SECTOR_LABELS[id] })),
];

function NewSearchModal() {
  const navigate = useNavigate();
  const { createSearch, isCreating } = useCreateSearch();
  const [category, setCategory] = useState<SearchCategoryChoice>(ALL);
  const [sector, setSector] = useState<SearchSectorChoice>(ALL);
  const [region, setRegion] = useState<SearchRegion | undefined>(undefined);
  const [customRegion, setCustomRegion] = useState("");
  const [numResults, setNumResults] = useState("10");
  const [query, setQuery] = useState("");
  const queryRef = useRef<HTMLTextAreaElement>(null);

  const parsedCount = Math.round(Number(numResults));
  const countValid = Number.isFinite(parsedCount) && parsedCount >= MIN_PEOPLE && parsedCount <= MAX_PEOPLE;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!countValid || isCreating) return;
    try {
      const search = await createSearch({
        category,
        sector,
        region,
        customRegion: region === "other" ? customRegion.trim() || undefined : undefined,
        query: query.trim() || undefined,
        numResults: parsedCount,
      });
      toast.success("Search started", { description: "Candidates will appear as the pipeline finds them." });
      closeModal();
      void navigate({ to: "/searches/$searchId", params: { searchId: search.id } });
    } catch (error) {
      toast.error("Couldn't start the search", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <form onSubmit={(event) => void submit(event)}>
      <ModalShell
        title="New search"
        width={520}
        footer={
          <>
            <Button type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!countValid || isCreating}>
              {isCreating && <Loader size={14} color="currentColor" />}
              Start search
            </Button>
          </>
        }
      >
        <P textSecondary size="sm">
          Find people with Exa, research their UK links, then interview an AI persona of each one about
          relocating to the UK.
        </P>
        <Fields>
          <Row>
            <Field>
              <Label>Type of individual</Label>
              <SelectMenu
                value={category}
                onChange={(value) => setCategory(parseEnum(CATEGORY_CHOICES, value) ?? category)}
                options={CATEGORY_OPTIONS}
              />
            </Field>
            <Field>
              <Label>Sector</Label>
              <SelectMenu
                value={sector}
                onChange={(value) => setSector(parseEnum(SECTOR_CHOICES, value) ?? sector)}
                options={SECTOR_OPTIONS}
              />
            </Field>
          </Row>
          <Row>
            <Field data-grow>
              <Label>Region</Label>
              <SelectMenu
                value={region ?? GLOBAL}
                onChange={(value) => setRegion(parseEnum(SEARCH_REGIONS, value))}
                options={REGION_OPTIONS}
              />
            </Field>
            <Field data-narrow>
              <Label htmlFor="search-count">People</Label>
              <TextInput
                id="search-count"
                type="number"
                min={MIN_PEOPLE}
                max={MAX_PEOPLE}
                value={numResults}
                onChange={(event) => setNumResults(event.target.value)}
                aria-invalid={!countValid}
              />
            </Field>
          </Row>
          {region === "other" && (
            <Field>
              <Label htmlFor="search-custom-region">Which region?</Label>
              <TextInput
                id="search-custom-region"
                value={customRegion}
                onChange={(event) => setCustomRegion(event.target.value)}
                placeholder="e.g. Nordics, Israel, Gulf states"
                autoFocus
              />
            </Field>
          )}
          {!countValid && <Hint data-error>Choose between {MIN_PEOPLE} and {MAX_PEOPLE} people.</Hint>}
          {countValid && category === ALL && (
            <Hint>
              {parsedCount} people in total, spread across the {TALENT_CATEGORIES.length} types of individual. Each
              person is then classified individually.
            </Hint>
          )}
          <Field>
            <Label htmlFor="search-query">
              Custom Exa query <Optional>optional</Optional>
            </Label>
            <TextArea
              id="search-query"
              ref={queryRef}
              value={query}
              onChange={setQuery}
              minHeight={72}
              maxHeight={160}
              placeholder="Overrides the generated query, e.g. 'Series B climate-tech founders in California who studied in the UK'"
            />
          </Field>
        </Fields>
      </ModalShell>
    </form>
  );
}

export default NewSearchModal;

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
  "&[data-grow]": { flex: 3 },
  "&[data-narrow]": { flex: 1 },
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

const Hint = styled.span(({ theme }) => ({
  marginTop: -6,
  fontSize: 12,
  color: theme.textTertiary,
  "&[data-error]": { color: theme.danger },
}));
