import { useEffect, useState } from 'react'
import { Users, Sparkles, RefreshCw, AlertTriangle, ShieldAlert, Scale } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords } from '../lib/parseTalentDocs.js'
import TalentCharts from './TalentCharts.jsx'

const severityColor = { high: 'var(--red)', medium: 'var(--gold)', low: 'var(--text3)' }
const severityBg = {
  high: 'rgba(239,68,68,0.06)', medium: 'rgba(245,158,11,0.06)', low: 'rgba(255,255,255,0.03)',
}
const severityBorder = {
  high: 'rgba(239,68,68,0.25)', medium: 'rgba(245,158,11,0.25)', low: 'var(--border)',
}
const flagIcon = {
  'Level/JD mismatch': ShieldAlert,
  'Rating/narrative mismatch': AlertTriangle,
  'Calibration variance': Scale,
}

export default function TalentManagementModule() {
  const [talentDocs, setTalentDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => { setTalentDocs(getDocumentsByType('talent')) }, [])

  const records = parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n'))

  async function analyze() {
    const combined = talentDocs.map((d) => d.body).join('\n\n---\n\n')
    if (!combined.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docs: combined }),
      })
      if (!res.ok) throw new Error(`Analysis failed (${res.status})`)
      setResult(await res.json())
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 860 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Users size={17} color="var(--magenta)" />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Talent Management</h2>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 480 }}>
            Reads job level, JD, and appraisal records from Document, then flags consistency and
            calibration issues across sites.
          </p>
        </div>
        <button onClick={analyze} disabled={loading || talentDocs.length === 0} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: loading ? 'rgba(184,68,128,0.06)' : 'rgba(184,68,128,0.12)',
          border: '1px solid rgba(184,68,128,0.35)', borderRadius: 8, padding: '9px 18px',
          color: 'var(--magenta)', fontSize: 12.5, fontWeight: 500,
          opacity: (loading || talentDocs.length === 0) ? 0.5 : 1, whiteSpace: 'nowrap',
        }}>
          {loading
            ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Analysing…</>
            : <><Sparkles size={13} /> {result ? 'Re-run analysis' : 'Analyse for inconsistencies'}</>}
        </button>
      </div>

      <TalentCharts records={records} />

      {/* Context strip */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 9,
        padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 28, flexWrap: 'wrap',
      }}>
        {[
          { label: 'Source', value: 'Document repository' },
          { label: 'Talent records', value: talentDocs.length },
          { label: 'Model', value: 'llama-3.3-70b' },
          { label: 'Status', value: talentDocs.length === 0 ? '⚠ No data' : loading ? 'Analysing…' : result ? '✓ Ready' : 'Awaiting' },
        ].map((k) => (
          <div key={k.label}>
            <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3, fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: 12, color: k.label === 'Status' && talentDocs.length === 0 ? 'var(--red)' : k.label === 'Status' && result ? 'var(--green)' : 'var(--text)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {talentDocs.length === 0 && (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
          padding: '48px 32px', textAlign: 'center',
        }}>
          <Users size={26} color="var(--border2)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 13.5, color: 'var(--text3)' }}>No talent data in the repository yet</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', opacity: 0.7, marginTop: 4 }}>
            Add job level, JD, or appraisal records in the Document tab, tagged "Talent data".
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 8 }}>
          <AlertTriangle size={14} color="var(--red)" />
          <span style={{ fontSize: 12.5, color: 'var(--red)' }}>{error}</span>
        </div>
      )}

      {loading && (
        <div style={{ background: 'var(--card)', border: '1px solid rgba(184,68,128,0.25)', borderRadius: 10, padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, color: 'var(--magenta)', marginBottom: 10 }}>✦</div>
          <div style={{ fontSize: 13, color: 'var(--magenta)' }}>Analysing job levels and appraisal data…</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>Usually takes 5–10 seconds</div>
        </div>
      )}

      {result && (
        <>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
            Analysis — {result.flags?.length || 0} item{result.flags?.length === 1 ? '' : 's'} flagged
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {(result.flags || []).map((flag, i) => {
              const Icon = flagIcon[flag.type] || AlertTriangle
              return (
                <div key={i} style={{
                  background: severityBg[flag.severity] || severityBg.low,
                  border: `1px solid ${severityBorder[flag.severity] || severityBorder.low}`,
                  borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10,
                }}>
                  <Icon size={14} color={severityColor[flag.severity] || severityColor.low} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: severityColor[flag.severity] || severityColor.low }}>{flag.type}</span>
                      <span className="chip" style={{ textTransform: 'uppercase' }}>{flag.severity}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.6 }}>{flag.detail}</p>
                    {flag.site && <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, fontFamily: 'var(--mono)' }}>{flag.site}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          {result.narrative && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '24px 28px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={11} /> Leadership Summary
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{result.narrative}</p>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
