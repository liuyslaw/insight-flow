import { useEffect, useState } from 'react'
import { UserPlus, Sparkles, RefreshCw, AlertTriangle, CheckSquare, Square, FileText, Printer, Plus, X } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords } from '../lib/parseTalentDocs.js'

const sections = [
  { key: 'preboarding', label: 'Pre-boarding' },
  { key: 'day1', label: 'Day 1' },
  { key: 'week1', label: 'Week 1' },
  { key: 'month1', label: 'Month 1' },
]

export default function OnboardingModule() {
  const [templates, setTemplates] = useState([])
  const [policyDocs, setPolicyDocs] = useState([])
  const [talentRecords, setTalentRecords] = useState([])
  const [checkedIdx, setCheckedIdx] = useState({})
  const [customEntries, setCustomEntries] = useState([])
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customRole, setCustomRole] = useState('')
  const [customLevel, setCustomLevel] = useState('')
  const [customSite, setCustomSite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [plans, setPlans] = useState([]) // [{ role, level, site, checklist, managerBrief }]
  const [checked, setChecked] = useState({})

  useEffect(() => {
    setTemplates(getDocumentsByType('onboarding'))
    setPolicyDocs(getDocumentsByType('policy'))
    const talentDocs = getDocumentsByType('talent')
    setTalentRecords(parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n')))
  }, [])

  function toggleRecord(i) {
    setCheckedIdx((c) => ({ ...c, [i]: !c[i] }))
  }

  function addCustom() {
    if (!customRole.trim()) return
    setCustomEntries((c) => [...c, { role: customRole, level: customLevel, site: customSite }])
    setCustomRole(''); setCustomLevel(''); setCustomSite(''); setShowCustomForm(false)
  }

  function removeCustom(i) {
    setCustomEntries((c) => c.filter((_, idx) => idx !== i))
  }

  const selected = [
    ...talentRecords.filter((_, i) => checkedIdx[i]),
    ...customEntries,
  ]

  async function generateOne(role) {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: role.role, level: role.level, site: role.site,
        templates: templates.map((t) => ({ title: t.title, body: t.body })),
        policies: policyDocs.map((p) => ({ title: p.title, body: p.body })),
      }),
    })
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    const data = await res.json()
    return { role: role.role, level: role.level, site: role.site, ...data }
  }

  async function generate() {
    if (!selected.length) return
    setLoading(true); setError(null); setPlans([]); setChecked({})
    try {
      const results = await Promise.allSettled(selected.map(generateOne))
      const ok = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
      const failed = results.filter((r) => r.status === 'rejected')
      setPlans(ok)
      if (failed.length) setError(`${failed.length} of ${selected.length} plan(s) failed to generate.`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  function toggleTask(planIdx, section, i) {
    const key = `${planIdx}-${section}-${i}`
    setChecked((c) => ({ ...c, [key]: !c[key] }))
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 940 }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <UserPlus size={17} color="var(--green)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Onboarding</h2>
      </div>
      <p className="no-print" style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 580, marginBottom: 20 }}>
        Select one or more roles to generate onboarding plans for at once — combining role data
        from Talent Management, policies from Admin Services, and templates from Document, from
        offer acceptance through the first month.
      </p>

      {/* Selection */}
      <div className="no-print" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
          Who is this for? — select one or more
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 220, overflowY: 'auto', marginBottom: 10 }}>
          {talentRecords.map((r, i) => (
            <button key={i} onClick={() => toggleRecord(i)} style={{
              display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', background: checkedIdx[i] ? 'rgba(34,197,94,0.08)' : 'none',
              padding: '6px 8px', borderRadius: 6,
            }}>
              {checkedIdx[i] ? <CheckSquare size={14} color="var(--green)" /> : <Square size={14} color="var(--text3)" />}
              <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>{r.role} — {r.level} — {r.site}</span>
            </button>
          ))}
          {customEntries.map((c, i) => (
            <div key={`custom-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(34,197,94,0.08)', borderRadius: 6 }}>
              <CheckSquare size={14} color="var(--green)" />
              <span style={{ fontSize: 12.5, color: 'var(--text2)', flex: 1 }}>{c.role} — {c.level || '—'} — {c.site || '—'} <em style={{ color: 'var(--text3)' }}>(custom)</em></span>
              <button onClick={() => removeCustom(i)} style={{ background: 'none' }}><X size={13} color="var(--text3)" /></button>
            </div>
          ))}
        </div>

        {showCustomForm ? (
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input value={customRole} onChange={(e) => setCustomRole(e.target.value)} placeholder="Role"
              style={{ flex: 2, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, color: 'var(--text)' }} />
            <input value={customLevel} onChange={(e) => setCustomLevel(e.target.value)} placeholder="Level"
              style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, color: 'var(--text)' }} />
            <input value={customSite} onChange={(e) => setCustomSite(e.target.value)} placeholder="Site"
              style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, color: 'var(--text)' }} />
            <button onClick={addCustom} style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 8, padding: '8px 12px', color: 'var(--green)', fontSize: 12 }}>Add</button>
          </div>
        ) : (
          <button onClick={() => setShowCustomForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', fontSize: 11.5, color: 'var(--text3)', marginBottom: 10 }}>
            <Plus size={12} /> Add a custom role
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
            {selected.length} selected · {templates.length} template{templates.length === 1 ? '' : 's'} · {policyDocs.length} polic{policyDocs.length === 1 ? 'y' : 'ies'} loaded
          </span>
          <button onClick={generate} disabled={loading || selected.length === 0} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)',
            borderRadius: 8, padding: '9px 18px', color: 'var(--green)', fontSize: 12.5, fontWeight: 500,
            opacity: (loading || selected.length === 0) ? 0.4 : 1,
          }}>
            {loading
              ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
              : <><Sparkles size={13} /> Generate {selected.length > 1 ? `${selected.length} plans` : 'onboarding plan'}</>}
          </button>
        </div>
      </div>

      {templates.length === 0 && (
        <div className="no-print" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 9, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: 'var(--gold)' }}>
          No onboarding templates in the repository — add one in Document (tag it "Onboarding") for better results.
        </div>
      )}

      {error && (
        <div className="no-print" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 8 }}>
          <AlertTriangle size={14} color="var(--red)" />
          <span style={{ fontSize: 12.5, color: 'var(--red)' }}>{error}</span>
        </div>
      )}

      {plans.length > 0 && (
        <>
          <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button onClick={() => window.print()} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8,
              padding: '8px 16px', color: 'var(--text)', fontSize: 12,
            }}>
              <Printer size={13} /> Print / Export as PDF
            </button>
          </div>

          {plans.map((plan, pi) => (
            <div key={pi} style={{ marginBottom: 28, pageBreakInside: 'avoid' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                {plan.role} <span style={{ color: 'var(--text3)', fontWeight: 400 }}>— {plan.level} — {plan.site}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                {sections.map((s) => (
                  <div key={s.key} style={{ flex: '1 1 220px', minWidth: 200, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 9.5, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 9 }}>
                      {s.label}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {(plan.checklist?.[s.key] || []).map((task, i) => {
                        const key = `${pi}-${s.key}-${i}`
                        const isChecked = !!checked[key]
                        return (
                          <button key={i} onClick={() => toggleTask(pi, s.key, i)} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, textAlign: 'left', background: 'none' }}>
                            {isChecked ? <CheckSquare size={13} color="var(--green)" style={{ marginTop: 1, flexShrink: 0 }} /> : <Square size={13} color="var(--text3)" style={{ marginTop: 1, flexShrink: 0 }} />}
                            <span style={{ fontSize: 12, lineHeight: 1.5, color: isChecked ? 'var(--text3)' : 'var(--text2)', textDecoration: isChecked ? 'line-through' : 'none' }}>{task}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {plan.managerBrief && (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 22px' }}>
                  <div style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={11} color="var(--green)" /> Manager Brief
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{plan.managerBrief}</p>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {templates.length > 0 && plans.length === 0 && (
        <div className="no-print" style={{ marginTop: 22 }}>
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
