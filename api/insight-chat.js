// Vercel serverless function.
// Env var required: GROQ_API_KEY (set in Vercel project settings, no VITE_ prefix).
// Called server-side only — the key is never exposed to the browser.
//
// Shared by Talent Management and Workforce Insights for follow-up Q&A on
// whatever's currently computed in that module — same underlying pattern as
// api/assistant.js (answer only from provided context) but grounded in
// aggregated analytics data instead of uploaded documents.

const MODULE_FRAMING = {
  talent: `You are HRinsight's Talent Management analyst assistant. The person is looking at
appraisal ratings, talent movement (Rising/Steady/Needs Attention based on year-on-year rating
change), and training completion data for their organisation, possibly filtered by site or
function. Answer questions about what's in the DATA CONTEXT below — trends, specific people
mentioned in it, comparisons across sites or functions, what a flagged inconsistency means.`,
  workforce: `You are HRinsight's Workforce Insights analyst assistant. The person is looking at
headcount, age/gender/tenure composition, and attrition data for their organisation, possibly
filtered by site or function. Answer questions about what's in the DATA CONTEXT below — trends,
concentration risk, what the attrition rate suggests, comparisons across the breakdowns provided.`,
}

function buildSystemPrompt(moduleKey, context) {
  const framing = MODULE_FRAMING[moduleKey] || MODULE_FRAMING.talent
  return `${framing}

Only answer from the DATA CONTEXT below — do not invent figures, names, or facts not present in
it. If the question needs something not in this context (e.g. a different time period, a person
not listed, a metric not computed), say so plainly and suggest what filter or period change might
surface it, rather than guessing. Keep answers short — 2-5 sentences unless the question genuinely
needs a longer breakdown. Use plain language, not jargon.

DATA CONTEXT:
${JSON.stringify(context, null, 2)}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { module: moduleKey, context, question, history } = req.body || {}
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'No question provided' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is not configured with an API key' })
  }

  const messages = [
    { role: 'system', content: buildSystemPrompt(moduleKey, context || {}) },
    ...(Array.isArray(history) ? history.slice(-10) : []),
    { role: 'user', content: question },
  ]

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        temperature: 0.3,
        messages,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq API error:', errText)
      return res.status(502).json({ error: 'Chat engine error' })
    }

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || "I couldn't find an answer to that in the current data."

    return res.status(200).json({ answer })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected server error' })
  }
}
