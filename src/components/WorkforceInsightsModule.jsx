import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { Activity, Users, X, Sparkles, RefreshCw, AlertTriangle, FileDown, Table2, TrendingDown, Printer, SlidersHorizontal, Check } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords, countBy, countByAgeBucket, countByTenureBucket, computeAttrition } from '../lib/parseTalentDocs.js'
import { buildWorkforceReportDocx } from '../lib/buildWorkforceReport.js'
import { exportRowsToExcel } from '../lib/exportExcel.js'
import PeriodRangeSelector from './PeriodRangeSelector.jsx'

const ageColor = '#fbbf24'
const tenureColor = '#B84480'
const levelColor = '#B84480'
const siteColor = '#f59e0b'
const functionColor = '#3b82f6'
const attritionColor = '#ef4444'
const genderColors = { Male: '#3b82f6', Female: '#f59e0b', Other: '#22c55e', Unknown: '#71717A' }

const tooltipStyle = {
  background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 6,
  fontSize: 12, color: 'var(--text)', padding: '6px 10px',
}
const axisStyle = { fontSize: 11, fill: 'var(--text3)' }

function ChartCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
      padding: '16px 18px', flex: '1 1 320px', minWidth: 280,
    }}>
      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  )
}

const AGE_RANGES = {
  'Under 25': (a) => a < 25, '25–34': (a) => a >= 25 && a <= 34, '35–44': (a) => a >= 35 && a <= 44,
  '45–54': (a) => a >= 45 && a <= 54, '55+': (a) => a >= 55,
}
const TENURE_RANGES = {
  '< 1 yr': (y) => y < 1, '1–3 yrs': (y) => y >= 1 && y <= 3, '4–7 yrs': (y) => y >= 4 && y <= 7,
  '8–15 yrs': (y) => y >= 8 && y <= 15, '15+ yrs': (y) => y > 15,
}

const CHART_OPTIONS = [
  { id: 'level', label: 'Headcount by Job Level' },
  { id: 'site', label: 'Headcount by Site' },
  { id: 'function', label: 'Headcount by Function' },
  { id: 'age', label: 'Age Distribution' },
  { id: 'gender', label: 'Gender Mix' },
  { id: 'tenure', label: 'Years of Service' },
  { id: 'attritionTrend', label: 'Attrition — Year on Year' },
]
const MIN_CHARTS = 4

function ChartPicker({ selected, onToggle }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card2)',
        border: '1px solid var(--border)', borderRadius: 7, padding: '7px 12px',
        color: 'var(--text2)', fontSize: 11.5,
      }}>
        <SlidersHorizontal size={12} /> Charts ({selected.length}/{CHART_OPTIONS.length})
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{
            position: 'absolute', top: '110%', right: 0, zIndex: 11, width: 240,
            background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 9,
            padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 10, color: 'var(--text3)', padding: '4px 6px 8px' }}>Select at least {MIN_CHARTS} charts</p>
            {CHART_OPTIONS.map((opt) => {
              const isOn = selected.includes(opt.id)
              const disableUncheck = isOn && selected.length <= MIN_CHARTS
              return (
                <button
                  key={opt.id}
                  onClick={() => !disableUncheck && onToggle(opt.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                    background: 'none', padding: '7px 6px', borderRadius: 6, fontSize: 12,
                    color: disableUncheck ? 'var(--text3)' : 'var(--text)', opacity: disableUncheck ? 0.6 : 1,
                    cursor: disableUncheck ? 'not-allowed' : 'pointer',
                  }}
                >
                  <span style={{
                    width: 15, height: 15, borderRadius: 4, border: `1px solid ${isOn ? '#fbbf24' : 'var(--border2)'}`,
                    background: isOn ? 'rgba(251,191,36,0.15)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {isOn && <Check size={10} color="#fbbf24" />}
                  </span>
                  {opt.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function WorkforceInsightsModule() {
  const [talentDocs, setTalentDocs] = useState([])
  const [startPeriod, setStartPeriod] = useState({ month: 0, year: 2025 })
  const [endPeriod, setEndPeriod] = useState({ month: 11, year: 2026 })
  const [siteFilter, setSiteFilter] = useState('all')
  const [functionFilter, setFunctionFilter] = useState('all')
  const [visibleCharts, setVisibleCharts] = useState(CHART_OPTIONS.map((c) => c.id))
  const [drill, setDrill] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(null)
  const [exportingDocx, setExportingDocx] = useState(false)

  useEffect(() => { setTalentDocs(getDocumentsByType('talent')) }, [])

  const allRecords = useMemo(
    () => parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n')),
    [talentDocs]
  )

  const cycles = useMemo(
    () => [...new Set(allRecords.map((r) => r.appraisalCycle))].filter(Boolean).sort((a, b) => a - b),
    [allRecords]
  )

  const rangeStartYear = Math.min(startPeriod.year, endPeriod.year)
  const rangeEndYear = Math.max(startPeriod.year, endPeriod.year)
  const cycleRangeYears = useMemo(
    () => cycles.filter((c) => c >= rangeStartYear && c <= rangeEndYear),
    [cycles, rangeStartYear, rangeEndYear]
  )

  // Active workforce "as of" the range's end year = composition snapshot
  const activeInCycle = useMemo(
    () => allRecords.filter((r) => r.status === 'Active' && r.appraisalCycle === rangeEndYear),
    [allRecords, rangeEndYear]
  )

  const siteOptions = useMemo(() => countBy(activeInCycle, 'site').map((c) => c.name), [activeInCycle])
  const functionOptions = useMemo(() => countBy(activeInCycle, 'function').map((c) => c.name), [activeInCycle])

  const records = useMemo(() => activeInCycle.filter((r) =>
    (siteFilter === 'all' || r.site === siteFilter) &&
    (functionFilter === 'all' || r.function === functionFilter)
  ), [activeInCycle, siteFilter, functionFilter])

  const periodLabel = rangeStartYear === rangeEndYear ? `Cycle ${rangeEndYear}` : `${rangeStartYear}–${rangeEndYear} (as of ${rangeEndYear})`
  const filterLabel = [
    periodLabel,
    siteFilter !== 'all' ? siteFilter : null,
    functionFilter !== 'all' ? functionFilter : null,
  ].filter(Boolean).join(' · ')

  const byLevel = useMemo(() => countBy(records, 'level').sort((a, b) => {
    const na = parseInt(a.name.replace('L', ''), 10) || 0
    const nb = parseInt(b.name.replace('L', ''), 10) || 0
    return na - nb
  }), [records])
  const bySite = useMemo(() => countBy(records, 'site'), [records])
  const byFunction = useMemo(() => countBy(records, 'function').sort((a, b) => b.value - a.value), [records])

  const withDemo = records.filter((r) => r.age != null || r.gender || r.yearsOfService != null)
  const ageData = countByAgeBucket(records)
  const tenureData = countByTenureBucket(records)
  const genderCounts = {}
  records.forEach((r) => {
    const g = r.gender || 'Unknown'
    genderCounts[g] = (genderCounts[g] || 0) + 1
  })
  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }))

  const attrition = useMemo(() => computeAttrition(allRecords, rangeEndYear), [allRecords, rangeEndYear])
  const attritionByYear = useMemo(
    () => cycleRangeYears.map((c) => {
      const a = computeAttrition(allRecords, c)
      return { name: String(c), value: Number(a.rate.toFixed(1)) }
    }),
    [allRecords, cycleRangeYears]
  )

  useEffect(() => { setSummary(null) }, [rangeStartYear, rangeEndYear, siteFilter, functionFilter])

  function toggleChart(id) {
    setVisibleCharts((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id])
  }
  const show = (id) => visibleCharts.includes(id)

  function drillAge(bucketLabel) {
    setDrill({ label: `Age ${bucketLabel}`, matches: records.filter((r) => r.age != null && AGE_RANGES[bucketLabel]?.(r.age)) })
  }
  function drillTenure(bucketLabel) {
    setDrill({ label: `Tenure ${bucketLabel}`, matches: records.filter((r) => r.yearsOfService != null && TENURE_RANGES[bucketLabel]?.(r.yearsOfService)) })
  }
  function drillGender(g) {
    setDrill({ label: `Gender: ${g}`, matches: records.filter((r) => (r.gender || 'Unknown') === g) })
  }
  function drillField(label, field, value) {
    setDrill({ label, matches: records.filter((r) => r[field] === value) })
  }
  function drillAttrition() {
    setDrill({ label: `Left in Cycle ${rangeEndYear}`, matches: attrition.leavers })
  }

  async function generateSummary() {
    setLoadingSummary(true); setSummaryError(null); setSummary(null)
    try {
      const res = await fetch('/api/workforce', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: filterLabel, recordCount: withDemo.length, ageData, genderData, tenureData,
          attritionRate: attrition?.rate?.toFixed(1), leaverCount: attrition?.leaverCount,
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setSummary(data.narrative)
    } catch (err) {
      setSummaryError(err.message || 'Something went wrong. Try again.')
    } finally { setLoadingSummary(false) }
  }

  async function exportWordReport() {
    setExportingDocx(true)
    try {
      await buildWorkforceReportDocx({
        scope: filterLabel, recordCount: withDemo.length, ageData, genderData, tenureData,
        attritionRate: attrition?.rate?.toFixed(1), leaverCount: attrition?.leaverCount, summary,
      })
    } catch (err) {
      setSummaryError('Could not generate the Word report. Try again.')
    } finally { setExportingDocx(false) }
  }

  function exportExcelData() {
    const rows = records.map((r) => ({
      Employee: r.employee || '', Role: r.role, Site: r.site, 'Business Unit': r.businessUnit || '',
      Level: r.level, 'Appraisal Cycle': r.appraisalCycle ?? '', Gender: r.gender || '',
      Age: r.age ?? '', 'Years of Service': r.yearsOfService ?? '',
    }))
    exportRowsToExcel(rows, `InsightFlow-Workforce-Data-${new Date().toISOString().slice(0, 10)}`, 'Workforce Data')
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Activity size={17} color="#fbbf24" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Workforce Insights</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 560, marginBottom: 20 }}>
        Headcount, composition, and attrition across the workforce in Document, for a selected
        period — a strategic read on workforce health, separate from the appraisal and development
        work in Talent Management.
      </p>

      {/* Period */}
      <div className="no-print" style={{ marginBottom: 14 }}>
        <PeriodRangeSelector
          years={cycles.length ? cycles : [2025, 2026]}
          start={startPeriod}
          end={endPeriod}
          onChangeStart={setStartPeriod}
          onChangeEnd={setEndPeriod}
          accentColor="#fbbf24"
        />
      </div>

      {/* Filters */}
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <ChartPicker selected={visibleCharts} onToggle={toggleChart} />
          {records.length > 0 && (
            <button onClick={exportExcelData} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 7,
              padding: '7px 12px', color: 'var(--text2)', fontSize: 11.5,
            }}>
              <Table2 size={12} /> Excel
            </button>
          )}
          {records.length > 0 && (
            <button onClick={() => window.print()} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 7,
              padding: '7px 12px', color: 'var(--text2)', fontSize: 11.5,
            }}>
              <Printer size={12} /> PDF
            </button>
          )}
        </div>
      </div>

      {records.length === 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '48px 32px', textAlign: 'center' }}>
          <Users size={26} color="var(--border2)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 13.5, color: 'var(--text3)' }}>No talent data matches the current selection</div>
        </div>
      )}

      {records.length > 0 && (
        <>
          {/* Attrition stat strip */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
            <button onClick={drillAttrition} style={{
              textAlign: 'left', flex: '1 1 200px', minWidth: 180, background: 'var(--card)',
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <TrendingDown size={13} color={attritionColor} />
                <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                  Attrition — Cycle {rangeEndYear}
                </span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: attritionColor }}>{attrition?.rate?.toFixed(1)}%</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{attrition?.leaverCount} left of {attrition?.headcount} in cycle</div>
            </button>
            {show('attritionTrend') && attritionByYear.length > 1 && (
              <ChartCard title="Attrition Rate — Year on Year">
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={attritionByYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={30} unit="%" />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="value" fill={attritionColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}
          </div>
          <p style={{ fontSize: 10.5, color: 'var(--text3)', marginTop: 0, marginBottom: 18, fontStyle: 'italic' }}>
            Attrition rate = leavers in cycle ÷ (active + leavers in cycle) × 100 — a simplified phase-1 proxy, not official HR methodology.
          </p>

          <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>Click any bar or slice to see who's behind the number.</p>

          {/* Headcount charts */}
          {(show('level') || show('site') || show('function')) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
              {show('level') && (
                <ChartCard title="Headcount by Job Level">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={byLevel}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: 'var(--border)' }} tickLine={false} interval={0} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" fill={levelColor} radius={[4, 4, 0, 0]} cursor="pointer" onClick={(d) => drillField(`Level ${d.name}`, 'level', d.name)} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
              {show('site') && (
                <ChartCard title="Headcount by Site">
                  <ResponsiveContainer width="100%" height={Math.max(180, bySite.length * 34)}>
                    <BarChart data={bySite} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" tick={{ ...axisStyle, fontSize: 10.5 }} axisLine={false} tickLine={false} width={110} interval={0} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" fill={siteColor} radius={[0, 4, 4, 0]} cursor="pointer" onClick={(d) => drillField(d.name, 'site', d.name)} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
              {show('function') && (
                <ChartCard title="Headcount by Function">
                  <ResponsiveContainer width="100%" height={Math.max(180, byFunction.length * 30)}>
                    <BarChart data={byFunction} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" tick={{ ...axisStyle, fontSize: 10.5 }} axisLine={false} tickLine={false} width={110} interval={0} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" fill={functionColor} radius={[0, 4, 4, 0]} cursor="pointer" onClick={(d) => drillField(d.name, 'function', d.name)} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </div>
          )}

          {withDemo.length > 0 && (show('age') || show('gender') || show('tenure')) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: drill ? 14 : 0 }}>
              {show('age') && (
                <ChartCard title="Age Distribution">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: 'var(--border)' }} tickLine={false} interval={0} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" fill={ageColor} radius={[4, 4, 0, 0]} cursor="pointer" onClick={(d) => drillAge(d.name)} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
              {show('gender') && (
                <ChartCard title="Gender Mix">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3} cursor="pointer" onClick={(d) => drillGender(d.name)}>
                        {genderData.map((entry, i) => <Cell key={i} fill={genderColors[entry.name] || genderColors.Unknown} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text3)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
              {show('tenure') && (
                <ChartCard title="Years of Service">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={tenureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} interval={0} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="value" fill={tenureColor} radius={[4, 4, 0, 0]} cursor="pointer" onClick={(d) => drillTenure(d.name)} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </div>
          )}

          {drill && (
            <div className="no-print" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 20, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={13} color="var(--text3)" />
                  <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                    {drill.label} — {drill.matches.length} record{drill.matches.length === 1 ? '' : 's'}
                  </span>
                </div>
                <button onClick={() => setDrill(null)} style={{ background: 'none' }}><X size={14} color="var(--text3)" /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 240, overflowY: 'auto' }}>
                {drill.matches.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 7,
                    padding: '7px 12px', fontSize: 12,
                  }}>
                    <span style={{ color: 'var(--text)' }}>{r.employee || <em style={{ color: 'var(--text3)' }}>Name not provided</em>}</span>
                    <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 11 }}>
                      {r.role} · {r.site}{r.exitDate ? ` · left ${r.exitDate}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
              AI Summary — {filterLabel}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {summary && (
                <button onClick={exportWordReport} disabled={exportingDocx} style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card2)',
                  border: '1px solid var(--border)', borderRadius: 7, padding: '8px 12px',
                  color: 'var(--text2)', fontSize: 11.5, opacity: exportingDocx ? 0.5 : 1,
                }}>
                  <FileDown size={12} /> {exportingDocx ? 'Preparing…' : 'Export as Word report'}
                </button>
              )}
              <button onClick={generateSummary} disabled={loadingSummary} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)',
                borderRadius: 8, padding: '8px 16px', color: '#fbbf24', fontSize: 12, fontWeight: 500,
                opacity: loadingSummary ? 0.5 : 1,
              }}>
                {loadingSummary
                  ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                  : <><Sparkles size={12} /> {summary ? 'Regenerate summary' : 'Generate summary'}</>}
              </button>
            </div>
          </div>

          {summaryError && (
            <div className="no-print" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 12, display: 'flex', gap: 8 }}>
              <AlertTriangle size={14} color="var(--red)" />
              <span style={{ fontSize: 12.5, color: 'var(--red)' }}>{summaryError}</span>
            </div>
          )}

          {summary ? (
            <div style={{ background: 'var(--card)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 10, padding: '20px 24px' }}>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{summary}</p>
            </div>
          ) : (
            <p className="no-print" style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>
              Generate a narrative read on this selection — only aggregated counts are sent, no individual employee data.
            </p>
          )}

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </div>
  )
}
