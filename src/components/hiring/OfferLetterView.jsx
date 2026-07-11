import { useState } from 'react'
import { Sparkles, RefreshCw, AlertTriangle, FileDown } from 'lucide-react'
import { buildOfferLetterDocx } from '../../lib/buildOfferLetter.js'

export default function OfferLetterView() {
  const [candidateName, setCandidateName] = useState('')
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('')
  const [site, setSite] = useState('')
  const [startDate, setStartDate] = useState('')
  const [salary, setSalary] = useState('')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const fieldStyle = { flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }

  async function generate() {
    if (!candidateName.trim() || !role.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const input = `CANDIDATE NAME: ${candidateName}\nROLE: ${role}\nLEVEL: ${level || 'unspecified'}\nSITE: ${site || 'unspecified'}\nSTART DATE: ${startDate || 'to be confirmed'}\nCOMPENSATION: ${salary || 'to be confirmed'}`
      const res = await fetch('/api/hiring', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'offer-letter', input }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setResult(await res.json())
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  async function exportWord() {
    if (!result?.letter) return
    setExporting(true)
    try {
      await buildOfferLetterDocx(result.letter, candidateName)
    } catch (err) {
      setError('Could not generate the Word document. Try again.')
    } finally { setExporting(false) }
  }

  return (
    <div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 18, maxWidth: 600 }}>
        Draft an offer letter from candidate and role details, then export as Word to finalise on
        letterhead.
      </p>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
          Details
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Candidate name" style={{ ...fieldStyle, flexBasis: '48%' }} />
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role title" style={{ ...fieldStyle, flexBasis: '48%' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Level (optional)" style={fieldStyle} />
          <input value={site} onChange={(e) => setSite(e.target.value)} placeholder="Site (optional)" style={fieldStyle} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <input value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start date (optional)" style={fieldStyle} />
          <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Compensation (optional)" style={fieldStyle} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={generate} disabled={loading || !candidateName.trim() || !role.trim()} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.35)',
            borderRadius: 8, padding: '9px 18px', color: '#16a34a', fontSize: 12.5, fontWeight: 500,
            opacity: (loading || !candidateName.trim() || !role.trim()) ? 0.4 : 1,
          }}>
            {loading
              ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Drafting…</>
              : <><Sparkles size={13} /> Draft offer letter</>}
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={exportWord} disabled={exporting} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card2)',
              border: '1px solid var(--border)', borderRadius: 7, padding: '7px 12px',
              color: 'var(--text2)', fontSize: 11.5, opacity: exporting ? 0.5 : 1,
            }}>
              <FileDown size={12} /> {exporting ? 'Preparing…' : 'Export as Word'}
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{result.letter}</p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
