import { normaliseCategory, normaliseSector } from "../lib/normalise-import";
import { ALL, type ContactDetails, type CreateSearchBody, type SearchCategoryChoice, type SearchSectorChoice } from "../types";
import { normaliseProfileUrl } from "./discover";

type TalentApiEnv = Pick<CloudflareBindings, "TALENT_API_URL" | "TALENT_API_KEY">;

export type TalentSearch = {
  id: string;
  status: "pending" | "ready" | "failed";
  error?: string | null;
  csv_base64?: string;
};

const MAX_PEOPLE = 50;

async function talentApiRequest(env: TalentApiEnv, path: string, body?: CreateSearchBody): Promise<TalentSearch> {
  const response = await fetch(`${env.TALENT_API_URL.replace(/\/+$/, "")}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-api-key": env.TALENT_API_KEY },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Talent API ${path} failed (${response.status}): ${(await response.text()).slice(0, 1000)}`);
  }
  return (await response.json()) as TalentSearch;
}

export function startTalentSearch(env: TalentApiEnv, request: CreateSearchBody) {
  return talentApiRequest(env, "/api/talent-searches", {
    ...request,
    numResults: Math.min(request.numResults ?? 10, MAX_PEOPLE),
  });
}

export function getTalentSearch(env: TalentApiEnv, id: string) {
  return talentApiRequest(env, `/api/talent-searches/${id}`);
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[index + 1] === "\n") index++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

function decodeCsv(csvBase64: string) {
  const bytes = Uint8Array.from(atob(csvBase64), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes).replace(/^﻿/, "");
}

function profileLink(socialLink: string) {
  const links = socialLink.split(/[\s;,]+/).filter((link) => /^https?:\/\//i.test(link));
  return links.find((link) => /linkedin\.com\/in\//i.test(link)) ?? links[0] ?? null;
}

function contactDetails(row: Record<string, string>, checkedAt: string): ContactDetails | null {
  const emails = row.email ? [row.email] : [];
  const phones = row.phone ? [row.phone] : [];
  if (!emails.length && !phones.length) return null;
  const link = profileLink(row.social_link ?? "");
  return {
    status: "found",
    runId: null,
    emails,
    phones,
    linkedinUrl: link && /linkedin\.com/i.test(link) ? link : null,
    website: null,
    twitter: link && /(^|[/.])(x|twitter)\.com/i.test(link) ? link : null,
    notes: "From the talent agent's search",
    error: null,
    checkedAt,
  };
}

export function talentCsvToCandidates(
  csvBase64: string,
  search: { category: SearchCategoryChoice; sector: SearchSectorChoice },
) {
  const [header = [], ...lines] = parseCsv(decodeCsv(csvBase64));
  const checkedAt = new Date().toISOString();
  return lines.flatMap((line) => {
    const row: Record<string, string> = Object.fromEntries(
      header.map((column, index) => [column, line[index]?.trim() ?? ""]),
    );
    const name = [row.first_name, row.last_name].filter(Boolean).join(" ");
    if (!name) return [];
    const link = profileLink(row.social_link ?? "");
    return [
      {
        name,
        profileUrl: link && /linkedin\.com\/in\//i.test(link) ? normaliseProfileUrl(link) : null,
        title: row.role || null,
        organisation: row.organisation || null,
        headline: [row.role, row.organisation].filter(Boolean).join(" at ") || null,
        nationality: row.nationality || null,
        pictureUrl: row.image_url || null,
        category:
          normaliseCategory(row.type_of_individual) ??
          (search.category === ALL ? ("highly_talented" as const) : search.category),
        sector: normaliseSector(row.priority_sector) ?? (search.sector === ALL ? ("other" as const) : search.sector),
        highlights: [
          `Found by the talent agent as ${row.type_of_individual || "a candidate"} in ${row.priority_sector || "an unspecified sector"}`,
          ...(row.nationality ? [`Nationality: ${row.nationality}`] : []),
        ],
        contact: contactDetails(row, checkedAt),
      },
    ];
  });
}
