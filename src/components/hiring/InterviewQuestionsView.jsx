import { useEffect, useState } from 'react'
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react'
import { getUniqueRolesWithJD, formatRoleAsJD } from '../../lib/getUniqueRoles.js'

export default function InterviewQuestionsView() {
  const [existingRoles, setExistingRoles] = useState([])
  const [roleSelection, setRoleSelection] = useState('')
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => { setExistingRoles(getUniqueRolesWithJD()) }, [])

  function handleRoleSelect(value) {
    setRoleSelection(value)
    if (value === '' || value === 'custom') return
    const role = existingRoles[Number(value)]
    if (role) setJdText(formatRoleAsJD(role))
  }

  async function generate() {
    if (!jdText.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/hiring', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'interview-questions', input: jdText }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setResult(await res.json())
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 18, maxWidth: 600 }}>
        Paste a job description to generate a structured interview question set — technical/role
        questions, behavioural questions, and a competency scorecard for the interviewer.
      </p>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
          Job description
        </div>
        <select
          value={roleSelection}
          onChange={(e) => handleRoleSelect(e.target.value)}
          style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)', marginBottom: 10 }}
        >
          <option value="">Select an existing role to prefill…</option>
          {existingRoles.map((r, i) => (
            <option key={i} value={i}>{r.role} — {r.level}{r.businessUnit ? ` — ${r.businessUnit}` : ''}</option>
          ))}
          <option value="custom">Paste a JD manually instead</option>
        </select>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description here, or select an existing role above…"
          style={{ width: '100%', height: 130, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: 12.5, lineHeight: 1.6, color: 'var(--text)', resize: 'vertical', marginBottom: 12 }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={generate} disabled={loading || !jdText.trim()} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.35)',
            borderRadius: 8, padding: '9px 18px', color: '#16a34a', fontSize: 12.5, fontWeight: 500,
            opacity: (loading || !jdText.trim()) ? 0.4 : 1,
          }}>
            {loading
              ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
              : <><Sparkles size={13} /> Generate questions</>}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 8 }}>
          <AlertTriangle size={14} color="var(--red)" />
          <span style={{ fontSize: 12.5, color: 'var(--red)' }}>{error}</span>
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>Technical / Role-Specific</div>
            <ol style={{ paddingLeft: 18, margin: 0 }}>
              {(result.technicalQuestions || []).map((q, i) => <li key={i} style={{ fontSize: 12.5, color: 'var(--text2)', marginBottom: 7, lineHeight: 1.5 }}>{q}</li>)}
            </ol>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--magenta)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>Behavioural</div>
            <ol style={{ paddingLeft: 18, margin: 0 }}>
              {(result.behaviouralQuestions || []).map((q, i) => <li key={i} style={{ fontSize: 12.5, color: 'var(--text2)', marginBottom: 7, lineHeight: 1.5 }}>{q}</li>)}
            </ol>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>Scorecard Areas</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(result.scorecardAreas || []).map((a, i) => (
                <span key={i} className="chip">{a}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
