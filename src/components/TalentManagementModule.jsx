import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, Sparkles, RefreshCw, AlertTriangle, ShieldAlert, Scale, FileDown, Table2, ArrowUp, ArrowDown, Minus, GraduationCap, X } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords, countBy, computeTalentMovement } from '../lib/parseTalentDocs.js'
import { parseTrainingRecords, countByStatus, countByCourse } from '../lib/parseTrainingDocs.js'
import { buildTalentReportDocx } from '../lib/buildTalentReport.js'
import { exportRowsToExcel } from '../lib/exportExcel.js'
import AppraisalChart from './AppraisalChart.jsx'
import PeriodRangeSelector from './PeriodRangeSelector.jsx'
import AIChatPanel from './AIChatPanel.jsx'

const severityColor = { high: 'var(--red)', medium: 'var(--gold)', low: 'var(--text3)' }
const severityBg = { high: 'rgba(239,68,68,0.06)', medium: 'rgba(245,158,11,0.06)', low: 'rgba(255,255,255,0.03)' }
const severityBorder = { high: 'rgba(239,68,68,0.25)', medium: 'rgba(245,158,11,0.25)', low: 'var(--border)' }
const flagIcon = { 'Level/JD mismatch': ShieldAlert, 'Rating/narrative mismatch': AlertTriangle, 'Calibration variance': Scale }

const movementMeta = {
  Rising: { color: 'var(--green)', bg: 'rgba(34,197,94,0.08)', Icon: ArrowUp },
  Steady: { color: 'var(--text3)', bg: 'rgba(255,255,255,0.03)', Icon: Minus },
  'Needs Attention': { color: 'var(--red)', bg: 'rgba(239,68,68,0.06)', Icon: ArrowDown },
}
const statusColors = { Completed: '#22c55e', 'In Progress': '#f59e0b', 'Not Started': '#71717A' }

const tooltipStyle = {
  background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 6,
  fontSize: 12, color: 'var(--text)', padding: '6px 10px',
}
const axisStyle = { fontSize: 11, fill: 'var(--text3)' }

export default function TalentManagementModule() {
  const [talentDocs, setTalentDocs] = useState([])
  const [trainingDocs, setTrainingDocs] = useState([])
  const [startPeriod, setStartPeriod] = useState({ month: 11, year: 2026 })
  const [endPeriod, setEndPeriod] = useState({ month: 11, year: 2026 })
  const [siteFilter, setSiteFilter] = useState('all')
  const [functionFilter, setFunctionFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [movementDrill, setMovementDrill] = useState(null)
  const [courseFilter, setCourseFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)
  const [talentSummary, setTalentSummary] = useState(null)
  const [loadingTalentSummary, setLoadingTalentSummary] = useState(false)
  const [talentSummaryError, setTalentSummaryError] = useState(null)

  useEffect(() => {
    setTalentDocs(getDocumentsByType('talent'))
    setTrainingDocs(getDocumentsByType('training'))
  }, [])

  const allRecords = useMemo(
    () => parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n')),
    [talentDocs]
  )
  const trainingRecords = useMemo(
    () => parseTrainingRecords(trainingDocs.map((d) => d.body).join('\n\n---\n\n')),
    [trainingDocs]
  )

  const cycles = useMemo(
    () => [...new Set(allRecords.map((r) => r.appraisalCycle))].filter(Boolean).sort((a, b) => a - b),
    [allRecords]
  )

  // From/To are honored directly — no min/max swapping, which previously
  // caused the snapshot to silently ignore whichever box was just changed.
  const rangeStartYear = startPeriod.year
  const rangeEndYear = endPeriod.year
  const invalidRange = rangeStartYear > rangeEndYear
  const previousYear = rangeEndYear - 1

  const allActiveRecords = useMemo(() => allRecords.filter((r) => r.status === 'Active'), [allRecords])
  const rangeActiveRecords = useMemo(
    () => allActiveRecords.filter((r) => r.appraisalCycle >= rangeStartYear && r.appraisalCycle <= rangeEndYear),
    [allActiveRecords, rangeStartYear, rangeEndYear]
  )
  const cycleRecords = useMemo(
    () => allActiveRecords.filter((r) => r.appraisalCycle === rangeEndYear),
    [allActiveRecords, rangeEndYear]
  )

  const siteOptions = useMemo(() => countBy(cycleRecords, 'site').map((c) => c.name), [cycleRecords])
  const functionOptions = useMemo(() => countBy(cycleRecords, 'function').map((c) => c.name), [cycleRecords])

  const records = useMemo(() => cycleRecords.filter((r) =>
    (siteFilter === 'all' || r.site === siteFilter) &&
    (functionFilter === 'all' || r.function === functionFilter)
  ), [cycleRecords, siteFilter, functionFilter])

  const hasPriorCycle = cycles.includes(previousYear)
  const movement = useMemo(() => {
    if (!hasPriorCycle) return []
    const all = computeTalentMovement(allActiveRecords, rangeEndYear, previousYear)
    const filteredEmployees = new Set(records.map((r) => r.employee))
    return all.filter((r) => filteredEmployees.has(r.employee))
  }, [hasPriorCycle, allActiveRecords, rangeEndYear, previousYear, records])

  const movementCounts = useMemo(() => {
    const counts = { Rising: 0, Steady: 0, 'Needs Attention': 0, 'No prior data': 0 }
    movement.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1 })
    return counts
  }, [movement])

  // Training & development — scoped to employees in the current site/function selection
  const currentEmployeeSet = useMemo(() => new Set(records.map((r) => r.employee)), [records])
  const relevantTraining = useMemo(
    () => trainingRecords.filter((t) => currentEmployeeSet.has(t.employee)),
    [trainingRecords, currentEmployeeSet]
  )
  const trainingStatusData = countByStatus(relevantTraining)
  const trainingByCourse = countByCourse(relevantTraining)
  const employeesWithTraining = new Set(relevantTraining.map((t) => t.employee)).size

  const statusOrder = { Completed: 0, 'In Progress': 1, 'Not Started': 2 }
  const filteredTrainingLog = useMemo(() => relevantTraining
    .filter((t) => !courseFilter || t.course === courseFilter)
    .filter((t) => !statusFilter || t.status === statusFilter)
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.employee.localeCompare(b.employee)),
  [relevantTraining, courseFilter, statusFilter])

  function handleStartChange(next) {
    setStartPeriod(next)
    if (next.year > endPeriod.year) setEndPeriod(next)
  }
  function handleEndChange(next) {
    setEndPeriod(next)
    if (next.year < startPeriod.year) setStartPeriod(next)
  }

  const periodLabel = invalidRange
    ? `Invalid range (From ${rangeStartYear} is after To ${rangeEndYear})`
    : rangeStartYear === rangeEndYear ? `Cycle ${rangeEndYear}` : `${rangeStartYear}–${rangeEndYear} (as of ${rangeEndYear})`
  const filterLabel = [
    periodLabel,
    siteFilter !== 'all' ? siteFilter : null,
    functionFilter !== 'all' ? functionFilter : null,
  ].filter(Boolean).join(' · ')

  const ratingCounts = [1, 2, 3, 4, 5].map((r) => ({
    rating: r, count: records.filter((rec) => rec.rating === r).length,
  }))

  useEffect(() => { setTalentSummary(null) }, [rangeStartYear, rangeEndYear, siteFilter, functionFilter])

  async function generateTalentSummary() {
    setLoadingTalentSummary(true); setTalentSummaryError(null); setTalentSummary(null)
    try {
      const res = await fetch('/api/insight-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'talent',
          context: {
            scope: filterLabel, totalRecords: records.length, appraisalRatingDistribution: ratingCounts,
            talentMovement: movementCounts, trainingCompletionStatus: trainingStatusData,
            trainingByCourse, employeesWithTraining, totalEmployeesInSelection: records.length,
          },
          question: 'Give me a brief summary of the current talent movement, training progress, and appraisal picture for this selection.',
          history: [],
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setTalentSummary(data.answer)
    } catch (err) {
      setTalentSummaryError(err.message || 'Something went wrong. Try again.')
    } finally { setLoadingTalentSummary(false) }
  }

  async function analyze() {
    const combined = records.map((r) => r.raw).join('\n\n---\n\n')
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

  async function exportReport() {
    if (!result) return
    setExporting(true)
    try {
      await buildTalentReportDocx({ result, filterLabel, recordCount: records.length })
    } catch (err) {
      setError('Could not generate the Word report. Try again.')
    } finally { setExporting(false) }
  }

  function exportExcel() {
    const rows = records.map((r) => ({
      Employee: r.employee || '', Role: r.role, 'Business Unit': r.businessUnit || '', Site: r.site,
      Level: r.level, Function: r.function, 'Appraisal Cycle': r.appraisalCycle ?? '', Rating: r.rating ?? '',
      Gender: r.gender || '', Age: r.age ?? '', 'Years of Service': r.yearsOfService ?? '',
    }))
    exportRowsToExcel(rows, `HRinsight-Talent-Data-${new Date().toISOString().slice(0, 10)}`, 'Talent Data')
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Users size={17} color="var(--magenta)" />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Talent Management</h2>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 480 }}>
            Talent development and appraisal — job level/JD consistency, rating movement, and
            training progress, for a selected period.
          </p>
        </div>
        <button onClick={analyze} disabled={loading || records.length === 0} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: loading ? 'rgba(184,68,128,0.06)' : 'rgba(184,68,128,0.12)',
          border: '1px solid rgba(184,68,128,0.35)', borderRadius: 8, padding: '9px 18px',
          color: 'var(--magenta)', fontSize: 12.5, fontWeight: 500,
          opacity: (loading || records.length === 0) ? 0.5 : 1, whiteSpace: 'nowrap',
        }}>
          {loading
            ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Analysing…</>
            : <><Sparkles size={13} /> {result ? 'Re-run analysis' : 'Analyse for inconsistencies'}</>}
        </button>
      </div>

      {/* Period */}
      <div style={{ marginBottom: 14 }}>
        <PeriodRangeSelector
          years={cycles.length ? cycles : [2025, 2026]}
          start={startPeriod}
          end={endPeriod}
          onChangeStart={handleStartChange}
          onChangeEnd={handleEndChange}
          accentColor="var(--magenta)"
        />
      </div>

      {invalidRange && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--red)' }}>
          "From" ({rangeStartYear}) is after "To" ({rangeEndYear}) — set "From" to the same year or earlier.
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} style={{
          background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '8px 12px', fontSize: 12.5, color: 'var(--text)',
        }}>
          <option value="all">All sites</option>
          {siteOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={functionFilter} onChange={(e) => setFunctionFilter(e.target.value)} style={{
          background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '8px 12px', fontSize: 12.5, color: 'var(--text)',
        }}>
          <option value="all">All functions</option>
          {functionOptions.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        {(siteFilter !== 'all' || functionFilter !== 'all') && (
          <button onClick={() => { setSiteFilter('all'); setFunctionFilter('all') }} style={{
            background: 'none', fontSize: 11.5, color: 'var(--text3)', padding: '8px 4px',
          }}>Clear filters</button>
        )}
        {records.length > 0 && (
          <button onClick={exportExcel} style={{
            display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto',
            background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 7,
            padding: '7px 12px', color: 'var(--text2)', fontSize: 11.5,
          }}>
            <Table2 size={12} /> Export data as Excel
          </button>
        )}
      </div>

      <AppraisalChart records={records} allActiveRecords={rangeActiveRecords} />

      {/* Talent Movement */}
      {records.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <ArrowUp size={13} color="var(--green)" />
            <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
              Talent Movement — {rangeEndYear} vs {previousYear}
            </span>
          </div>
          {!hasPriorCycle ? (
            <p style={{ fontSize: 12.5, color: 'var(--text3)', fontStyle: 'italic' }}>
              No prior cycle ({previousYear}) in the repository yet — movement needs at least two cycles to compare.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                {['Rising', 'Steady', 'Needs Attention'].map((cat) => {
                  const meta = movementMeta[cat]
                  return (
                    <button key={cat} onClick={() => setMovementDrill(cat)} style={{
                      textAlign: 'left', flex: '1 1 160px', minWidth: 150, background: meta.bg,
                      border: `1px solid ${meta.color}40`, borderRadius: 9, padding: '12px 14px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <meta.Icon size={13} color={meta.color} />
                        <span style={{ fontSize: 10.5, color: meta.color, fontWeight: 600 }}>{cat}</span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: meta.color }}>{movementCounts[cat] || 0}</div>
                    </button>
                  )
                })}
              </div>
              <p style={{ fontSize: 10.5, color: 'var(--text3)', fontStyle: 'italic', marginBottom: movementDrill ? 10 : 0 }}>
                Rising = rating improved and now 4+. Needs Attention = rating declined. Click a card to see who.
              </p>
              {movementDrill && (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: movementMeta[movementDrill].color, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                      {movementDrill} — {movementCounts[movementDrill] || 0}
                    </span>
                    <button onClick={() => setMovementDrill(null)} style={{ background: 'none' }}><X size={14} color="var(--text3)" /></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 240, overflowY: 'auto' }}>
                    {movement.filter((r) => r.category === movementDrill).map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 7,
                        padding: '7px 12px', fontSize: 12,
                      }}>
                        <span style={{ color: 'var(--text)' }}>{r.employee}</span>
                        <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 11 }}>
                          {r.role} · {previousYear}: {r.previousRating} → {rangeEndYear}: {r.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Training & Development */}
      {records.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <GraduationCap size={13} color="var(--gold)" />
            <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
              Training &amp; Development
            </span>
          </div>
          {relevantTraining.length === 0 ? (
            <p style={{ fontSize: 12.5, color: 'var(--text3)', fontStyle: 'italic' }}>
              No training records for this selection — add course/completion data in Document, tagged "Training".
            </p>
          ) : (
            <>
              <p style={{ fontSize: 11.5, color: 'var(--text3)', marginBottom: 12 }}>
                {employeesWithTraining} of {records.length} employees in this selection have at least one training assignment.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', flex: '1 1 280px', minWidth: 260 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 14 }}>Completion Status — click to filter log</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={trainingStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} interval={0} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer" onClick={(d) => setStatusFilter(statusFilter === d.name ? null : d.name)}>
                        {trainingStatusData.map((entry, i) => (
                          <Cell key={i} fill={statusColors[entry.name]} opacity={statusFilter && statusFilter !== entry.name ? 0.35 : 1} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', flex: '1 1 280px', minWidth: 260 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 12 }}>By Course — click to filter log</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {trainingByCourse.map((c) => (
                      <button key={c.name} onClick={() => setCourseFilter(courseFilter === c.name ? null : c.name)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12,
                        background: courseFilter === c.name ? 'rgba(245,158,11,0.1)' : 'none', borderRadius: 6, padding: '4px 6px',
                        textAlign: 'left', opacity: courseFilter && courseFilter !== c.name ? 0.5 : 1,
                      }}>
                        <span style={{ color: 'var(--text2)' }}>{c.name}</span>
                        <span className="chip">{c.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Training Log — who attended what, and when */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                    Training Log — {filteredTrainingLog.length} record{filteredTrainingLog.length === 1 ? '' : 's'}
                  </span>
                  {(courseFilter || statusFilter) && (
                    <button onClick={() => { setCourseFilter(null); setStatusFilter(null) }} style={{ background: 'none', fontSize: 11, color: 'var(--text3)' }}>
                      Clear filter
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280, overflowY: 'auto' }}>
                  {filteredTrainingLog.map((t, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '1.3fr 1.6fr 0.8fr 0.9fr', gap: 10, alignItems: 'center',
                      padding: '7px 10px', borderRadius: 6, fontSize: 11.5,
                      background: i % 2 === 0 ? 'var(--bg2)' : 'transparent',
                    }}>
                      <span style={{ color: 'var(--text)' }}>{t.employee}</span>
                      <span style={{ color: 'var(--text2)' }}>{t.course}</span>
                      <span className="chip" style={{ color: statusColors[t.status], borderColor: `${statusColors[t.status]}55`, width: 'fit-content' }}>{t.status}</span>
                      <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 10.5 }}>{t.completionDate || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* AI Insights — interactive */}
      {records.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
              AI Insights — {filterLabel}
            </span>
            <button onClick={generateTalentSummary} disabled={loadingTalentSummary} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(184,68,128,0.12)', border: '1px solid rgba(184,68,128,0.35)',
              borderRadius: 8, padding: '8px 16px', color: 'var(--magenta)', fontSize: 12, fontWeight: 500,
              opacity: loadingTalentSummary ? 0.5 : 1,
            }}>
              {loadingTalentSummary
                ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                : <><Sparkles size={12} /> {talentSummary ? 'Regenerate summary' : 'Generate summary'}</>}
            </button>
          </div>

          {talentSummaryError && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 12, display: 'flex', gap: 8 }}>
              <AlertTriangle size={14} color="var(--red)" />
              <span style={{ fontSize: 12.5, color: 'var(--red)' }}>{talentSummaryError}</span>
            </div>
          )}

          {talentSummary ? (
            <AIChatPanel
              moduleKey="talent"
              accentColor="var(--magenta)"
              initialMessage={talentSummary}
              context={{
                scope: filterLabel, totalRecords: records.length, appraisalRatingDistribution: ratingCounts,
                talentMovement: movementCounts, trainingCompletionStatus: trainingStatusData,
                trainingByCourse, employeesWithTraining,
              }}
              starterQuestions={[
                'Who is in the Needs Attention group?',
                'Which course has the lowest completion rate?',
                'Is training completion linked to rising talent?',
              ]}
            />
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>
              Generate a summary to start an interactive conversation about movement, training, and appraisal data — only aggregated counts are sent, no individual employee data beyond what's already shown above.
            </p>
          )}
        </div>
      )}

      {/* Context strip */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 9,
        padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 28, flexWrap: 'wrap',
      }}>
        {[
          { label: 'Scope', value: filterLabel },
          { label: 'Records', value: records.length },
          { label: 'Model', value: 'llama-3.3-70b' },
          { label: 'Status', value: records.length === 0 ? '⚠ No data' : loading ? 'Analysing…' : result ? '✓ Ready' : 'Awaiting' },
        ].map((k) => (
          <div key={k.label}>
            <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 3, fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: 12, color: k.label === 'Status' && records.length === 0 ? 'var(--red)' : k.label === 'Status' && result ? 'var(--green)' : 'var(--text)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '48px 32px', textAlign: 'center' }}>
          <Users size={26} color="var(--border2)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 13.5, color: 'var(--text3)' }}>No talent data matches the current selection</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', opacity: 0.7, marginTop: 4 }}>
            Add records in Document tagged "Talent data", or adjust the period/filters above.
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
              Analysis — {result.flags?.length || 0} item{result.flags?.length === 1 ? '' : 's'} flagged
            </span>
            <button onClick={exportReport} disabled={exporting} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card2)',
              border: '1px solid var(--border)', borderRadius: 7, padding: '6px 12px',
              color: 'var(--text2)', fontSize: 11.5, opacity: exporting ? 0.5 : 1,
            }}>
              <FileDown size={12} /> {exporting ? 'Preparing…' : 'Export as Word report'}
            </button>
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
