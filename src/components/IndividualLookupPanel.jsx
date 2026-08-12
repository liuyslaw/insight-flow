import { useMemo, useState } from 'react'
import { Search, ArrowLeft, User, GraduationCap, TrendingUp, TrendingDown, Minus, UserPlus } from 'lucide-react'
import { getEmployees } from '../data/employeeStore.js'

const ratingColor = { 1: 'var(--red)', 2: 'var(--gold)', 3: 'var(--text2)', 4: 'var(--blue)', 5: 'var(--green)' }
const ratingLabel = { 1: 'Well Below', 2: 'Below Expectations', 3: 'Meets Expectations', 4: 'Exceeds Expectations', 5: 'Outstanding' }
const statusColor = { Completed: 'var(--green)', 'In Progress': 'var(--gold)', 'Not Started': 'var(--text3)' }
const MAX_RESULTS = 8

function identityKey(r) {
  return r.employeeId || r.employee
}

/**
 * Collapses the full multi-cycle record set into one row per unique
 * person, keeping only their most recent appraisal cycle for the
 * search/results list — clicking through still shows their full history.
 * People from the shared employee roster (hired via the Hiring pipeline,
 * or added directly in Onboarding) who don't have an appraisal record yet
 * are merged in too, so a brand-new hire is searchable here immediately
 * instead of being invisible until their first appraisal cycle.
 */
function uniquePeople(allRecords) {
  const byKey = new Map()
  for (const r of allRecords) {
    if (!r.employee) continue
    const key = identityKey(r)
    const existing = byKey.get(key)
    if (!existing || (r.appraisalCycle || 0) > (existing.appraisalCycle || 0)) {
      byKey.set(key, r)
    }
  }
  for (const e of getEmployees()) {
    const key = e.name
    if (!byKey.has(key)) {
      byKey.set(key, {
        employee: e.name, employeeId: null, role: e.role, level: e.level || 'Unassigned',
        site: e.site || 'Unassigned', rating: null, narrative: null, appraisalCycle: null,
        status: 'Active', noAppraisalYet: true, rosterSource: e.source,
      })
    }
  }
  return [...byKey.values()]
}

export default function IndividualLookupPanel({ allRecords, trainingRecords }) {
  const [query, setQuery] = useState('')
  const [selectedKey, setSelectedKey] = useState(null)

  const people = useMemo(() => uniquePeople(allRecords), [allRecords])

  const allMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return people.filter(
      (p) => p.employee.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.site.toLowerCase().includes(q)
    )
  }, [people, query])
  const results = allMatches.slice(0, MAX_RESULTS)
  const truncatedCount = allMatches.length - results.length

  const selected = selectedKey ? people.find((p) => identityKey(p) === selectedKey) : null

  const history = useMemo(() => {
    if (!selected) return []
    return allRecords
      .filter((r) => identityKey(r) === selectedKey)
      .sort((a, b) => (b.appraisalCycle || 0) - (a.appraisalCycle || 0))
  }, [allRecords, selected, selectedKey])

  const training = useMemo(() => {
    if (!selected) return []
    return trainingRecords.filter((t) => (t.employeeId || t.employee) === selectedKey || t.employee === selected.employee)
  }, [trainingRecords, selected, selectedKey])

  if (selected) {
    const trend = history.length >= 2 ? history[0].rating - history[1].rating : 0
    return (
      <div>
        <button onClick={() => setSelectedKey(null)} style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)',
          background: 'none', marginBottom: 16,
        }}>
          <ArrowLeft size={13} /> Back to search
        </button>

        {/* Profile header */}
        <div style={{
          background: 'var(--card-gradient)', border: '1px solid var(--border)', borderLeft: '3px solid var(--magenta)',
          boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '18px 22px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <User size={18} color="var(--magenta)" />
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{selected.employee}</div>
            {selected.status === 'Left' && (
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', background: 'var(--card2)', padding: '2px 8px', borderRadius: 999 }}>
                No longer with company
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px' }}>
            {[
              ['Role', selected.role], ['Level', selected.level], ['Site', selected.site],
              ['Function', selected.function], ['Business unit', selected.businessUnit],
              ['Gender', selected.gender], ['Age', selected.age], ['Years of service', selected.yearsOfService],
              ['Employee ID', selected.employeeId],
            ].filter(([, v]) => v != null && v !== '').map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Current rating + narrative */}
        {selected.rating ? (
          <div style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: selected.narrative ? 10 : 0 }}>
              <span style={{
                fontSize: 13, fontWeight: 700, color: ratingColor[selected.rating], background: `${ratingColor[selected.rating]}18`,
                border: `1px solid ${ratingColor[selected.rating]}55`, padding: '4px 12px', borderRadius: 8,
              }}>
                {selected.rating} / 5 — {ratingLabel[selected.rating]}
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--text3)' }}>{selected.appraisalCycle} cycle</span>
              {trend !== 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: trend > 0 ? 'var(--green)' : 'var(--red)' }}>
                  {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend > 0 ? '+' : ''}{trend} vs prior cycle
                </span>
              )}
            </div>
            {selected.narrative && (
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, fontStyle: 'italic' }}>"{selected.narrative}"</p>
            )}
          </div>
        ) : (
          <div style={{ background: 'var(--card-gradient)', border: '1px dashed var(--border)', borderRadius: 10, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserPlus size={14} color="var(--text3)" />
            <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>
              No appraisal history yet{selected.rosterSource === 'Hiring' ? ' — recently hired via the pipeline' : ' — recently added'}. Will appear here once their first cycle is recorded.
            </span>
          </div>
        )}

        {/* Appraisal history across cycles */}
        {history.length > 1 && (
          <div style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 12 }}>
              Appraisal History
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12.5 }}>
                  <span style={{ color: 'var(--text3)', width: 46, flexShrink: 0 }}>{h.appraisalCycle}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: ratingColor[h.rating], fontWeight: 600, width: 90, flexShrink: 0 }}>
                    {h.rating ? (
                      <>
                        {h.rating}/5
                        {h.rating >= 4 ? <TrendingUp size={11} /> : h.rating <= 2 ? <TrendingDown size={11} /> : <Minus size={11} />}
                      </>
                    ) : '—'}
                  </span>
                  <span style={{ color: 'var(--text2)' }}>{h.role} — {h.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training */}
        {training.length > 0 && (
          <div style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <GraduationCap size={12} /> Training
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {training.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--text2)' }}>{t.course}</span>
                  <span style={{ color: statusColor[t.status], fontSize: 11, fontWeight: 600 }}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={14} color="var(--text3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${people.length} people by name, role, or site…`}
          style={{
            width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '10px 12px 10px 34px', fontSize: 13, color: 'var(--text)',
          }}
        />

        {query.trim() && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 5,
            background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)', maxHeight: 400, overflowY: 'auto',
          }}>
            {results.length === 0 ? (
              <p style={{ fontSize: 12.5, color: 'var(--text3)', fontStyle: 'italic', padding: '12px 14px' }}>
                No one matches "{query}".
              </p>
            ) : (
              results.map((p) => (
                <button key={identityKey(p)} onClick={() => { setSelectedKey(identityKey(p)); setQuery('') }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left',
                  padding: '10px 14px', background: 'none', borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.employee}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{p.role} — {p.level} — {p.site}</div>
                  </div>
                  {p.rating ? (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: ratingColor[p.rating], background: `${ratingColor[p.rating]}18`,
                      border: `1px solid ${ratingColor[p.rating]}55`, padding: '3px 9px', borderRadius: 7, flexShrink: 0,
                    }}>
                      {p.rating}/5
                    </span>
                  ) : p.noAppraisalYet ? (
                    <span style={{ fontSize: 9.5, color: 'var(--text3)', flexShrink: 0, marginLeft: 8 }}>
                      {p.rosterSource === 'Hiring' ? 'from Hiring' : 'new'}
                    </span>
                  ) : null}
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

      {!query.trim() && (
        <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>
          {people.length} people in the repository — start typing a name, role, or site to find someone.
        </p>
      )}
    </div>
  )
}
