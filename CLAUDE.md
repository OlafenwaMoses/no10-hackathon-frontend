# CLAUDE.md

Global Talent Radar — a hackathon build for the UK Global Talent Taskforce (GTT). Track 1: a pipeline that finds elite international talent (founders, investors, HNWIs, C-suite, researchers, highly talented individuals) in Digital & Tech, Life Sciences and Clean Energy, assesses how likely each is to relocate to or expand in the UK, finds their existing UK links, and recommends GTT levers. Everything is browsable in the webapp.

The codebase follows the blueprint of Artificial Societies' Radiant app (`~/code/Societies/radiant`) — when in doubt, copy Radiant's shape.

## Commands

```bash
bun i
bun run dev          # frontend + API + Workflows via Nitro's Vite plugin (reads .env.local)
bun run typecheck    # tsc for web + worker — the verification loop
bun run db:generate  # after a schema change: writes a new migration to src/api/drizzle
bun run db:migrate   # apply pending migrations to DATABASE_URL from .dev.vars
bun run db:studio
npx vercel deploy --prod --scope moses-olafenwas-projects   # see VERCEL.md
```

Secrets live in `.dev.vars` locally (copy it to `.env.local` for `bun run dev`) and in the Vercel project's environment variables in production: `DATABASE_URL`, `EXA_API_KEY`, `OPENAI_API_KEY`, `REVERSE_CONTACT_API_KEY` (optional — LinkedIn lookup for manually added people), `APP_PASSWORD` (optional shared password; when set the API requires the `x-app-password` header).

## Architecture

This fork's `main` runs on Vercel (see `VERCEL.md`): React SPA (`src/web`) served as static assets, Hono API under `/api` (`src/api`, mounted by `src/api/server.ts` through Nitro). Environment variables are read in `src/api/env.ts`.

- **Database:** Postgres via Drizzle + postgres-js, `casing: "snake_case"`. Schema in `src/api/db/schema`. Tables: `searches` (one pipeline run), `candidates` (one person, unique on `profile_url`, holds UK links / persona / score as jsonb), `interview_answers` (persona survey answers as probability distributions), `persona_messages` (chat with a persona).
- **Pipeline:** Vercel Workflows (`workflow` package, `"use workflow"` and `"use step"`). `searchWorkflow` (`src/api/workflows/search-workflow.ts`) runs Exa people search, saves new candidates and fans out one `candidateWorkflow` per candidate: enrich UK links (Exa deep search with `outputSchema`) → build persona (LLM) → classify into the GTT Master Tracker taxonomy → interview persona (survey questions answered as probability distributions, ported from the engine's survey prompts) → score.
- **Pipeline modules:** `src/api/pipeline/` — `exa.ts`, `queries.ts`, `discover.ts`, `enrich.ts`, `llm.ts` (all LLM-provider code lives here — OpenAI Responses API with strict `json_schema`, model from the `OPENAI_MODEL` var, currently `gpt-6-luna`), `persona.ts`, `classify.ts`, `interview.ts`, `questions.ts`, `score.ts`, `chat.ts`.
- **Manual add:** `POST /api/candidates` creates a `source: "manual"` candidate (profile URL optional) and starts `candidateWorkflow`, whose first step resolves them: Reverse Contact (by LinkedIn URL, else by name + company — ported from the engine) then Exa people search with a name/organisation identity check (`pipeline/resolve.ts`). Officer-typed details go into the profile text as verified "User Supplied Information", like the engine's `manual_info`.
- **Import:** spreadsheets (.xlsx/.csv, e.g. the Taskforce Master Tracker) are parsed in the browser with SheetJS; mapped rows go to `POST /api/candidates/import` (max 100), which normalises raw type/sector strings (`lib/normalise-import.ts`), skips duplicates (profile URL or name + organisation), and creates a `searches` row with `kind: "import"` whose `searchWorkflow` skips Exa discovery and just dispatches the candidates.
- **Reach out:** contact details are found on demand (never in the pipeline — they cost money) via the Exa Agent API (`pipeline/contact.ts`): `POST /api/candidates/:id/contact` starts a run and stores `contact.runId`; `GET` polls it. Officers record outreach (`outreachStatus`, note, `contactedAt`) with `PATCH /api/candidates/:id/outreach`; `Stats.actioned` counts anyone not `not_contacted`.
- **Net worth:** the UK-links deep search also returns `wealthEvidence`; the classify step turns it into a `netWorth` band + estimate + confidence (UHNWI = $30m+).
- **GTT taxonomy:** mirrors the Taskforce's Master Tracker spreadsheet — Type of Individual (`category`), GTT Priority Sector (`sector`: Digital & Tech, AI, Life Sciences, Clean Energy, Pan-Economy Investors, Other), Criteria, Current residence region, plus a free-text `subSector`. A search targets a category/sector; each candidate is then re-classified from evidence.
- **Scoring:** `overall = 0.45·openness + 0.25·ukLinks + 0.30·prominence`, each 0–100. Openness comes from the expected value of the persona's answer distributions.
- **API contract:** `src/api/types.ts` is shared with the frontend through the `@api-types` alias. The frontend must never import anything else from `src/api` (enforced by the `blockApiImports` Vite plugin).

## Public site (`site/`)

A separate Cloudflare Worker (`global-talent-uk`) in `site/` with its own package.json and wrangler config: Hono server-rendered pages styled with GOV.UK Frontend (prototype branding — no crown or GDS Transport font). It scrapes GOV.UK guides via the public Content API (`https://www.gov.uk/api/content/<path>`) on a cron into KV, and its get-in-touch form POSTs to the talent dashboard's `POST /api/inbound` (shared `INBOUND_SECRET` header, exempt from `APP_PASSWORD`), which creates a `source: "inbound"` candidate, adds them to the shortlist with lead source "website", and runs the pipeline. Keep the two workers separate: the talent tool holds personal data and the public site must never reach it except through `/api/inbound`.

- **Shortlist:** `shortlist_entries` mirrors the Taskforce Master Tracker (stage, priority, RAGs, Full AM/Light-touch, background check, relationship holder, account manager, lead source, next step, origin date, closure fields, failure reason). Logging outreach auto-adds a candidate; importing a tracker with Stage/Account manager columns creates entries.

## Conventions (from Radiant)

- No comments in code, never `any`, no TypeScript enums (const arrays + unions), one component/function per file.
- Frontend: TanStack Router file routes (no loaders), TanStack Query hooks one per file in `src/web/hooks`, Emotion styled components at the bottom of the file, theme tokens only, `motion/react`, Sonner toasts for errors, Zustand only for global UI state.
- Backend: one handler per file in `src/api/routes/<domain>/`, return errors as `c.json({ error }, status)`, Drizzle with camelCase TS, import `id`/`createdAt`/`updatedAt` from `db/schema/helpers.ts`.
- Generated files — never hand-edit: `src/web/routeTree.gen.ts`.
