import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { Activity, Users, X, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords, countBy, countByAgeBucket, countByTenureBucket } from '../lib/parseTalentDocs.js'

const ageColor = '#fbbf24'
const tenureColor = '#B84480'
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

export default function WorkforceInsightsModule() {
  const [talentDocs, setTalentDocs] = useState([])
  const [siteFilter, setSiteFilter] = useState('all')
  const [functionFilter, setFunctionFilter] = useState('all')
  const [drill, setDrill] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(null)

  useEffect(() => { setTalentDocs(getDocumentsByType('talent')) }, [])

  const allRecords = useMemo(
    () => parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n')),
    [talentDocs]
  )

  const siteOptions = useMemo(() => countBy(allRecords, 'site').map((c) => c.name), [allRecords])
  const functionOptions = useMemo(() => countBy(allRecords, 'function').map((c) => c.name), [allRecords])

  const records = useMemo(() => allRecords.filter((r) =>
    (siteFilter === 'all' || r.site === siteFilter) &&
    (functionFilter === 'all' || r.function === functionFilter)
  ), [allRecords, siteFilter, functionFilter])

  const filterLabel = siteFilter === 'all' && functionFilter === 'all'
    ? 'All records'
    : [siteFilter !== 'all' ? siteFilter : null, functionFilter !== 'all' ? functionFilter : null].filter(Boolean).join(' · ')

  const withDemo = records.filter((r) => r.age != null || r.gender || r.yearsOfService != null)
  const ageData = countByAgeBucket(records)
  const tenureData = countByTenureBucket(records)
  const genderCounts = {}
  records.forEach((r) => {
    const g = r.gender || 'Unknown'
    genderCounts[g] = (genderCounts[g] || 0) + 1
  })
  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }))

  useEffect(() => { setSummary(null) }, [siteFilter, functionFilter])

  function drillAge(bucketLabel) {
    setDrill({ label: `Age ${bucketLabel}`, matches: records.filter((r) => r.age != null && AGE_RANGES[bucketLabel]?.(r.age)) })
  }
  function drillTenure(bucketLabel) {
    setDrill({ label: `Tenure ${bucketLabel}`, matches: records.filter((r) => r.yearsOfService != null && TENURE_RANGES[bucketLabel]?.(r.yearsOfService)) })
  }
  function drillGender(g) {
    setDrill({ label: `Gender: ${g}`, matches: records.filter((r) => (r.gender || 'Unknown') === g) })
  }

  async function generateSummary() {
    setLoadingSummary(true); setSummaryError(null); setSummary(null)
    try {
      const res = await fetch('/api/workforce', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: filterLabel, recordCount: withDemo.length, ageData, genderData, tenureData }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setSummary(data.narrative)
    } catch (err) {
      setSummaryError(err.message || 'Something went wrong. Try again.')
    } finally { setLoadingSummary(false) }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Activity size={17} color="#fbbf24" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Workforce Insights</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 560, marginBottom: 20 }}>
        Age, gender, and tenure mix across the workforce in Document — a quick read on whether the
        overall composition looks healthy, separate from the job-level and appraisal consistency
        work in Talent Management.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
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
      </div>

      {records.length === 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '48px 32px', textAlign: 'center' }}>
          <Users size={26} color="var(--border2)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 13.5, color: 'var(--text3)' }}>No talent data matches the current filter</div>
        </div>
      )}

      {records.length > 0 && withDemo.length === 0 && (
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 18, fontSize: 12, color: 'var(--gold)' }}>
          None of the current talent records carry age, gender, or years-of-service data. Add these columns to an Excel import, or include GENDER/AGE/YEARS OF SERVICE lines in a pasted record.
        </div>
      )}

      {withDemo.length > 0 && (
        <>
          <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>Click any bar or slice to see who's behind the number.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: drill ? 14 : 0 }}>
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

            <ChartCard title="Gender Mix">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3} cursor="pointer"
                    onClick={(d) => drillGender(d.name)}>
                    {genderData.map((entry, i) => (
                      <Cell key={i} fill={genderColors[entry.name] || genderColors.Unknown} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text3)' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

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
          </div>

          {drill && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
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
                      {r.role} · {r.site} · Age {r.age ?? '—'} · {r.yearsOfService ?? '—'} yrs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
              AI Summary — {filterLabel}
            </span>
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

          {summaryError && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 12, display: 'flex', gap: 8 }}>
              <AlertTriangle size={14} color="var(--red)" />
              <span style={{ fontSize: 12.5, color: 'var(--red)' }}>{summaryError}</span>
            </div>
          )}

          {summary ? (
            <div style={{ background: 'var(--card)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 10, padding: '20px 24px' }}>
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{summary}</p>
            </div>
          ) : (
            <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>
              Generate a narrative read on this selection's composition — only aggregated counts are sent, no individual employee data.
            </p>
          )}

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </div>
  )
}
