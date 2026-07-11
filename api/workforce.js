// Vercel serverless function.
// Env var required: GROQ_API_KEY (set in Vercel project settings, no VITE_ prefix).
// Called server-side only — the key is never exposed to the browser.
//
// Privacy note: only sends pre-aggregated bucket counts (e.g. "25-34: 16"),
// never individual employee records or names.

function buildSystemPrompt() {
  return `You are HRinsight's workforce composition analyst. Given aggregated age, gender,
tenure, and attrition data for a workforce (or a filtered slice of one), write a short narrative
assessment of whether the composition looks healthy.

Consider things like: concentration risk (too much of the workforce clustered in one age or
tenure band), succession risk (thin representation in senior tenure/age bands relative to junior
ones, or the reverse — an ageing workforce with limited pipeline behind it), retention signal
(a lot of the workforce in the earliest tenure band can mean either high growth or high turnover
— note the ambiguity rather than assuming one), gender balance relative to the scope given, and
what the attrition rate (if provided) suggests when read alongside the tenure and age picture —
e.g. attrition concentrated among short-tenure staff reads differently than attrition spread
evenly across tenure bands.

Only reason from the numbers provided. Do not invent causes — describe the pattern and note what
it could indicate, using appropriately hedged language ("this could suggest..." not "this means...").
Keep it grounded and useful for an HR leader deciding whether to dig further, not alarmist.

Return ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{ "narrative": "<4-6 sentence plain-language assessment>" }`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { scope, recordCount, ageData, genderData, tenureData, attritionRate, leaverCount } = req.body || {};
  if (!recordCount || recordCount === 0) {
    return res.status(400).json({ error: 'No records to summarise' });
  }

  const userContent = `SCOPE: ${scope || 'All records'}
TOTAL RECORDS WITH DEMOGRAPHIC DATA: ${recordCount}
ATTRITION RATE THIS CYCLE: ${attritionRate != null ? `${attritionRate}% (${leaverCount} left)` : 'not available'}

AGE DISTRIBUTION:
${(ageData || []).map((d) => `${d.name}: ${d.value}`).join('\n')}

GENDER MIX:
${(genderData || []).map((d) => `${d.name}: ${d.value}`).join('\n')}

YEARS OF SERVICE DISTRIBUTION:
${(tenureData || []).map((d) => `${d.name}: ${d.value}`).join('\n')}`;

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
        max_tokens: 600,
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
      return res.status(502).json({ error: 'Workforce summary engine error' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: 'Could not parse workforce summary result' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
