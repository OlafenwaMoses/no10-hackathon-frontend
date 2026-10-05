import {
  GTT_CRITERIA,
  GTT_CRITERIA_LABELS,
  RESIDENCE_REGIONS,
  RESIDENCE_REGION_LABELS,
  SECTORS,
  SECTOR_LABELS,
  TALENT_CATEGORIES,
  TALENT_CATEGORY_LABELS,
  type Classification,
  type PersonaAttributes,
  type Sector,
  type TalentCategory,
  type UkLinks,
} from "../types";
import { generateJson, type LlmEnv } from "./llm";
import { renderPersonaProfile } from "./persona-profile";

function optionList<T extends string>(values: readonly T[], labels: Record<T, string>) {
  return values.map((value) => `- ${value}: ${labels[value]}`).join("\n");
}

const SYSTEM_PROMPT = `You classify leads for the UK Government's Global Talent Taskforce (GTT) into the categories used on its Master Tracker.

Fields:
1. category (Type of Individual): founder (founded or co-founded the company they lead), investor (professional investor at a VC, PE, growth or corporate fund), hnwi (high or ultra-high net worth individual investing their own wealth, e.g. family office principal, exited founder, chairman of a family investment company), c_suite (CEO, CTO, CFO, CSO or similar executive who did not found the company), researcher (academic or industrial research leader), highly_talented (exceptional individual contributor who fits none of the above).
${optionList(TALENT_CATEGORIES, TALENT_CATEGORY_LABELS)}

2. sector (GTT Priority Sector): use ai when the person's work is primarily artificial intelligence; digital_tech for other software, fintech, cyber, quantum, semiconductors and deep tech; life_sciences for biotech, pharma, medtech, healthtech; clean_energy for climate tech, renewables, storage, hydrogen, fusion, grid, carbon removal; pan_economy for investors and HNWIs who invest across several sectors; other when none fit.
${optionList(SECTORS, SECTOR_LABELS)}

3. subSector: the specific industry in 2-5 words, e.g. "Offshore wind", "mRNA therapeutics", "AI infrastructure", "Early-stage deep tech VC".

4. criteria (GTT Criteria): uhnwi for ultra-high net worth individuals; investor for professional investors; otherwise the talent criterion matching their sector (ai and digital_tech both map to digital_tech_talent); na when nothing fits.
${optionList(GTT_CRITERIA, GTT_CRITERIA_LABELS)}

5. residenceRegion (Current residence): where they live now.
${optionList(RESIDENCE_REGIONS, RESIDENCE_REGION_LABELS)}

6. nationality: their nationality as an adjective (e.g. "American", "Indian") only when the evidence supports it, otherwise an empty string.

7. rationale: one sentence explaining the classification.

Base everything on the evidence. The search that found them is only a hint; correct it when the evidence says otherwise.`;

export async function classifyCandidate(
  env: LlmEnv,
  input: {
    profileText: string;
    persona: PersonaAttributes;
    ukLinks: UkLinks;
    searchCategory: TalentCategory;
    searchSector: Sector;
  },
): Promise<Classification> {
  const prompt = `## Found by a search for
${TALENT_CATEGORY_LABELS[input.searchCategory]} · ${SECTOR_LABELS[input.searchSector]}

## Public profile
${input.profileText}

## Persona summary
${renderPersonaProfile(input.persona)}

## Current country (from research)
${input.ukLinks.currentCountry ?? "Unknown"}`;

  const result = await generateJson<Omit<Classification, "nationality"> & { nationality: string }>({
    env,
    system: SYSTEM_PROMPT,
    prompt,
    schema: {
      type: "object",
      required: ["category", "sector", "subSector", "criteria", "residenceRegion", "nationality", "rationale"],
      properties: {
        category: { type: "string", enum: TALENT_CATEGORIES },
        sector: { type: "string", enum: SECTORS },
        subSector: { type: "string" },
        criteria: { type: "string", enum: GTT_CRITERIA },
        residenceRegion: { type: "string", enum: RESIDENCE_REGIONS },
        nationality: { type: "string" },
        rationale: { type: "string" },
      },
    },
  });

  return { ...result, nationality: result.nationality.trim() || null };
}
