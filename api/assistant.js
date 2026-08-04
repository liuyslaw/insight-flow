// Vercel serverless function.
// Env var required: GROQ_API_KEY (set in Vercel project settings, no VITE_ prefix).
// Called server-side only — the key is never exposed to the browser.

const POLICIES = [
  {
        title: 'Annual & Medical Leave',
        body: `Annual leave follows Employment Act 1955 minimums, banded by length of service: 8 days a year under 2 years' service, 12 days from 2 to 5 years, and 16 days at 5 years or more, pro-rated in the first year of employment. Unused annual leave of up to 5 days may be carried forward into the following year and must be used by 31 March, after which it lapses. Paid sick leave (outpatient, no hospitalisation) follows the same service bands — 14, 18, and 22 days respectively — with up to 60 days per year in total if hospitalisation is certified necessary. Leave requests should be submitted through the HR system at least 3 working days in advance, except for medical leave.`,
  },
  {
        title: 'Maternity & Paternity Leave',
        body: `Maternity leave is 98 consecutive days, paid, per the Employment Act 1955 amendment effective 1 January 2023 (up from 60 days previously). Paternity leave is 7 consecutive days, paid, for married male employees with at least 12 months of service, limited to the first 5 confinements during their employment. Both should be requested through the HR system as soon as the expected date is known, so cover can be arranged in good time.`,
  },
  {
        title: 'Flexible & Remote Work',
        body: `The standard work week is capped at 45 hours under the Employment Act 1955 amendment effective 1 January 2023 (down from 48 hours previously). Employees in eligible roles may also work remotely up to 2 days per week, subject to manager approval and business needs; core collaboration hours are 10:00–16:00 local time regardless of work location. Separately, any employee may submit a formal Flexible Work Arrangement (FWA) request under Section 60P — covering hours, location, or work pattern — and the employer is required to respond in writing within 60 days of receipt, either approving it or giving reasons for refusal. Submit an FWA request through the Admin Services tab, where the 60-day statutory clock is tracked automatically so nothing slips past the deadline. Roles involving hands-on production, lab, or on-site equipment work may not be eligible for every remote arrangement.`,
  },
  {
        title: 'Performance & Appraisal Cycle',
        body: `The annual appraisal cycle runs from January to December, with a mid-year check-in in June and final review in December. Ratings range from 1 (Below Expectations) to 5 (Outstanding) and are calibrated across each business unit before being finalised. Employees receive their job level and job description as part of onboarding and whenever a role change is confirmed; questions about your assigned level should first be raised with your manager, then escalated to HR if unresolved.`,
  },
  {
        title: 'Benefits & Claims',
        body: `Employees are covered under the group medical and life insurance plan from their first day of employment. Outpatient claims should be submitted within 60 days of the visit through the claims portal, with original receipts retained for 6 months in case of audit. Dependents may be added to the plan within 30 days of a qualifying life event (marriage, birth, etc.).`,
  },
  {
        title: 'Code of Conduct & Grievances',
        body: `All employees are expected to act with integrity, respect, and professionalism. Grievances or concerns about workplace conduct should be raised with your manager in the first instance, or directly with HR or the confidential ethics channel if the concern involves your manager. All reports are handled confidentially and investigated within 10 working days.`,
  },
  ];

const POLICY_TEXT = POLICIES.map((p) => `## ${p.title}\n${p.body}`).join('\n\n');

function buildSystemPrompt(contextText) {
    return `You are an HR self-service assistant answering employee questions using ONLY the
    knowledge base content provided below. Answer in plain, warm, direct language — 2-4 sentences. If
    the question cannot be answered from the content provided, say so clearly and suggest contacting
    HR directly, rather than guessing.

    KNOWLEDGE BASE CONTENT:
    ${contextText}`;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
    }

  const { question, context } = req.body || {};
    if (!question || typeof question !== 'string' || !question.trim()) {
          return res.status(400).json({ error: 'No question provided' });
    }

  const contextText =
        Array.isArray(context) && context.length
        ? context.map((d) => `## ${d.title}\n${d.body}`).join('\n\n')
          : POLICY_TEXT;

  const SYSTEM_PROMPT = buildSystemPrompt(contextText);

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
                          max_tokens: 500,
                          temperature: 0.3,
                          messages: [
                            { role: 'system', content: SYSTEM_PROMPT },
                            { role: 'user', content: question },
                                    ],
                }),
        });

      if (!response.ok) {
              const errText = await response.text();
              console.error('Groq API error:', errText);
              return res.status(502).json({ error: 'Assistant engine error' });
      }

      const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || "I couldn't find an answer to that.";

      return res.status(200).json({ answer });
  } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unexpected server error' });
  }
}
