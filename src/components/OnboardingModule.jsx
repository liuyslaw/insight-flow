import { useEffect, useState } from 'react'
import { UserPlus, Sparkles, RefreshCw, AlertTriangle, CheckSquare, Square, FileText, Printer, Plus, X, FileDown, CheckCircle2, Search, UserCheck } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords } from '../lib/parseTalentDocs.js'
import { buildOnboardingReportDocx } from '../lib/buildOnboardingReport.js'
import { getOnboardingPlans, savePlans, togglePlanTask, signOffSection, clearSignOff } from '../data/onboardingStore.js'
import { getEmployees, addOrUpdateEmployee } from '../data/employeeStore.js'

const sections = [
  { key: 'preboarding', label: 'Pre-boarding' },
  { key: 'day1', label: 'Day 1' },
  { key: 'week1', label: 'Week 1' },
  { key: 'month1', label: 'Month 1' },
]

const MAX_DROPDOWN_RESULTS = 8

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

/**
 * Merges Talent Management's appraisal-cycle records with the shared
 * employee roster (people hired via the Hiring pipeline, or added directly
 * here) into one searchable list. A talentRecords entry wins when a name
 * appears in both, since it carries richer data (employeeId, hireDate) —
 * roster-only entries are typically very recent hires who don't have an
 * appraisal record yet.
 */
function buildRoster(talentRecords, employees) {
  const byName = new Map()
  for (const r of talentRecords) {
    if (r.employee) byName.set(r.employee.trim().toLowerCase(), { ...r, fromRoster: false })
  }
  for (const e of employees) {
    const key = e.name.trim().toLowerCase()
    if (!byName.has(key)) {
      byName.set(key, {
        employee: e.name, employeeId: null, role: e.role, level: e.level || 'Unassigned',
        site: e.site || 'Unassigned', hireDate: e.hireDate, fromRoster: true, rosterSource: e.source,
      })
    }
  }
  return [...byName.values()]
}

export default function OnboardingModule() {
  const [templates, setTemplates] = useState([])
  const [policyDocs, setPolicyDocs] = useState([])
  const [roster, setRoster] = useState([])
  const [selectedPeople, setSelectedPeople] = useState([])
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newLevel, setNewLevel] = useState('')
  const [newSite, setNewSite] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [plans, setPlans] = useState([]) // [{ id, role, level, site, checklist, managerBrief, checkedTasks, signOffs, createdAt }]
  const [employeeSearch, setEmployeeSearch] = useState('')

  // Inline sign-off expand state: `${planIdx}-${sectionKey}` while a form is open
  const [signOffOpen, setSignOffOpen] = useState(null)
  const [signOffName, setSignOffName] = useState('')
  const [signOffNote, setSignOffNote] = useState('')

  function refreshRoster() {
    const talentDocs = getDocumentsByType('talent')
    const allRecords = parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n'))
    const cycles = [...new Set(allRecords.map((r) => r.appraisalCycle))].filter(Boolean)
    const latestCycle = cycles.length ? Math.max(...cycles) : null
    const current = allRecords.filter((r) => r.status === 'Active' && (latestCycle == null || r.appraisalCycle === latestCycle))
    setRoster(buildRoster(current, getEmployees()))
  }

  useEffect(() => {
    setTemplates(getDocumentsByType('onboarding'))
    setPolicyDocs(getDocumentsByType('policy'))
    refreshRoster()

    // Restore any previously generated (and persisted) onboarding plans
    const savedPlans = getOnboardingPlans()
    if (savedPlans.length) setPlans(savedPlans)
  }, [])

  const query = employeeSearch.trim().toLowerCase()
  const matches = query
    ? roster.filter(
        (r) => (r.employee || '').toLowerCase().includes(query) || r.role.toLowerCase().includes(query) || r.site.toLowerCase().includes(query)
      )
    : []
  const selectedNames = new Set(selectedPeople.map((p) => p.employee))
  const dropdownResults = matches.filter((r) => !selectedNames.has(r.employee)).slice(0, MAX_DROPDOWN_RESULTS)
  const truncatedCount = matches.filter((r) => !selectedNames.has(r.employee)).length - dropdownResults.length

  function pickPerson(person) {
    setSelectedPeople((s) => [...s, person])
    setEmployeeSearch('')
  }

  function removeSelected(name) {
    setSelectedPeople((s) => s.filter((p) => p.employee !== name))
  }

  function createEmployee() {
    if (!newName.trim() || !newRole.trim()) return
    const updated = addOrUpdateEmployee({ name: newName, role: newRole, level: newLevel || null, site: newSite || null, source: 'Manual' })
    refreshRoster()
    const created = updated.find((e) => e.name.trim().toLowerCase() === newName.trim().toLowerCase())
    if (created) {
      pickPerson({ employee: created.name, employeeId: null, role: created.role, level: created.level || 'Unassigned', site: created.site || 'Unassigned', hireDate: created.hireDate, fromRoster: true })
    }
    setNewName(''); setNewRole(''); setNewLevel(''); setNewSite(''); setShowNewEmployeeForm(false)
  }

  const selected = selectedPeople

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
    return {
      role: role.role, level: role.level, site: role.site,
      employee: role.employee || null, employeeId: role.employeeId || null, hireDate: role.hireDate || null,
      ...data,
    }
  }

  async function generate() {
    if (!selected.length) return
    setLoading(true); setError(null)
    try {
      const results = await Promise.allSettled(selected.map(generateOne))
      const ok = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
      const failed = results.filter((r) => r.status === 'rejected')
      if (ok.length) {
        // Persist the newly generated plans alongside whatever was already saved,
        // and adopt the id-attached, merged array as the new UI state.
        const updatedPlans = savePlans(ok)
        setPlans(updatedPlans)
      }
      if (failed.length) setError(`${failed.length} of ${selected.length} plan(s) failed to generate.`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  const [exportingDocx, setExportingDocx] = useState(false)

  async function exportWord() {
    if (!plans.length) return
    setExportingDocx(true)
    try {
      await buildOnboardingReportDocx(plans)
    } catch (err) {
      setError('Could not generate the Word report. Try again.')
    } finally { setExportingDocx(false) }
  }

  function toggleTask(planIdx, section, i) {
    const plan = plans[planIdx]
    if (!plan?.id) return
    const updatedPlans = togglePlanTask(plan.id, section, i)
    setPlans(updatedPlans)
  }

  function openSignOff(planIdx, sectionKey) {
    setSignOffOpen(`${planIdx}-${sectionKey}`)
    setSignOffName('')
    setSignOffNote('')
  }

  function cancelSignOff() {
    setSignOffOpen(null)
    setSignOffName('')
    setSignOffNote('')
  }

  function confirmSignOff(planIdx, sectionKey) {
    const plan = plans[planIdx]
    if (!plan?.id || !signOffName.trim()) return
    const updatedPlans = signOffSection(plan.id, sectionKey, { managerName: signOffName, note: signOffNote })
    setPlans(updatedPlans)
    setSignOffOpen(null)
    setSignOffName('')
    setSignOffNote('')
  }

  function undoSignOff(planIdx, sectionKey) {
    const plan = plans[planIdx]
    if (!plan?.id) return
    const updatedPlans = clearSignOff(plan.id, sectionKey)
    setPlans(updatedPlans)
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 940 }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <UserPlus size={17} color="var(--green)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Onboarding</h2>
      </div>
      <p className="no-print" style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 580, marginBottom: 20 }}>
        Search for a specific person to build their onboarding plan, or select multiple roles at
        once — combining role data from Talent Management, policies from Admin Services, and
        templates from Document, from offer acceptance through the first month.
      </p>

      {/* Selection */}
      <div className="no-print" style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', borderTop: '2px solid var(--green)', boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
          Who is this for?
        </div>

        {selectedPeople.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {selectedPeople.map((p) => (
              <div key={p.employee} style={{
                display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.35)', borderRadius: 999, padding: '5px 6px 5px 12px',
              }}>
                <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{p.employee}</span>
                <span style={{ fontSize: 10.5, color: 'var(--text3)' }}>· {p.role}</span>
                <button onClick={() => removeSelected(p.employee)} style={{ background: 'none', padding: 2 }}>
                  <X size={12} color="var(--text3)" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <Search size={13} color="var(--text3)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            placeholder="Search by employee name, role, or site…"
            style={{
              width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
              padding: '9px 12px 9px 32px', fontSize: 12.5, color: 'var(--text)',
            }}
          />

          {query && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 5,
              background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)', maxHeight: 260, overflowY: 'auto',
            }}>
              {dropdownResults.length === 0 ? (
                <div style={{ padding: '12px 14px' }}>
                  <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic', marginBottom: 6 }}>
                    No match for "{employeeSearch}".
                  </p>
                  <button onClick={() => { setNewName(employeeSearch); setShowNewEmployeeForm(true); setEmployeeSearch('') }} style={{
                    display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--green)', background: 'none',
                  }}>
                    <Plus size={12} /> Create "{employeeSearch}" as a new employee
                  </button>
                </div>
              ) : (
                dropdownResults.map((r) => (
                  <button key={r.employee} onClick={() => pickPerson(r)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                    textAlign: 'left', padding: '9px 14px', background: 'none', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>
                      <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{r.employee}</strong>
                      {' — '}{r.role} — {r.level} — {r.site}
                    </span>
                    {r.fromRoster && (
                      <span style={{ fontSize: 9.5, color: 'var(--green)', flexShrink: 0, marginLeft: 8 }}>
                        {r.rosterSource === 'Hiring' ? 'from Hiring' : 'new'}
                      </span>
                    )}
                  </button>
                ))
              )}
              {truncatedCount > 0 && (
                <div style={{ padding: '7px 14px', fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>
                  +{truncatedCount} more — keep typing to narrow it down
                </div>
              )}
            </div>
          )}
        </div>

        {showNewEmployeeForm ? (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border)' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <UserCheck size={11} /> New employee — added to the shared roster, visible in Talent Management too
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name"
                style={{ flex: 2, minWidth: 140, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, color: 'var(--text)' }} />
              <input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Role"
                style={{ flex: 2, minWidth: 140, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, color: 'var(--text)' }} />
              <input value={newLevel} onChange={(e) => setNewLevel(e.target.value)} placeholder="Level"
                style={{ flex: 1, minWidth: 80, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, color: 'var(--text)' }} />
              <input value={newSite} onChange={(e) => setNewSite(e.target.value)} placeholder="Site"
                style={{ flex: 1, minWidth: 100, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 12.5, color: 'var(--text)' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={createEmployee} disabled={!newName.trim() || !newRole.trim()} style={{
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 8,
                padding: '8px 14px', color: 'var(--green)', fontSize: 12, opacity: (!newName.trim() || !newRole.trim()) ? 0.4 : 1,
              }}>
                Add &amp; select
              </button>
              <button onClick={() => setShowNewEmployeeForm(false)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', color: 'var(--text3)', fontSize: 12 }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNewEmployeeForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', fontSize: 11.5, color: 'var(--text3)', marginTop: 10 }}>
            <Plus size={12} /> Create a new employee
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
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
          <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
            <button onClick={exportWord} disabled={exportingDocx} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8,
              padding: '8px 16px', color: 'var(--text)', fontSize: 12, opacity: exportingDocx ? 0.5 : 1,
            }}>
              <FileDown size={13} /> {exportingDocx ? 'Preparing…' : 'Export as Word'}
            </button>
            <button onClick={() => window.print()} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8,
              padding: '8px 16px', color: 'var(--text)', fontSize: 12,
            }}>
              <Printer size={13} /> Print / Export as PDF
            </button>
          </div>

          {plans.map((plan, pi) => (
            <div key={plan.id || pi} style={{ marginBottom: 28, pageBreakInside: 'avoid' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                {plan.role} <span style={{ color: 'var(--text3)', fontWeight: 400 }}>— {plan.level} — {plan.site}</span>
              </div>

              {plan.employee && (
                <div style={{
                  background: 'var(--card-gradient)', border: '1px solid var(--border)', borderLeft: '3px solid var(--green)',
                  boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '14px 18px', marginBottom: 14,
                  display: 'flex', flexWrap: 'wrap', gap: '6px 28px',
                }}>
                  <div>
                    <div style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>Employee</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{plan.employee}</div>
                  </div>
                  {plan.employeeId && (
                    <div>
                      <div style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>Employee ID</div>
                      <div style={{ fontSize: 13, color: 'var(--text2)' }}>{plan.employeeId}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>Role &amp; Level</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{plan.role} · {plan.level}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>Site</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{plan.site}</div>
                  </div>
                  {plan.hireDate && (
                    <div>
                      <div style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>Start / Hire Date</div>
                      <div style={{ fontSize: 13, color: 'var(--text2)' }}>{plan.hireDate}</div>
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                {sections.map((s) => {
                  const signOff = plan.signOffs?.[s.key]
                  const signOffKey = `${pi}-${s.key}`
                  const isSignOffOpen = signOffOpen === signOffKey
                  return (
                    <div key={s.key} style={{ flex: '1 1 220px', minWidth: 200, background: 'var(--card-gradient)', border: '1px solid var(--border)', borderTop: '2px solid var(--green)', boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 9.5, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 9 }}>
                        {s.label}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {(plan.checklist?.[s.key] || []).map((task, i) => {
                          const taskKey = `${s.key}-${i}`
                          const isChecked = !!(plan.checkedTasks && plan.checkedTasks[taskKey])
                          return (
                            <button key={i} onClick={() => toggleTask(pi, s.key, i)} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, textAlign: 'left', background: 'none' }}>
                              {isChecked ? <CheckSquare size={13} color="var(--green)" style={{ marginTop: 1, flexShrink: 0 }} /> : <Square size={13} color="var(--text3)" style={{ marginTop: 1, flexShrink: 0 }} />}
                              <span style={{ fontSize: 12, lineHeight: 1.5, color: isChecked ? 'var(--text3)' : 'var(--text2)', textDecoration: isChecked ? 'line-through' : 'none' }}>{task}</span>
                            </button>
                          )
                        })}
                      </div>

                      {/* Manager sign-off — inline expand, no modal */}
                      {signOff ? (
                        <div style={{ marginTop: 10, paddingTop: 9, borderTop: '1px dashed var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--green)' }}>
                            <CheckCircle2 size={12} color="var(--green)" style={{ flexShrink: 0 }} />
                            <span>Signed off by {signOff.managerName} — {formatDate(signOff.signedAt)}</span>
                          </div>
                          {signOff.note && (
                            <p style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5, marginTop: 4 }}>{signOff.note}</p>
                          )}
                          <button className="no-print" onClick={() => undoSignOff(pi, s.key)} style={{ background: 'none', fontSize: 10.5, color: 'var(--text3)', textDecoration: 'underline', marginTop: 4 }}>
                            Undo
                          </button>
                        </div>
                      ) : isSignOffOpen ? (
                        <div className="no-print" style={{ marginTop: 10, paddingTop: 9, borderTop: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <input
                            value={signOffName}
                            onChange={(e) => setSignOffName(e.target.value)}
                            placeholder="Manager name"
                            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 8px', fontSize: 11.5, color: 'var(--text)' }}
                          />
                          <textarea
                            value={signOffNote}
                            onChange={(e) => setSignOffNote(e.target.value)}
                            placeholder="Note (optional)"
                            rows={2}
                            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 8px', fontSize: 11.5, color: 'var(--text)', resize: 'vertical', fontFamily: 'inherit' }}
                          />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => confirmSignOff(pi, s.key)}
                              disabled={!signOffName.trim()}
                              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 6, padding: '5px 10px', color: 'var(--green)', fontSize: 11, opacity: signOffName.trim() ? 1 : 0.4 }}
                            >
                              Confirm sign-off
                            </button>
                            <button onClick={cancelSignOff} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 10px', color: 'var(--text3)', fontSize: 11 }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="no-print"
                          onClick={() => openSignOff(pi, s.key)}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', fontSize: 10.5, color: 'var(--text3)', marginTop: 10, paddingTop: 9, borderTop: '1px dashed var(--border)', width: '100%' }}
                      >
                        <CheckCircle2 size={12} /> Sign off
                      </button>
                      )}
                    </div>
                  )
                })}
              </div>
              {plan.managerBrief && (
                <div style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '18px 22px' }}>
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
