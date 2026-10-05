# Running the dashboard with the talent agent API

> On this `vercel` branch the dashboard runs on Vercel and calls the deployed talent API. See [VERCEL.md](VERCEL.md). The Docker Compose steps below are for the `talent-api-integration` branch, which still runs on Cloudflare's local runtime.

This dashboard can find people with the talent agent API instead of Exa people search. The API is the `service/` app in the NO10-Fellows repo, which this folder sits inside. When `TALENT_API_URL` is set, a search from the dashboard goes like this:

1. **The search goes to the talent API.** It sends the search form's fields (`category`, `sector`, `region`, `customRegion`, `query` and `numResults`).
2. **The agent runs.** It searches Exa, Linkup and Parallel FindAll, then merges the people it finds into a CSV.
3. **The dashboard waits.** Its search workflow checks the API every 20 seconds, for up to 20 minutes.
4. **Each CSV row becomes a candidate** in the dashboard database:

   | CSV column | Candidate field |
   | --- | --- |
   | First and last name | Name |
   | `role` | Title |
   | `organisation` | Organisation |
   | `type_of_individual` | Type of individual |
   | `priority_sector` | Sector |
   | `nationality` | Nationality |
   | `social_link` | Profile URL (personal LinkedIn profiles only) |
   | `image_url` | Picture, shown as the person's avatar |
   | `email` and `phone` | Contact details |

5. **The usual pipeline runs on each new candidate:** UK links, persona, classification, interview and score. They then appear in **Talent database** and on the search's page.

If `TALENT_API_URL` is not set, searches use Exa people search as before. Spreadsheet imports always work as before.

## Run it

Everything runs with Docker Compose from the NO10-Fellows folder (the parent of this one).

```bash
cd ..                          # the NO10-Fellows folder
docker compose up --build      # first run: builds both images and installs packages
```

When the dashboard log shows `VITE ... ready`, open:

| What | Where |
| --- | --- |
| Dashboard | http://localhost:5173 |
| Talent API | http://localhost:8000, with interactive docs at http://localhost:8000/docs |

Other commands, also run from the NO10-Fellows folder:

```bash
docker compose up -d --build            # run in the background
docker compose logs -f api              # watch the agent work (tool calls, timings)
docker compose logs -f frontend         # dashboard and workflow logs
docker compose restart frontend         # after editing .dev.vars
docker compose down                     # stop both
```

## Configuration

The dashboard reads `.dev.vars` in this folder. It is a copy of `NO10-Fellows/.env_frontend` with the talent API settings added, and git ignores it.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | The Postgres database the dashboard reads and writes |
| `EXA_API_KEY`, `OPENAI_API_KEY` | The dashboard's own pipeline: UK links, persona, classification, interview and score |
| `APP_PASSWORD` | The password the dashboard asks for |
| `REVERSE_CONTACT_API_KEY`, `INBOUND_SECRET` | Manual adds and the public site's inbound form |
| `TALENT_API_URL` | The talent API: `http://api:8000` inside Docker Compose |
| `TALENT_API_KEY` | Sent as `x-api-key`. It must match `API_KEY` in `NO10-Fellows/.env`. |

The talent API reads its own keys (OpenAI, Exa, Linkup and Parallel) from `NO10-Fellows/.env`.

## Search and see the results

1. Open http://localhost:5173 and enter the `APP_PASSWORD` if asked.
2. Go to **Searches**, then **New search**.
3. Choose a type of individual, a sector, a region and the number of people. Optionally, add a custom query.
4. Select **Start search**.
5. Watch the search's status:
   - **Discovering** while the agent runs, usually 3 to 7 minutes.
   - **Processing** while each person goes through the dashboard pipeline.
   - **Complete** when everyone is scored.
6. Open the search to see its people. They are also in **Talent database**. Where the agent found an email or phone number, it's in the person's contact details.

The talent API caches each search. Running the same choices again, or the same custom query, reuses the stored CSV instead of running the agent. Candidates whose profile URL is already in the database aren't added a second time. The cache lives in `NO10-Fellows/api-cache/`, and deleting a search's files there makes it run again.

## Without Docker

1. Start the API from the NO10-Fellows folder:

   ```bash
   LOCAL_DATA_DIR=api-cache .venv/bin/uvicorn service.app:app --port 8000 --env-file .env
   ```

2. In this folder's `.dev.vars`, set `TALENT_API_URL=http://localhost:8000`.
3. Run `bun i`, then `bun run dev`. Node.js must be installed, because Vite runs on Node.

## Troubleshooting

| Problem | Cause and fix |
| --- | --- |
| Dashboard API errors with `Network connection lost` | The local Workers runtime can't verify TLS to Postgres. The compose image installs `ca-certificates` for this; rebuild with `docker compose up --build`. |
| Dev server stops with `Unable to connect. Is the computer able to access the url?` | Vite is running on Bun instead of Node. Use the compose image, or install Node.js. |
| Search fails with `Talent API ... failed (401)` | `TALENT_API_KEY` in `.dev.vars` doesn't match the API's `API_KEY`. |
| Search fails with `Talent API ... failed (422)` | The API rejected the search. A custom query can be at most 1,000 characters, a custom region at most 60, and the number of people at most 50. |
| Search fails with `Talent API search failed` | The agent run failed. See `docker compose logs api`, then start the search again. |

## Files changed in this repo

- **`src/api/pipeline/talent-api.ts` (new):** calls the talent API and turns its CSV into candidates.
- **`src/api/workflows/search-workflow.ts`:** uses the talent API for discovery when `TALENT_API_URL` is set.
- **`src/api/routes/searches/create.ts`:** passes the search form's fields to the workflow.
- **`worker-configuration.d.ts`:** regenerated with `bun run cf-typegen` for the two new variables.
