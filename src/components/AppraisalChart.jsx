import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3, X, Users } from 'lucide-react'

const ratingColors = { 1: '#ef4444', 2: '#ef4444', 3: '#a1a1aa', 4: '#22c55e', 5: '#22c55e' }

function ChartCard({ title, total, children }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
      padding: '16px 18px', flex: '1 1 320px', minWidth: 280,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>{title}</div>
        {total != null && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: 'var(--text)', background: 'var(--card2)',
            border: '1px solid var(--border)', borderRadius: 5, padding: '2px 8px',
          }}>{total} total</span>
        )}
      </div>
      {children}
    </div>
  )
}

const tooltipStyle = {
  background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 6,
  fontSize: 12, color: 'var(--text)', padding: '6px 10px',
}
const axisStyle = { fontSize: 11, fill: 'var(--text3)' }

// records = active records for the currently selected cycle (for the distribution chart)
// allActiveRecords = active records across both cycles (for the YoY average chart)
export default function AppraisalChart({ records, allActiveRecords }) {
  const [drill, setDrill] = useState(null)

  if (!records.length) return null

  const ratingCounts = [1, 2, 3, 4, 5].map((r) => ({
    name: `${r} / 5`,
    value: records.filter((rec) => rec.rating === r).length,
    rating: r,
  }))

  const cycles = [...new Set(allActiveRecords.map((r) => r.appraisalCycle))].filter(Boolean).sort()
  const avgByCycle = cycles.map((c) => {
    const inCycle = allActiveRecords.filter((r) => r.appraisalCycle === c && r.rating != null)
    const avg = inCycle.length ? inCycle.reduce((s, r) => s + r.rating, 0) / inCycle.length : 0
    return { name: String(c), value: Number(avg.toFixed(2)) }
  })

  function drillRating(ratingValue) {
    setDrill({ label: `Rating ${ratingValue} / 5`, matches: records.filter((r) => r.rating === ratingValue) })
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <BarChart3 size={14} color="var(--text3)" />
        <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
          Appraisal Overview
        </span>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>Click a bar to see who's behind the number.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: drill ? 14 : 0 }}>
        <ChartCard title="Appraisal Rating Distribution — Selected Cycle" total={records.length}>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={ratingCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: 'var(--border)' }} tickLine={false} interval={0} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer" onClick={(d) => drillRating(d.rating)}>
                {ratingCounts.map((entry, i) => <Cell key={i} fill={ratingColors[entry.rating]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {avgByCycle.length > 1 && (
          <ChartCard title="Average Rating — Year on Year">
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={avgByCycle}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: 'var(--border)' }} tickLine={false} interval={0} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 5]} width={24} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" fill="#B84480" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {drill && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
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
                <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 11 }}>{r.role} · {r.level} · {r.site}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
