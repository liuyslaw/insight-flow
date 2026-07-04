// Vercel serverless function.
// Env var required: GROQ_API_KEY (set in Vercel project settings, no VITE_ prefix).
// Called server-side only — the key is never exposed to the browser.

const SYSTEM_PROMPT = `You are InsightFlow's job architecture and appraisal consistency engine.

You will receive a set of records exported from a job architecture / appraisal rollout. Each record
contains a site, a role, an assigned job level, a job description excerpt, an appraisal rating, and
an appraisal narrative.

Reason generally across the whole set — do not use any hardcoded assumptions about specific sites,
roles, or people. For each record, check:
1. Job level vs job description scope — does the seniority implied by the JD text (scope of
   ownership, decision rights, people/budget responsibility) match the assigned level?
2. Appraisal rating vs appraisal narrative — does the narrative's content and tone actually support
   the numeric rating given, or is there a mismatch (e.g. a high rating with generic/thin narrative,
   or a narrative describing strong impact but a middling rating)?
3. Cross-site calibration — are similar-scope roles at different sites being rated or levelled in
   visibly inconsistent ways?

Return ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "flags": [
    { "type": "Level/JD mismatch" | "Rating/narrative mismatch" | "Calibration variance",
      "severity": "high" | "medium" | "low",
      "site": "<site name if applicable>",
      "detail": "<one or two sentence plain-language explanation, specific to what you found>" }
  ],
  "narrative": "<a 4-6 sentence leadership-ready summary of the overall pattern across the set, written plainly, no bullet points>"
}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { docs } = req.body || {};
  if (!docs || typeof docs !== 'string' || !docs.trim()) {
    return res.status(400).json({ error: 'No document content provided' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is not configured with an API key' });
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
        max_tokens: 2000,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: docs },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', errText);
      return res.status(502).json({ error: 'Analysis engine error' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: 'Could not parse analysis result' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
