import { useState, useEffect } from 'react'
import { ShieldCheck, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import {
  getComplyWorkers, addComplyWorker, updateComplyWorker, deleteComplyWorker,
  getComplyStatus, getComplySummary,
} from '../data/complyStore.js'

const urgencyColor = {
  overdue: 'var(--red)',
  urgent: 'var(--gold)',
  upcoming: 'var(--blue)',
  ok: 'var(--green)',
  unset: 'var(--text3)',
}
const urgencyRank = { overdue: 4, urgent: 3, upcoming: 2, ok: 1, unset: 0 }

const fieldStyle = {
  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
  padding: '9px 12px', fontSize: 13, color: 'var(--text)',
}
const labelStyle = {
  fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase',
  letterSpacing: 0.6, fontWeight: 600, marginBottom: 4, display: 'block',
}

function StatusPill({ label, status }) {
  const color = urgencyColor[status.urgency]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 108 }}>
      <span style={{ fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      <span style={{
        fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap',
        color, background: `${color}18`, border: `1px solid ${color}55`, width: 'fit-content',
      }}>
        {status.label}
      </span>
    </div>
  )
}

const emptyForm = {
  workerName: '', sector: 'Manufacturing', permitType: 'PLKS',
  permitExpiry: '', fomemaDue: '', levyDue: '', levyPaid: false,
  epfEnrolled: true, socsoEnrolled: true, eisEnrolled: true, notes: '',
}

export default function ComplyModule() {
  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)

  useEffect(() => { setWorkers(getComplyWorkers()) }, [])

  const summary = getComplySummary(workers)

  const rows = workers
    .map((w) => ({ worker: w, status: getComplyStatus(w) }))
    .filter((r) => filter === 'all' || r.status.overallUrgency === filter)
    .sort((a, b) => urgencyRank[b.status.overallUrgency] - urgencyRank[a.status.overallUrgency])

  function submitAdd() {
    if (!form.workerName.trim()) return
    const next = addComplyWorker(form)
    setWorkers(next)
    setForm(emptyForm)
    setShowAdd(false)
  }

  function startEdit(w) {
    setEditingId(w.id)
    setEditForm({ ...w })
  }

  function saveEdit() {
    const next = updateComplyWorker(editingId, editForm)
    setWorkers(next)
    setEditingId(null)
    setEditForm(null)
  }

  function removeWorker(id) {
    setWorkers(deleteComplyWorker(id))
  }

  const tiles = [
    { key: 'overdue', label: 'Overdue', count: summary.overdue, color: 'var(--red)' },
    { key: 'urgent', label: 'Urgent (in window)', count: summary.urgent, color: 'var(--gold)' },
    { key: 'upcoming', label: 'Upcoming', count: summary.upcoming, color: 'var(--blue)' },
    { key: 'ok', label: 'Clear', count: summary.clear, color: 'var(--green)' },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1040 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <ShieldCheck size={17} color="var(--red)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Comply</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 640, marginBottom: 6 }}>
        Foreign worker permit (PLKS), FOMEMA, levy and statutory contribution (EPF/SOCSO/EIS)
        deadlines in one place, tracked across JIM, JTKSM, SOCSO and EPF. Renewal should start
        ~90 days before PLKS expiry; FOMEMA and levy windows are tighter, ~30 days.
      </p>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: 'var(--text3)',
        background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8,
        padding: '8px 12px', marginBottom: 20, maxWidth: 640, lineHeight: 1.5,
      }}>
        <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
        Reference tool only — always confirm current deadlines, rates and requirements directly
        with JTKSM, Immigration, SOCSO or EPF before acting on an alert shown here.
      </div>

      {/* Summary tiles */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        {tiles.map((t) => {
          const active = filter === t.key
          return (
            <button key={t.key} onClick={() => setFilter(active ? 'all' : t.key)} style={{
              flex: '1 1 130px', textAlign: 'left', background: active ? `${t.color}14` : 'var(--card-gradient)',
              border: `1px solid ${active ? `${t.color}55` : 'var(--border)'}`, boxShadow: 'var(--shadow-card)',
              borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: t.color, fontFamily: 'var(--mono)' }}>{t.count}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{t.label}</div>
            </button>
          )
        })}
      </div>

      {/* Add worker */}
      <div style={{ marginBottom: 20 }}>
        {!showAdd ? (
          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.35)', borderRadius: 8, padding: '9px 16px',
            color: 'var(--blue)', fontSize: 12.5, fontWeight: 500,
          }}>
            <Plus size={13} /> Add worker
          </button>
        ) : (
          <div style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 12 }}>
              New worker
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={labelStyle}>Worker name</label>
                <input style={{ ...fieldStyle, width: '100%' }} value={form.workerName}
                  onChange={(e) => setForm({ ...form, workerName: e.target.value })} placeholder="Full name" />
              </div>
              <div>
                <label style={labelStyle}>PLKS expiry</label>
                <input type="date" style={{ ...fieldStyle, width: '100%' }} value={form.permitExpiry}
                  onChange={(e) => setForm({ ...form, permitExpiry: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>FOMEMA due</label>
                <input type="date" style={{ ...fieldStyle, width: '100%' }} value={form.fomemaDue}
                  onChange={(e) => setForm({ ...form, fomemaDue: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Levy due</label>
                <input type="date" style={{ ...fieldStyle, width: '100%' }} value={form.levyDue}
                  onChange={(e) => setForm({ ...form, levyDue: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
              {[
                ['levyPaid', 'Levy paid'], ['epfEnrolled', 'EPF enrolled'],
                ['socsoEnrolled', 'SOCSO enrolled'], ['eisEnrolled', 'EIS enrolled'],
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
                  <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                  {label}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAdd(false); setForm(emptyForm) }} style={{ fontSize: 11.5, color: 'var(--text3)', background: 'none', padding: '7px 10px' }}>
                Cancel
              </button>
              <button onClick={submitAdd} disabled={!form.workerName.trim()} style={{
                display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(59,130,246,0.35)', borderRadius: 8, padding: '9px 16px',
                color: 'var(--blue)', fontSize: 12.5, fontWeight: 500, opacity: !form.workerName.trim() ? 0.4 : 1,
              }}>
                <Plus size={13} /> Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Worker list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.length === 0 && (
          <p style={{ fontSize: 12.5, color: 'var(--text3)', fontStyle: 'italic' }}>No workers match this filter.</p>
        )}
        {rows.map(({ worker: w, status: s }) => {
          const isEditing = editingId === w.id
          return (
            <div key={w.id} style={{
              background: 'var(--card-gradient)',
              border: `1px solid ${s.overallUrgency === 'overdue' ? 'rgba(239,68,68,0.35)' : 'var(--border)'}`,
              boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', minWidth: 180 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{w.workerName}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text3)' }}>{w.sector} · {w.permitType}</div>
                  {w.notes && <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6, lineHeight: 1.5 }}>{w.notes}</p>}
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <StatusPill label="Permit" status={s.permit} />
                  <StatusPill label="FOMEMA" status={s.fomema} />
                  <StatusPill label="Levy" status={s.levy} />
                  <StatusPill label="Statutory" status={s.statutory} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => (isEditing ? setEditingId(null) : startEdit(w))} style={{
                    fontSize: 11, color: 'var(--text2)', background: 'var(--card2)',
                    border: '1px solid var(--border)', borderRadius: 6, padding: '6px 9px', display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Pencil size={11} /> {isEditing ? 'Close' : 'Edit'}
                  </button>
                  <button onClick={() => removeWorker(w.id)} style={{
                    fontSize: 11, color: 'var(--red)', background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '6px 9px', display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={labelStyle}>PLKS expiry</label>
                      <input type="date" style={{ ...fieldStyle, width: '100%' }} value={editForm.permitExpiry || ''}
                        onChange={(e) => setEditForm({ ...editForm, permitExpiry: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>FOMEMA due</label>
                      <input type="date" style={{ ...fieldStyle, width: '100%' }} value={editForm.fomemaDue || ''}
                        onChange={(e) => setEditForm({ ...editForm, fomemaDue: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Levy due</label>
                      <input type="date" style={{ ...fieldStyle, width: '100%' }} value={editForm.levyDue || ''}
                        onChange={(e) => setEditForm({ ...editForm, levyDue: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                    {[
                      ['levyPaid', 'Levy paid'], ['epfEnrolled', 'EPF enrolled'],
                      ['socsoEnrolled', 'SOCSO enrolled'], ['eisEnrolled', 'EIS enrolled'],
                    ].map(([key, label]) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
                        <input type="checkbox" checked={!!editForm[key]} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.checked })} />
                        {label}
                      </label>
                    ))}
                  </div>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Notes…" rows={2}
                    style={{ ...fieldStyle, width: '100%', marginBottom: 10, resize: 'vertical', fontFamily: 'var(--font)' }}
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingId(null)} style={{ fontSize: 11.5, color: 'var(--text3)', background: 'none', padding: '7px 10px' }}>
                      Cancel
                    </button>
                    <button onClick={saveEdit} style={{
                      fontSize: 11.5, color: 'var(--green)', background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.35)', borderRadius: 7, padding: '7px 14px',
                    }}>
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
