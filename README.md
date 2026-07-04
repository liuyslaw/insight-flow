# InsightFlow

HR intelligence layer for the Frencken / Theo van de Pol pitch (09 July 2026). Two working demo modules:

1. **Job & Appraisal Consistency Intelligence** — paste/upload job level, JD, and appraisal export text; the engine flags level/JD mismatches, rating/narrative mismatches, and cross-site calibration variance, and writes a leadership-ready summary. Sample data: 50 placeholder employee records, 10 each across Singapore, Penang (MY), Johor (MY), Eindhoven (NL), and Suzhou (CN), with real anomalies seeded in so the demo has something genuine to catch.
2. **Employee Self-Service Assistant** — a chat assistant that answers generic HR questions from a bundled set of placeholder HR policies.

Runs on the **Groq API** (`llama-3.3-70b-versatile`) for this demo — fast and low-cost at this data volume. Both calls happen server-side in Vercel functions; the key is never sent to the browser.

Optimised primarily for desktop/laptop use (wider layout, larger panels) since that's how this will be demoed, but stays responsive down to phone.

**Phase 1 scope, deliberately:** no connection to Workday or any live HR system. Frencken would manually export/upload documents. This is by design — see `projects/InsightFlow-context.md` for the reasoning.

## Deploying (GitHub → Vercel)

1. Create a new GitHub repo (e.g. `liuyslaw/insightflow`) and upload this zip's contents via the GitHub web UI (drag and drop, or "Add file → Upload files").
2. In Vercel, import the new repo as a new project. Framework preset: **Vite**.
3. In the Vercel project's Environment Variables, add:
   - `GROQ_API_KEY` = your Groq API key
   - **No `VITE_` prefix** — this key is used server-side only, inside `/api`, and must never be exposed to the browser. (Note: this differs from the FXFlow pattern, which used a `VITE_`-prefixed key for a client-side call — done deliberately here since InsightFlow calls the API from serverless functions instead.)
4. Deploy. Vercel will build the Vite frontend and automatically pick up `api/analyze.js` and `api/assistant.js` as serverless functions.

## Local development

```
npm install
npm run dev
```

Note: `npm run dev` only serves the frontend. The `/api` routes need Vercel's dev server to run locally:

```
npm install -g vercel
vercel dev
```

Set `GROQ_API_KEY` in a local `.env` file (already gitignored) if testing locally with `vercel dev`.

## Files

```
src/App.jsx                        — tab shell, header
src/components/ConsistencyModule.jsx  — Module 1 UI
src/components/AssistantModule.jsx    — Module 2 UI
src/data/sampleTalentDocs.js       — "Load sample export" content for Module 1
src/data/policies.js               — placeholder policy set shown in the UI
api/analyze.js                     — serverless function, consistency engine
api/assistant.js                   — serverless function, self-service assistant
```

## Before the Theo meeting

- [ ] Deploy to Vercel and test the live URL, not just localhost
- [ ] Test both modules on iPhone Safari (per standing workflow)
- [ ] Run the "Load sample export" flow at least twice to confirm consistent, sensible output
- [ ] Ask 3-4 of the starter questions in the assistant to confirm answers stay grounded in the policy set
