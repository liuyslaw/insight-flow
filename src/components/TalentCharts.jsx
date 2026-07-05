import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { countBy } from '../lib/parseTalentDocs.js'

const levelColor = '#B84480'
const siteColor = '#f59e0b'
const ratingColors = { 1: '#ef4444', 2: '#ef4444', 3: '#a1a1aa', 4: '#22c55e', 5: '#22c55e' }
const functionColor = '#3b82f6'

function ChartCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
      padding: '16px 18px', flex: '1 1 320px', minWidth: 280,
    }}>
      <div style={{
        fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase',
        letterSpacing: 0.8, fontWeight: 600, marginBottom: 14,
      }}>{title}</div>
      {children}
    </div>
  )
}

const tooltipStyle = {
  background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 6,
  fontSize: 12, color: 'var(--text)', padding: '6px 10px',
}
const axisStyle = { fontSize: 11, fill: 'var(--text3)' }

export default function TalentCharts({ records }) {
  if (!records.length) return null

  const byLevel = countBy(records, 'level').sort((a, b) => {
    const na = parseInt(a.name.replace('L', ''), 10) || 0
    const nb = parseInt(b.name.replace('L', ''), 10) || 0
    return na - nb
  })
  const bySite = countBy(records, 'site')
  const byFunction = countBy(records, 'function').sort((a, b) => b.value - a.value)
  const ratingCounts = [1, 2, 3, 4, 5].map((r) => ({
    name: `${r} / 5`,
    value: records.filter((rec) => rec.rating === r).length,
    rating: r,
  }))

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <BarChart3 size={14} color="var(--text3)" />
        <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
          Overview — {records.length} record{records.length === 1 ? '' : 's'}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        <ChartCard title="Headcount by Job Level">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={byLevel}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" fill={levelColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Headcount by Site">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bySite} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ ...axisStyle, fontSize: 10.5 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" fill={siteColor} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Appraisal Rating Distribution">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ratingCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {ratingCounts.map((entry, i) => (
                  <Cell key={i} fill={ratingColors[entry.rating]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Headcount by Function">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={byFunction} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ ...axisStyle, fontSize: 10.5 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" fill={functionColor} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
