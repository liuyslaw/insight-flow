# InsightFlow

HR intelligence layer for the Frencken / Theo van de Pol pitch (09 July 2026).

## Structure

One shared document intake, two modules that read from it:

1. **Document** — single repository for everything: job architecture/appraisal exports, company policies, onboarding material. Tag each document as "Talent data" or "Policy / admin" on the way in.
2. **Talent Management** — reads the talent-tagged documents and flags job level/JD mismatches, appraisal rating/narrative gaps, and cross-site calibration variance, with a leadership-ready summary.
3. **Admin Services** — reads the policy-tagged documents and answers employee questions from them directly, live.

**Phase 1 scope, deliberately:** no connection to any live HR or payroll system. Frencken would manually upload documents into the Document tab. See `projects/InsightFlow-context.md` for the reasoning.

Runs on the **Groq API** (`llama-3.3-70b-versatile`) for this demo. Both `/api/analyze` and `/api/assistant` calls happen server-side in Vercel functions — the key is never sent to the browser.

Matches AuditLogic's actual design system exactly: ink `#111113`, card `#1c1c1f`, text `#e4e4e7`, gold `#f59e0b`, magenta `#B84480`, blue `#3b82f6`, green `#22c55e`, Inter + DM Mono, lucide-react icons, tinted-ghost buttons, top bar + sidebar hybrid layout. Confirmed against the live AuditLogic source (github.com/liuyslaw/AduitLogit) — not a guess.

## Deploying (GitHub → Vercel)

1. Create a new GitHub repo and upload this zip's contents via the GitHub web UI (drag and drop, or "Add file → Upload files") — upload the **contents** of this folder, not the zip itself.
2. In Vercel, import the repo as a new project. Framework preset: **Vite**.
3. In the Vercel project's Environment Variables, add:
   - `GROQ_API_KEY` = your Groq API key
   - **No `VITE_` prefix** — used server-side only, inside `/api`.
4. Deploy. Vercel automatically picks up `api/analyze.js` and `api/assistant.js` as serverless functions.

## Local development

```
npm install
npm run dev
```

`npm run dev` only serves the frontend. For the `/api` routes locally:

```
npm install -g vercel
vercel dev
```

Set `GROQ_API_KEY` in a local `.env` file (gitignored) if testing locally with `vercel dev`.

## Files

```
src/App.jsx                              — sidebar shell, 3-module switcher
src/components/DocumentModule.jsx        — Module 01: shared document intake
src/components/TalentManagementModule.jsx — Module 02: consistency/calibration engine
src/components/AdminServicesModule.jsx   — Module 03: employee self-service Q&A
src/data/documentStore.js                — shared localStorage document repository
src/data/sampleTalentDocs.js             — 50-employee sample seeded into Document
src/data/policies.js                     — sample policy set seeded into Document
api/analyze.js                           — serverless function, consistency engine
api/assistant.js                         — serverless function, Q&A over repository docs
```

## Before the Theo meeting

- [ ] Deploy to Vercel and test the live URL, not just localhost
- [ ] Confirm the GitHub repo actually contains every file listed above (check via github.com, not just the upload confirmation — a previous upload silently dropped files)
- [ ] Test all three tabs on iPhone Safari
- [ ] Run the Talent Management analysis at least twice to confirm consistent, sensible output
- [ ] Ask 3-4 questions in Admin Services to confirm answers stay grounded in the repository content
