import { useEffect, useMemo, useState } from 'react'
import { Users, Sparkles, RefreshCw, AlertTriangle, ShieldAlert, Scale, FileDown, TrendingUp, Table2 } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords, countBy } from '../lib/parseTalentDocs.js'
import { buildTalentReportDocx } from '../lib/buildTalentReport.js'
import { exportRowsToExcel } from '../lib/exportExcel.js'
import AppraisalChart from './AppraisalChart.jsx'

const severityColor = { high: 'var(--red)', medium: 'var(--gold)', low: 'var(--text3)' }
const severityBg = { high: 'rgba(239,68,68,0.06)', medium: 'rgba(245,158,11,0.06)', low: 'rgba(255,255,255,0.03)' }
const severityBorder = { high: 'rgba(239,68,68,0.25)', medium: 'rgba(245,158,11,0.25)', low: 'var(--border)' }
const flagIcon = { 'Level/JD mismatch': ShieldAlert, 'Rating/narrative mismatch': AlertTriangle, 'Calibration variance': Scale }

export default function TalentManagementModule() {
  const [talentDocs, setTalentDocs] = useState([])
  const [cycle, setCycle] = useState(null)
  const [siteFilter, setSiteFilter] = useState('all')
  const [functionFilter, setFunctionFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => { setTalentDocs(getDocumentsByType('talent')) }, [])

  const allRecords = useMemo(
    () => parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n')),
    [talentDocs]
  )

  const cycles = useMemo(
    () => [...new Set(allRecords.map((r) => r.appraisalCycle))].filter(Boolean).sort((a, b) => b - a),
    [allRecords]
  )
  useEffect(() => { if (cycles.length && cycle == null) setCycle(cycles[0]) }, [cycles, cycle])

  const allActiveRecords = useMemo(() => allRecords.filter((r) => r.status === 'Active'), [allRecords])
  const cycleRecords = useMemo(
    () => allActiveRecords.filter((r) => cycle == null || r.appraisalCycle === cycle),
    [allActiveRecords, cycle]
  )

  const siteOptions = useMemo(() => countBy(cycleRecords, 'site').map((c) => c.name), [cycleRecords])
  const functionOptions = useMemo(() => countBy(cycleRecords, 'function').map((c) => c.name), [cycleRecords])

  const records = useMemo(() => cycleRecords.filter((r) =>
    (siteFilter === 'all' || r.site === siteFilter) &&
    (functionFilter === 'all' || r.function === functionFilter)
  ), [cycleRecords, siteFilter, functionFilter])

  const promotionCandidates = useMemo(
    () => records.filter((r) => r.rating >= 4).sort((a, b) => b.rating - a.rating),
    [records]
  )

  const filterLabel = [
    cycle ? `Cycle ${cycle}` : null,
    siteFilter !== 'all' ? siteFilter : null,
    functionFilter !== 'all' ? functionFilter : null,
  ].filter(Boolean).join(' · ') || 'All records'

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
    exportRowsToExcel(rows, `InsightFlow-Talent-Data-${new Date().toISOString().slice(0, 10)}`, 'Talent Data')
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
            Talent development and appraisal — job level/JD consistency, rating calibration across
            sites, and promotion readiness, for a selected appraisal cycle.
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

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={cycle ?? ''} onChange={(e) => setCycle(Number(e.target.value))} style={{
          background: 'var(--card)', border: '1px solid rgba(184,68,128,0.35)', borderRadius: 8,
          padding: '8px 12px', fontSize: 12.5, color: 'var(--magenta)', fontWeight: 500,
        }}>
          {cycles.map((c) => <option key={c} value={c}>Cycle {c}</option>)}
        </select>
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

      <AppraisalChart records={records} allActiveRecords={allActiveRecords} />

      {/* Promotion & succession candidates */}
      {records.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <TrendingUp size={13} color="var(--green)" />
            <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
              Promotion &amp; Succession Candidates — rating 4+ ({promotionCandidates.length})
            </span>
          </div>
          {promotionCandidates.length === 0 ? (
            <p style={{ fontSize: 12.5, color: 'var(--text3)', fontStyle: 'italic' }}>No candidates rated 4 or above in the current selection.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {promotionCandidates.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '9px 14px',
                }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text)' }}>{r.role} <span style={{ color: 'var(--text3)' }}>— {r.level} — {r.site}</span></span>
                  <span className="badge badge-green">{r.rating} / 5</span>
                </div>
              ))}
            </div>
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
            Add records in Document tagged "Talent data", or adjust the cycle/filters above.
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
