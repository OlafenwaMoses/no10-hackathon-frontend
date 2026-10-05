import {
  GTT_CRITERIA,
  GTT_CRITERIA_LABELS,
  NET_WORTH_BANDS,
  NET_WORTH_BAND_LABELS,
  RESIDENCE_REGIONS,
  RESIDENCE_REGION_LABELS,
  SECTORS,
  SECTOR_LABELS,
  TALENT_CATEGORIES,
  TALENT_CATEGORY_LABELS,
  type Classification,
  type NetWorth,
  type NetWorthBand,
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

8. Net worth: estimate the person's personal net worth in USD.
- netWorthBand: one of
${optionList(NET_WORTH_BANDS, NET_WORTH_BAND_LABELS)}
- netWorthEstimateUsd: your point estimate in USD as a plain number, or 0 when the band is unknown.
- netWorthConfidence: high only with sourced figures (rich lists, disclosed exit proceeds or stakes); medium when inferred from concrete facts such as founding a company with a known valuation or a senior role at a large public company; low when inferred only from seniority and sector.
- netWorthBasis: one sentence on what the estimate rests on.
Use the wealth evidence when present. Founders of venture-backed companies usually hold meaningful equity; weigh company valuation, funding raised, exits and years in senior roles. Use unknown only when there is genuinely nothing to go on. UHNWI means $30m or more.

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
): Promise<{ classification: Classification; netWorth: NetWorth }> {
  const prompt = `## Found by a search for
${TALENT_CATEGORY_LABELS[input.searchCategory]} · ${SECTOR_LABELS[input.searchSector]}

## Public profile
${input.profileText}

## Persona summary
${renderPersonaProfile(input.persona)}

## Current country (from research)
${input.ukLinks.currentCountry ?? "Unknown"}

## Wealth evidence (from research)
${input.ukLinks.wealthEvidence || "None found"}`;

  const result = await generateJson<
    Omit<Classification, "nationality"> & {
      nationality: string;
      netWorthBand: NetWorthBand;
      netWorthEstimateUsd: number;
      netWorthConfidence: NetWorth["confidence"];
      netWorthBasis: string;
    }
  >({
    env,
    system: SYSTEM_PROMPT,
    prompt,
    schema: {
      type: "object",
      required: [
        "category",
        "sector",
        "subSector",
        "criteria",
        "residenceRegion",
        "nationality",
        "rationale",
        "netWorthBand",
        "netWorthEstimateUsd",
        "netWorthConfidence",
        "netWorthBasis",
      ],
      properties: {
        category: { type: "string", enum: TALENT_CATEGORIES },
        sector: { type: "string", enum: SECTORS },
        subSector: { type: "string" },
        criteria: { type: "string", enum: GTT_CRITERIA },
        residenceRegion: { type: "string", enum: RESIDENCE_REGIONS },
        nationality: { type: "string" },
        rationale: { type: "string" },
        netWorthBand: { type: "string", enum: NET_WORTH_BANDS },
        netWorthEstimateUsd: { type: "number" },
        netWorthConfidence: { type: "string", enum: ["high", "medium", "low"] },
        netWorthBasis: { type: "string" },
      },
    },
  });

  const { netWorthBand, netWorthEstimateUsd, netWorthConfidence, netWorthBasis, ...classification } = result;
  const known = netWorthBand !== "unknown" && netWorthEstimateUsd > 0;
  return {
    classification: { ...classification, nationality: classification.nationality.trim() || null },
    netWorth: {
      band: netWorthBand,
      estimateUsd: known ? Math.round(netWorthEstimateUsd) : null,
      confidence: netWorthConfidence,
      basis: netWorthBasis.trim(),
    },
  };
}
