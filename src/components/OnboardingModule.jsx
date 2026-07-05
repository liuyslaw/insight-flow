import { useEffect, useState } from 'react'
import { UserPlus, Sparkles, RefreshCw, AlertTriangle, CheckSquare, Square, FileText } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords } from '../lib/parseTalentDocs.js'

export default function OnboardingModule() {
  const [templates, setTemplates] = useState([])
  const [policyDocs, setPolicyDocs] = useState([])
  const [talentRecords, setTalentRecords] = useState([])
  const [selectedIdx, setSelectedIdx] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [customLevel, setCustomLevel] = useState('')
  const [customSite, setCustomSite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    setTemplates(getDocumentsByType('onboarding'))
    setPolicyDocs(getDocumentsByType('policy'))
    const talentDocs = getDocumentsByType('talent')
    setTalentRecords(parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n')))
  }, [])

  const usingCustom = selectedIdx === 'custom'
  const selected = usingCustom
    ? { role: customRole, level: customLevel, site: customSite }
    : talentRecords[selectedIdx]

  async function generate() {
    if (!selected?.role) return
    setLoading(true); setError(null); setResult(null); setChecked({})
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selected.role,
          level: selected.level,
          site: selected.site,
          templates: templates.map((t) => ({ title: t.title, body: t.body })),
          policies: policyDocs.map((p) => ({ title: p.title, body: p.body })),
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setResult(await res.json())
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  function toggle(section, i) {
    const key = `${section}-${i}`
    setChecked((c) => ({ ...c, [key]: !c[key] }))
  }

  const sections = [
    { key: 'day1', label: 'Day 1' },
    { key: 'week1', label: 'Week 1' },
    { key: 'month1', label: 'Month 1' },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <UserPlus size={17} color="var(--green)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Onboarding</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 560, marginBottom: 20 }}>
        Combines role data from Talent Management, policies from Admin Services, and onboarding
        templates from Document into a tailored Day 1 / Week 1 / Month 1 checklist and manager
        brief — generated in seconds instead of assembled by hand each time.
      </p>

      {/* Selection */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
          Who is this for?
        </div>
        <select
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(e.target.value)}
          style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)', marginBottom: 10 }}
        >
          <option value="">Select from Talent Management records…</option>
          {talentRecords.map((r, i) => (
            <option key={i} value={i}>{r.role} — {r.level} — {r.site}</option>
          ))}
          <option value="custom">Custom (enter manually)</option>
        </select>

        {usingCustom && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <input value={customRole} onChange={(e) => setCustomRole(e.target.value)} placeholder="Role"
              style={{ flex: 2, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }} />
            <input value={customLevel} onChange={(e) => setCustomLevel(e.target.value)} placeholder="Level"
              style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }} />
            <input value={customSite} onChange={(e) => setCustomSite(e.target.value)} placeholder="Site"
              style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
            {templates.length} onboarding template{templates.length === 1 ? '' : 's'} · {policyDocs.length} polic{policyDocs.length === 1 ? 'y' : 'ies'} loaded
          </span>
          <button onClick={generate} disabled={loading || !selected?.role} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)',
            borderRadius: 8, padding: '9px 18px', color: 'var(--green)', fontSize: 12.5, fontWeight: 500,
            opacity: (loading || !selected?.role) ? 0.4 : 1,
          }}>
            {loading
              ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
              : <><Sparkles size={13} /> Generate onboarding plan</>}
          </button>
        </div>
      </div>

      {templates.length === 0 && (
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 9, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: 'var(--gold)' }}>
          No onboarding templates in the repository — add one in Document (tag it "Onboarding") for better results, or generate from general best practice as-is.
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 8 }}>
          <AlertTriangle size={14} color="var(--red)" />
          <span style={{ fontSize: 12.5, color: 'var(--red)' }}>{error}</span>
        </div>
      )}

      {result && (
        <>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
            {sections.map((s) => (
              <div key={s.key} style={{ flex: '1 1 260px', minWidth: 220, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
                  {s.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(result.checklist?.[s.key] || []).map((task, i) => {
                    const key = `${s.key}-${i}`
                    const isChecked = !!checked[key]
                    return (
                      <button key={i} onClick={() => toggle(s.key, i)} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 8, textAlign: 'left', background: 'none',
                      }}>
                        {isChecked ? <CheckSquare size={14} color="var(--green)" style={{ marginTop: 1, flexShrink: 0 }} /> : <Square size={14} color="var(--text3)" style={{ marginTop: 1, flexShrink: 0 }} />}
                        <span style={{
                          fontSize: 12.5, lineHeight: 1.5,
                          color: isChecked ? 'var(--text3)' : 'var(--text2)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}>{task}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {result.managerBrief && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '24px 28px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={11} color="var(--green)" /> Manager Brief
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{result.managerBrief}</p>
            </div>
          )}
        </>
      )}

      {templates.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
            Templates in use
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {templates.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
                <FileText size={11} color="var(--text3)" /> {t.title}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
