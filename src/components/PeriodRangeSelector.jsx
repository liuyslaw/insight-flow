import { Calendar } from 'lucide-react'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// "Now" for YTD purposes — matches the app's current context.
const TODAY = { month: 6, year: 2026 } // month is 0-indexed (June=5, July=6)

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
        value={value.month}
        onChange={(e) => onChange({ ...value, month: Number(e.target.value) })}
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 5, padding: '3px 5px', fontSize: 11.5, color: 'var(--text)' }}
      >
        {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
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
 * start/end: { month, year }
 * Note: the underlying sample data has annual (not monthly) appraisal cycles,
 * so month selection is UI-ready for finer-grained data but current filtering
 * resolves at the year level — stated in the caption below the control.
 */
export default function PeriodRangeSelector({ years, start, end, onChangeStart, onChangeEnd, accentColor = 'var(--magenta)' }) {
  function setYtd() {
    onChangeEnd({ month: TODAY.month, year: TODAY.year })
  }

  const snapshotYear = Math.max(start.year, end.year)
  const isRange = start.year !== end.year

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
          Viewing: Cycle {snapshotYear}
        </span>
      </div>
      <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5, marginBottom: 0 }}>
        {isRange
          ? `Charts show the "To" period (${snapshotYear}). Year-on-year comparisons use every cycle from "From" to "To".`
          : 'Change "From" to an earlier year to also see year-on-year trend charts.'}
      </p>
    </div>
  )
}
