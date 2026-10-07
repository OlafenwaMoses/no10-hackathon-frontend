# Running the dashboard on Vercel

The `main` branch of this fork, [OlafenwaMoses/no10-hackathon-frontend](https://github.com/OlafenwaMoses/no10-hackathon-frontend), runs the dashboard on Vercel instead of Cloudflare Workers. It is a port of the source repo, [magerags/no10-hackathon](https://github.com/magerags/no10-hackathon), which is no longer publicly available. Searches go through the talent agent API (see [TALENT_API.md](TALENT_API.md)). The Cloudflare version with the same talent API integration is kept on the `talent-api-integration` branch.

| What | Where |
| --- | --- |
| Dashboard | https://no10-talent-dashboard.vercel.app (Vercel project `no10-talent-dashboard`, team `moses-olafenwas-projects`) |
| Talent API it calls | https://no10-talent-api.vercel.app (project `no10-talent-api`) |

The dashboard asks for a password: the `APP_PASSWORD` environment variable of the Vercel project.

## What changed from Cloudflare

| Cloudflare | Vercel |
| --- | --- |
| One Worker serves the SPA and the Hono API | [Nitro](https://nitro.build)'s Vite plugin builds both. `src/api/server.ts` handles `/api/**` with the same Hono app. Static files come from the CDN, and any other path gets `index.html`, so client routes work. |
| `SearchWorkflow` and `CandidateWorkflow` (Cloudflare Workflows) | `searchWorkflow` and `candidateWorkflow` ([Vercel Workflows](https://vercel.com/docs/workflows), `workflow` package). Each `step.do` is a `"use step"` function, and `step.sleep` is `sleep()`. |
| `c.env.SEARCH_WORKFLOW.create(...)` | The same call. `src/api/lib/workflow-binding.ts` starts a Vercel Workflow run, and its run id is stored in `searches.workflow_id`. |
| Step retries: 3, from 10 seconds, exponential | Steps retry 3 times, after 10, 20 and 40 seconds (`src/api/lib/with-backoff.ts`). `FatalError` stops retrying, like `NonRetryableError` did. |
| Settings from `wrangler.jsonc` and `wrangler secret` | Vercel environment variables, read in `src/api/env.ts`. `OPENAI_MODEL` defaults to `gpt-6-luna`, as `wrangler.jsonc` set it. |

`wrangler.jsonc`, `worker-configuration.d.ts` and the Cloudflare packages are gone. The project uses Vite 8, which Nitro's Vite builder requires.

The public site in `site/` is still a separate Cloudflare Worker and is not deployed from here.

## Environment variables

| Variable | Type | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Set by the Neon integration | The Postgres database the dashboard reads and writes: Neon `no10-talent-dashboard-db`, free plan, London. Connecting it also adds `DATABASE_URL_UNPOOLED` and `PG*`/`POSTGRES_*` variables, which the app doesn't use. |
| `OPENAI_API_KEY`, `EXA_API_KEY` | Sensitive | The scoring pipeline: UK links, persona, classification, interview and score |
| `REVERSE_CONTACT_API_KEY` | Sensitive | LinkedIn lookup for people added by hand |
| `INBOUND_SECRET` | Sensitive | Checks posts from the public site's get-in-touch form to `/api/inbound` |
| `APP_PASSWORD` | Sensitive | The password the dashboard asks for |
| `TALENT_API_URL` | Plain | `https://no10-talent-api.vercel.app` |
| `TALENT_API_KEY` | Plain | Sent as `x-api-key`. It must match the talent API's `API_KEY`. |

Functions run in London (`lhr1`), like the database. Vercel Workflows needs **Enable access to System Environment Variables** turned on in the project settings. It is on by default.

## Deploy

From a checkout of `main`, with a Vercel token for the `moses-olafenwas-projects` team:

```bash
bun install
bun run typecheck
npx vercel link --project no10-talent-dashboard --scope moses-olafenwas-projects   # first time only
npx vercel deploy --prod --scope moses-olafenwas-projects --token <your Vercel token>
```

Vercel runs `bun run build`. That runs `tsc -b` and then `vite build`, and Nitro writes the Vercel output: the static files, a `__server` function for `/api/**` and `index.html`, and the workflow function at `/.well-known/workflow/v1/flow`.

To watch searches and candidates move through their steps, open the project in the Vercel dashboard and go to **Observability**, then **Workflows**.

## Run it locally

The NO10-Fellows repo runs this dashboard and the talent API together with Docker Compose; see [TALENT_API.md](TALENT_API.md). To run the dashboard on its own:

```bash
cp .dev.vars .env.local    # Nitro reads .env.local; set TALENT_API_URL to a talent API you can reach
bun install
bun run dev                # prints the local URL
```

Locally, workflows run in-process and keep their state in `.workflow-data/`. To inspect runs, open `/_workflow` on the dev server, or run `npx workflow web`.

## Files changed

- **`vite.config.ts`:** `nitro()` and `workflow()` replace `cloudflare()`.
- **`src/api/server.ts` (new):** passes `/api/**` requests to the Hono app, with the environment and both workflow bindings.
- **`src/api/env.ts` (new):** the `Bindings` and `EnvVars` types, and `readEnv()`.
- **`src/api/lib/workflow-binding.ts` and `src/api/lib/with-backoff.ts` (new):** start workflow runs, and space out step retries.
- **`src/api/workflows/search-workflow.ts` and `candidate-workflow.ts`:** rewritten as Vercel Workflow functions. The steps and database writes are the same as before.
- **`src/api/index.ts`:** exports the Hono app; the Cloudflare `fetch` handler and the workflow class exports are gone.
- **`CloudflareBindings` in the API:** replaced by `Bindings` or `EnvVars`.
- **`tsconfig.worker.json`:** Node types instead of Workers types.
- **`package.json`:** adds `nitro` and `workflow`; removes `wrangler`, `@cloudflare/vite-plugin`, and the `deploy` and `cf-typegen` scripts.
