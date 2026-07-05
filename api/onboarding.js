// Vercel serverless function.
// Env var required: GROQ_API_KEY (set in Vercel project settings, no VITE_ prefix).
// Called server-side only — the key is never exposed to the browser.

function buildSystemPrompt() {
  return `You are InsightFlow's onboarding planning engine. Given a new hire's role, level, and
site, plus the organisation's onboarding templates and relevant policies, produce a tailored
onboarding plan.

Reason generally from whatever templates and policies are provided — do not invent company-specific
facts that aren't in the provided content. Where the templates give general guidance, adapt it
specifically to the role/level/site given.

Return ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "checklist": {
    "day1": ["<task>", ...],
    "week1": ["<task>", ...],
    "month1": ["<task>", ...]
  },
  "managerBrief": "<a 4-6 sentence brief for the hiring manager: what this role covers, what success looks like in the first 90 days, and any policy or compliance points to flag to the new hire early — written plainly>"
}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, level, site, templates, policies } = req.body || {};
  if (!role || typeof role !== 'string') {
    return res.status(400).json({ error: 'No role provided' });
  }

  const templateText = Array.isArray(templates) && templates.length
    ? templates.map((t) => `## ${t.title}\n${t.body}`).join('\n\n')
    : 'No onboarding templates provided — use general best practice.';

  const policyText = Array.isArray(policies) && policies.length
    ? policies.map((p) => `## ${p.title}\n${p.body}`).join('\n\n')
    : 'No policy documents provided.';

  const userContent = `NEW HIRE: ${role}, Level ${level || 'unspecified'}, Site: ${site || 'unspecified'}

ONBOARDING TEMPLATES:
${templateText}

RELEVANT POLICIES:
${policyText}`;

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
        max_tokens: 1500,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', errText);
      return res.status(502).json({ error: 'Onboarding engine error' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: 'Could not parse onboarding plan result' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
