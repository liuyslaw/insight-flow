// Vercel serverless function.
// Env var required: GROQ_API_KEY (set in Vercel project settings, no VITE_ prefix).
// Called server-side only — the key is never exposed to the browser.
//
// Handles four hiring-assist tasks via the `task` field. CV screening is
// deliberately a summarization task, never a ranking/scoring one — see the
// prompt below. This is a compliance-driven design choice, not an oversight:
// AI systems that score/filter/rank job applicants are treated as high-risk
// under the EU AI Act (relevant given the Eindhoven site) and raise similar
// concerns under Singapore's Tripartite Fair Employment Guidelines. Keeping
// this as "here's what matches, here's the gap" with no score keeps a human
// making every actual decision.

const PROMPTS = {
  'job-posting': () => `You are InsightFlow's hiring assistant. Draft a professional job posting
for the role described below, in the same voice and structure a real job board posting would use:
a short company/team blurb, a role summary, a bulleted list of key responsibilities, and a bulleted
list of requirements (split "required" from "nice to have" if there's enough information).
Base the seniority and scope of the posting on the level and any existing job description content
provided — do not invent responsibilities that contradict what's given.

Return ONLY valid JSON, no markdown fences, no preamble:
{ "title": "<job title>", "posting": "<the full posting text, well-formatted with line breaks>" }`,

  'cv-screen': () => `You are InsightFlow's CV screening assistant. Compare the candidate's CV
against the target job description and produce a factual summary of fit — NOT a score, NOT a
ranking, NOT a recommendation to hire or reject. Your job is to help a human reviewer read faster,
not to make the decision for them.

For each CV, identify: what in the candidate's background matches what the role asks for, what
appears to be missing or unclear relative to the role's requirements, and any relevant experience
worth the reviewer's attention that isn't an exact keyword match. Do not infer protected
characteristics (age, gender, marital status, religion, nationality unless directly job-relevant
like a work permit requirement, etc.) even if visible in the CV, and do not let them influence the
summary. Stay factual and neutral — no "strong candidate" or "highly recommend" language.

Return ONLY valid JSON, no markdown fences, no preamble:
{ "matches": ["<point of alignment with the role>", ...], "gaps": ["<missing or unclear relative to the role>", ...], "notes": "<1-2 sentences of other relevant context, neutral tone>" }`,

  'interview-questions': () => `You are InsightFlow's interview prep assistant. Given the job
description below, generate a structured interview question set: a mix of role-specific/technical
questions and behavioural questions, plus a short scorecard of the competency areas an interviewer
should evaluate. Base questions on what the JD actually describes — don't invent unrelated skills.

Return ONLY valid JSON, no markdown fences, no preamble:
{
  "technicalQuestions": ["<question>", ...],
  "behaviouralQuestions": ["<question>", ...],
  "scorecardAreas": ["<competency area to rate>", ...]
}`,

  'offer-letter': () => `You are InsightFlow's offer letter drafting assistant. Draft a professional,
warm but formal offer letter using the candidate and role details provided. Use placeholder
bracketed text like [Company Letterhead] or [HR Contact Name] for anything not supplied. Keep it
to the structure a real offer letter would have: greeting, role/title/level, start date, brief
reporting line, a closing paragraph, and a signature block placeholder.

Return ONLY valid JSON, no markdown fences, no preamble:
{ "letter": "<the full offer letter text, well-formatted with line breaks>" }`,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { task, input } = req.body || {}
  if (!task || !PROMPTS[task]) {
    return res.status(400).json({ error: 'Unknown or missing task' })
  }
  if (!input || typeof input !== 'string' || !input.trim()) {
    return res.status(400).json({ error: 'No input provided' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is not configured with an API key' })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1800,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: PROMPTS[task]() },
          { role: 'user', content: input },
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq API error:', errText)
      return res.status(502).json({ error: 'Hiring assist engine error' })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || '{}'
    const cleaned = text.replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return res.status(502).json({ error: 'Could not parse result' })
    }

    return res.status(200).json(parsed)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected server error' })
  }
}
