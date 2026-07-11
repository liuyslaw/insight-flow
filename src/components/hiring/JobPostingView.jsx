import { useEffect, useMemo, useState } from 'react'
import { Sparkles, RefreshCw, AlertTriangle, FileDown, Copy, Check } from 'lucide-react'
import { getDocumentsByType } from '../../data/documentStore.js'
import { parseTalentRecords } from '../../lib/parseTalentDocs.js'

export default function JobPostingView() {
  const [talentRecords, setTalentRecords] = useState([])
  const [selectedIdx, setSelectedIdx] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [customLevel, setCustomLevel] = useState('')
  const [customUnit, setCustomUnit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const talentDocs = getDocumentsByType('talent')
    const all = parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n'))
    // De-duplicate by role+level so the dropdown isn't full of repeats across cycles
    const seen = new Set()
    const unique = all.filter((r) => {
      const key = `${r.role}__${r.level}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    setTalentRecords(unique)
  }, [])

  const usingCustom = selectedIdx === 'custom'
  const selected = usingCustom
    ? { role: customRole, level: customLevel, businessUnit: customUnit, jd: null }
    : talentRecords[selectedIdx]

  async function generate() {
    if (!selected?.role) return
    setLoading(true); setError(null); setResult(null)
    try {
      const input = `ROLE: ${selected.role}\nLEVEL: ${selected.level || 'unspecified'}\nBUSINESS UNIT: ${selected.businessUnit || 'unspecified'}${selected.raw ? `\n\nEXISTING JOB DESCRIPTION (for reference/consistency):\n${selected.raw}` : ''}`
      const res = await fetch('/api/hiring', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'job-posting', input }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setResult(await res.json())
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  function copyText() {
    if (!result?.posting) return
    navigator.clipboard.writeText(result.posting)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 18, maxWidth: 600 }}>
        Draft a job posting from an existing role in Talent Management (keeps scope/seniority
        consistent with your job architecture), or describe a new role from scratch.
      </p>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
          Role
        </div>
        <select
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(e.target.value)}
          style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)', marginBottom: 10 }}
        >
          <option value="">Select an existing role…</option>
          {talentRecords.map((r, i) => (
            <option key={i} value={i}>{r.role} — {r.level}{r.businessUnit ? ` — ${r.businessUnit}` : ''}</option>
          ))}
          <option value="custom">New role (enter manually)</option>
        </select>

        {usingCustom && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <input value={customRole} onChange={(e) => setCustomRole(e.target.value)} placeholder="Role title"
              style={{ flex: 2, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }} />
            <input value={customLevel} onChange={(e) => setCustomLevel(e.target.value)} placeholder="Level"
              style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }} />
            <input value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} placeholder="Business unit"
              style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button onClick={generate} disabled={loading || !selected?.role} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.35)',
            borderRadius: 8, padding: '9px 18px', color: '#16a34a', fontSize: 12.5, fontWeight: 500,
            opacity: (loading || !selected?.role) ? 0.4 : 1,
          }}>
            {loading
              ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Drafting…</>
              : <><Sparkles size={13} /> Draft job posting</>}
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
        <div style={{ background: 'var(--card)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 10, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{result.title}</span>
            <button onClick={copyText} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 10px', color: 'var(--text2)', fontSize: 11 }}>
              {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{result.posting}</p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
