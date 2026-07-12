import { Calendar } from 'lucide-react'

const PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'FY']
// FY (full year) ranks the same as Q4 — it represents the complete/year-end
// state, consistent with how annual-only data has always been treated here.
const PERIOD_RANK = { Q1: 1, Q2: 2, Q3: 3, Q4: 4, FY: 4 }

// "Now" for YTD purposes — matches the app's current context (July 2026 = Q3).
const TODAY = { period: 'Q3', year: 2026 }

function periodOrder(v) { return v.year * 10 + PERIOD_RANK[v.period] }

function Box({ label, value, years, onChange, accentColor, showYtd, onYtd }) {
  return (
    <div style={{
      background: 'var(--card)', border: `1px solid ${accentColor}55`, borderRadius: 8,
      padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 2 }}>
        {label}
      </span>
      <select
        value={value.period}
        onChange={(e) => onChange({ ...value, period: e.target.value })}
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 5, padding: '3px 5px', fontSize: 11.5, color: 'var(--text)', fontWeight: value.period === 'FY' ? 700 : 400 }}
      >
        {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <select
        value={value.year}
        onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 5, padding: '3px 5px', fontSize: 11.5, color: 'var(--text)' }}
      >
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      {showYtd && (
        <button onClick={onYtd} style={{
          fontSize: 10, color: accentColor, background: `${accentColor}18`, border: `1px solid ${accentColor}55`,
          borderRadius: 5, padding: '3px 7px', fontWeight: 500,
        }}>YTD</button>
      )}
    </div>
  )
}

/**
 * years: available cycle years, e.g. [2025, 2026]
 * start/end: { period: 'Q1'|'Q2'|'Q3'|'Q4'|'FY', year }
 *
 * Quarter selection is genuinely live where the data supports it: 2026 has
 * real per-quarter hire dates, so composition charts actually grow through
 * the year as you move the selector. 2025 only has annual data, so every
 * quarter shows the same year-end figure — stated below, not hidden.
 */
export default function PeriodRangeSelector({ years, start, end, onChangeStart, onChangeEnd, accentColor = 'var(--magenta)', quarterDataYears = [], snapshotLabel, snapshotYear }) {
  function setYtd() {
    onChangeEnd({ period: TODAY.period, year: TODAY.year })
  }

  const isRange = periodOrder(start) !== periodOrder(end)
  const hasQuarterData = quarterDataYears.includes(snapshotYear ?? end.year)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Calendar size={13} color="var(--text3)" />
        <Box label="From" value={start} years={years} onChange={onChangeStart} accentColor={accentColor} />
        <span style={{ color: 'var(--text3)', fontSize: 12 }}>→</span>
        <Box label="To" value={end} years={years} onChange={onChangeEnd} accentColor={accentColor} showYtd onYtd={setYtd} />
        <span style={{
          fontSize: 10.5, fontWeight: 600, color: accentColor, background: `${accentColor}18`,
          border: `1px solid ${accentColor}40`, borderRadius: 6, padding: '4px 10px',
        }}>
          Viewing: {snapshotLabel}
        </span>
      </div>
      <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, marginBottom: 0 }}>
        {!hasQuarterData
          ? `${snapshotYear ?? end.year} only has annual data — every quarter shows the same year-end snapshot. Select 2026 for live quarter-by-quarter change.`
          : isRange
            ? `Charts show whichever box you last changed. Year-on-year comparisons use every cycle from "From" to "To".`
            : 'Headcount and composition update live as you change either "From" or "To" — try moving either between Q1 and Q4.'}
      </p>
    </div>
  )
}
