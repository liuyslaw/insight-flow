import { useEffect, useState } from 'react'
import { Users, Clock } from 'lucide-react'
import { getPipeline, setStage, STAGES } from '../../data/hiringPipelineStore.js'

const STAGE_ORDER = ['Screened', 'Interview', 'Offer', 'Hired', 'Rejected']

function stageColor(stage) {
  if (stage === 'Offer') return 'var(--gold)'
  if (stage === 'Hired') return '#16a34a'
  if (stage === 'Rejected') return 'var(--red)'
  if (stage === 'Interview') return 'var(--blue)'
  return 'var(--text3)'
}

function daysSince(iso) {
  if (!iso) return null
  const then = new Date(iso).getTime()
  const now = Date.now()
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24))
  return days
}

function formatDaysSince(iso) {
  const days = daysSince(iso)
  if (days === null) return 'unknown'
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

export default function PipelineView() {
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    setCandidates(getPipeline())
  }

  function handleStageChange(id, newStage) {
    setStage(id, newStage)
    refresh()
  }

  if (candidates.length === 0) {
    return (
      <div>
        <p style={{ fontSize: 12.5, color: 'var(--text3)', fontStyle: 'italic' }}>
          No candidates yet — screen a CV or draft an offer letter to add one.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 18, maxWidth: 600 }}>
        Every candidate screened or offered through Hiring lands here automatically. Move candidates
        between stages as the process progresses — nothing here is derived from an ATS, you're the
        source of truth.
      </p>

      {STAGE_ORDER.map((stage) => {
        const inStage = candidates.filter((c) => c.stage === stage)
        return (
          <div key={stage} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                {stage}
              </span>
              <span style={{
                fontSize: 10.5, fontWeight: 600, color: stageColor(stage),
                background: 'var(--bg2)', border: `1px solid ${stageColor(stage)}`,
                borderRadius: 20, padding: '1px 8px',
              }}>
                {inStage.length}
              </span>
            </div>

            {inStage.length === 0 ? (
              <p style={{ fontSize: 11.5, color: 'var(--text3)', fontStyle: 'italic', marginBottom: 4 }}>
                No candidates at this stage.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {inStage.map((c) => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--card-gradient)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', borderRadius: 10,
                    padding: '12px 16px', flexWrap: 'wrap', gap: 10,
                    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220 }}>
                      <Users size={14} color="#16a34a" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text2)' }}>{c.role}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
                        color: 'var(--text3)',
                      }}>
                        <Clock size={11} /> Updated {formatDaysSince(c.updatedAt)}
                      </span>

                      <span style={{
                        fontSize: 10.5, fontWeight: 600, color: stageColor(c.stage),
                        background: 'var(--bg2)', border: `1px solid ${stageColor(c.stage)}`,
                        borderRadius: 20, padding: '2px 9px',
                      }}>
                        {c.stage}
                      </span>

                      <select
                        value={c.stage}
                        onChange={(e) => handleStageChange(c.id, e.target.value)}
                        style={{
                          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 7,
                          padding: '5px 8px', fontSize: 11.5, color: 'var(--text)',
                        }}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
