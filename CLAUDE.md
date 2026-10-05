# CLAUDE.md

Global Talent Radar — a hackathon build for the UK Global Talent Taskforce (GTT). Track 1: a pipeline that finds elite international talent (founders, investors, HNWIs, C-suite, researchers, highly talented individuals) in Digital & Tech, Life Sciences and Clean Energy, assesses how likely each is to relocate to or expand in the UK, finds their existing UK links, and recommends GTT levers. Everything is browsable in the webapp.

The codebase follows the blueprint of Artificial Societies' Radiant app (`~/code/Societies/radiant`) — when in doubt, copy Radiant's shape.

## Commands

```bash
bun i
bun run dev          # frontend + API + Workflows via the Cloudflare Vite plugin
bun run typecheck    # tsc for web + worker — the verification loop
bun run db:generate  # after a schema change: writes a new migration to src/api/drizzle
bun run db:migrate   # apply pending migrations to DATABASE_URL from .dev.vars
bun run db:studio
bun run cf-typegen   # after wrangler.jsonc or .dev.vars changes
bun run deploy
```

Secrets live in `.dev.vars` locally (see `.dev.vars.example`) and `wrangler secret put` in production: `DATABASE_URL`, `EXA_API_KEY`, `OPENAI_API_KEY`, `REVERSE_CONTACT_API_KEY` (optional — LinkedIn lookup for manually added people), `APP_PASSWORD` (optional shared password; when set the API requires the `x-app-password` header).

## Architecture

Single Cloudflare Worker: React SPA (`src/web`) served as assets, Hono API under `/api` (`src/api`).

- **Database:** Postgres via Drizzle + postgres-js, `casing: "snake_case"`. Schema in `src/api/db/schema`. Tables: `searches` (one pipeline run), `candidates` (one person, unique on `profile_url`, holds UK links / persona / score as jsonb), `interview_answers` (persona survey answers as probability distributions), `persona_messages` (chat with a persona).
- **Pipeline:** Cloudflare Workflows. `SearchWorkflow` (`src/api/workflows/search-workflow.ts`) runs Exa people search, saves new candidates and fans out one `CandidateWorkflow` per candidate: enrich UK links (Exa deep search with `outputSchema`) → build persona (LLM) → classify into the GTT Master Tracker taxonomy → interview persona (survey questions answered as probability distributions, ported from the engine's survey prompts) → score.
- **Pipeline modules:** `src/api/pipeline/` — `exa.ts`, `queries.ts`, `discover.ts`, `enrich.ts`, `llm.ts` (all LLM-provider code lives here — OpenAI Responses API with strict `json_schema`, model from the `OPENAI_MODEL` var, currently `gpt-6-luna`), `persona.ts`, `classify.ts`, `interview.ts`, `questions.ts`, `score.ts`, `chat.ts`.
- **Manual add:** `POST /api/candidates` creates a `source: "manual"` candidate (profile URL optional) and starts `CandidateWorkflow`, whose first step resolves them: Reverse Contact (by LinkedIn URL, else by name + company — ported from the engine) then Exa people search with a name/organisation identity check (`pipeline/resolve.ts`). Officer-typed details go into the profile text as verified "User Supplied Information", like the engine's `manual_info`.
- **GTT taxonomy:** mirrors the Taskforce's Master Tracker spreadsheet — Type of Individual (`category`), GTT Priority Sector (`sector`: Digital & Tech, AI, Life Sciences, Clean Energy, Pan-Economy Investors, Other), Criteria, Current residence region, plus a free-text `subSector`. A search targets a category/sector; each candidate is then re-classified from evidence.
- **Scoring:** `overall = 0.45·openness + 0.25·ukLinks + 0.30·prominence`, each 0–100. Openness comes from the expected value of the persona's answer distributions.
- **API contract:** `src/api/types.ts` is shared with the frontend through the `@api-types` alias. The frontend must never import anything else from `src/api` (enforced by the `blockApiImports` Vite plugin).

## Conventions (from Radiant)

- No comments in code, never `any`, no TypeScript enums (const arrays + unions), one component/function per file.
- Frontend: TanStack Router file routes (no loaders), TanStack Query hooks one per file in `src/web/hooks`, Emotion styled components at the bottom of the file, theme tokens only, `motion/react`, Sonner toasts for errors, Zustand only for global UI state.
- Backend: one handler per file in `src/api/routes/<domain>/`, return errors as `c.json({ error }, status)`, Drizzle with camelCase TS, import `id`/`createdAt`/`updatedAt` from `db/schema/helpers.ts`.
- Generated files — never hand-edit: `src/web/routeTree.gen.ts`, `worker-configuration.d.ts`.
