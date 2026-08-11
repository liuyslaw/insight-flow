import { useEffect, useRef, useState } from 'react'
import { Headset, Send, FileText, FileDown, MessageSquare, CalendarClock, Plus, CheckCircle2, XCircle, Library } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { buildChatTranscriptDocx } from '../lib/buildChatTranscript.js'
import { getFwaRequests, addFwaRequest, respondToFwaRequest, getFwaStatus } from '../data/fwaStore.js'
import { retrieveChunks } from '../lib/retrieval.js'

const starterQuestions = [
  'How many days of annual leave do I get?',
  'Can I work from home permanently?',
  'What does my new job level mean?',
  'How do I raise a concern about my manager?',
]

const fwaTypeLabels = { hours: 'Hours', location: 'Location', pattern: 'Pattern' }

// Urgency -> accent colour, using the same CSS custom properties the rest
// of this component (and the rest of the app) already relies on.
const urgencyColor = { ok: 'var(--green)', warning: 'var(--gold)', overdue: 'var(--red)', done: 'var(--text3)' }

export default function AdminServicesModule() {
  const [view, setView] = useState('chat') // 'chat' | 'fwa'

  const [policyDocs, setPolicyDocs] = useState([])
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi, I'm the HR assistant. Ask me about leave, remote work, appraisals, benefits, or workplace conduct — I answer from the current repository, not a generic script." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => { setPolicyDocs(getDocumentsByType('policy')) }, [])
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [messages])

  async function send(question) {
    const text = (question ?? input).trim()
    if (!text || loading) return
    setMessages((m) => [...m, { role: 'user', content: text }])
    setInput(''); setLoading(true)
    try {
      // Retrieve only the passages relevant to this question instead of
      // sending every published policy in full — see ../lib/retrieval.js
      // for why: a 30-50 page handbook sent whole would blow Groq's
      // rate limit on a single question.
      const { chunks, sourceTitles, usedChunkCount, totalChunkCount } = retrieveChunks(policyDocs, text)
      const context = chunks.map((c) => ({ title: c.docTitle, body: c.text }))

      const res = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, context }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setMessages((m) => [...m, {
        role: 'assistant', content: data.answer,
        sources: sourceTitles, retrievalNote: `${usedChunkCount} of ${totalChunkCount} passages consulted`,
      }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: "Couldn't reach the assistant just now — try again in a moment." }])
    } finally { setLoading(false) }
  }

  const [exportingDocx, setExportingDocx] = useState(false)

  async function exportTranscript() {
    const hasExchange = messages.some((m) => m.role === 'user')
    if (!hasExchange) return
    setExportingDocx(true)
    try {
      await buildChatTranscriptDocx(messages)
    } finally { setExportingDocx(false) }
  }

  // --- Flexible Work Arrangement (FWA) tracker -----------------------------
  // Statutory 60-day written-response window, Employment Act 1955 s.60P.
  // See ../data/fwaStore.js for the store; daysElapsed/daysRemaining/label
  // are computed live by getFwaStatus() on every render, never stored.
  const [fwaRequests, setFwaRequests] = useState([])
  const [fwaName, setFwaName] = useState('')
  const [fwaType, setFwaType] = useState('hours')
  const [fwaDetails, setFwaDetails] = useState('')
  const [respondingId, setRespondingId] = useState(null)
  const [responseNote, setResponseNote] = useState('')

  useEffect(() => { setFwaRequests(getFwaRequests()) }, [])

  function submitFwaRequest() {
    if (!fwaName.trim() || !fwaDetails.trim()) return
    const next = addFwaRequest({ employeeName: fwaName, requestType: fwaType, requestDetails: fwaDetails })
    setFwaRequests(next)
    setFwaName(''); setFwaDetails(''); setFwaType('hours')
  }

  function submitResponse(id, decision) {
    const next = respondToFwaRequest(id, { decision, note: responseNote })
    setFwaRequests(next)
    setRespondingId(null); setResponseNote('')
  }

  const fieldStyle = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Headset size={17} color="var(--blue)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Admin Services</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 560, marginBottom: 18 }}>
        Reads policy, onboarding, and general enquiry documents from Document. Employees ask
        questions here directly, so HR spends its time on talent and culture work instead.
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { id: 'chat', label: 'Employee Q&A', Icon: MessageSquare },
          { id: 'fwa', label: 'Flexible Work Requests', Icon: CalendarClock },
        ].map(({ id, label, Icon }) => {
          const active = view === id
          return (
            <button key={id} onClick={() => setView(id)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 7, fontSize: 12.5, fontWeight: active ? 500 : 400,
              background: active ? 'rgba(59,130,246,0.12)' : 'var(--card)',
              border: `1px solid ${active ? 'rgba(59,130,246,0.35)' : 'var(--border)'}`,
              color: active ? 'var(--blue)' : 'var(--text2)',
            }}>
              <Icon size={13} /> {label}
              {id === 'fwa' && fwaRequests.some((r) => getFwaStatus(r).urgency === 'overdue') && (
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--red)' }} />
              )}
            </button>
          )
        })}
      </div>

      {view === 'chat' && (
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Chat panel */}
        <div style={{
          flex: '1 1 480px', minWidth: 320, background: 'var(--card-gradient)', border: '1px solid var(--border)', borderTop: '2px solid var(--blue)',
          boxShadow: 'var(--shadow-card)', borderRadius: 10, display: 'flex', flexDirection: 'column', height: 480, overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '10px 16px',
            borderBottom: '1px solid var(--border)', background: 'rgba(59,130,246,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--blue)' }} />
              <span style={{ fontSize: 10, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                Live Q&amp;A
              </span>
            </div>
            {messages.some((m) => m.role === 'user') && (
              <button onClick={exportTranscript} disabled={exportingDocx} style={{
                display: 'flex', alignItems: 'center', gap: 5, background: 'none',
                color: 'var(--text3)', fontSize: 10.5, opacity: exportingDocx ? 0.5 : 1,
              }}>
                <FileDown size={11} /> {exportingDocx ? 'Preparing…' : 'Export transcript'}
              </button>
            )}
          </div>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', borderRadius: 10, padding: '9px 13px', fontSize: 13, lineHeight: 1.6,
                  background: m.role === 'user' ? 'var(--card2)' : 'rgba(59,130,246,0.08)',
                  color: m.role === 'user' ? 'var(--text)' : 'var(--text2)',
                }}>{m.content}</div>
                {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, maxWidth: '82%',
                    fontSize: 10.5, color: 'var(--text3)',
                  }}>
                    <Library size={10} />
                    <span>{m.sources.join(' · ')} ({m.retrievalNote})</span>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'rgba(59,130,246,0.08)', color: 'var(--text3)', borderRadius: 10, padding: '9px 13px', fontSize: 12, fontFamily: 'var(--mono)' }}>
                  thinking…
                </div>
              </div>
            )}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', padding: 10, display: 'flex', gap: 8, background: 'var(--bg2)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask an HR question…"
              style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)' }}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)',
              borderRadius: 8, padding: '9px 14px', color: 'var(--blue)', fontSize: 12.5, fontWeight: 500,
              opacity: (loading || !input.trim()) ? 0.4 : 1,
            }}>
              <Send size={13} /> Send
            </button>
          </div>
        </div>

        {/* Side info */}
        <div style={{ flex: '0 1 260px', minWidth: 220, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
              Try asking
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {starterQuestions.map((q) => (
                <button key={q} onClick={() => send(q)} style={{
                  textAlign: 'left', fontSize: 12.5, background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 10px', color: 'var(--text2)',
                }}>{q}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
              Repository loaded — {policyDocs.length} doc{policyDocs.length === 1 ? '' : 's'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {policyDocs.map((d) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
                  <FileText size={11} color="var(--text3)" /> {d.title}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic', marginTop: 8 }}>Managed in the Document tab.</p>
          </div>
        </div>
      </div>
      )}

      {view === 'fwa' && (
      <div>
        <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 640, marginBottom: 18 }}>
          Employment Act 1955 s.60P: an employee may request a flexible work arrangement (hours,
          location, or pattern); the employer must respond in writing within 60 days of receipt.
          This tracker starts the clock on submission and stops it the moment HR records a decision.
        </p>

        {/* New request form */}
        <div style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
            New request
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <input
              value={fwaName}
              onChange={(e) => setFwaName(e.target.value)}
              placeholder="Employee name"
              style={{ ...fieldStyle, flex: '1 1 220px' }}
            />
            <select
              value={fwaType}
              onChange={(e) => setFwaType(e.target.value)}
              style={{ ...fieldStyle, flex: '0 1 160px' }}
            >
              <option value="hours">Hours</option>
              <option value="location">Location</option>
              <option value="pattern">Pattern</option>
            </select>
          </div>
          <textarea
            value={fwaDetails}
            onChange={(e) => setFwaDetails(e.target.value)}
            placeholder="Request details…"
            rows={2}
            style={{ ...fieldStyle, width: '100%', marginBottom: 10, resize: 'vertical', fontFamily: 'var(--font)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={submitFwaRequest} disabled={!fwaName.trim() || !fwaDetails.trim()} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)',
              borderRadius: 8, padding: '9px 16px', color: 'var(--blue)', fontSize: 12.5, fontWeight: 500,
              opacity: (!fwaName.trim() || !fwaDetails.trim()) ? 0.4 : 1,
            }}>
              <Plus size={13} /> Submit request
            </button>
          </div>
        </div>

        {/* Requests list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fwaRequests.length === 0 && (
            <p style={{ fontSize: 12.5, color: 'var(--text3)', fontStyle: 'italic' }}>No flexible work requests yet.</p>
          )}
          {fwaRequests.map((r) => {
            const s = getFwaStatus(r)
            const color = urgencyColor[s.urgency]
            const isResponding = respondingId === r.id
            return (
              <div key={r.id} style={{
                background: 'var(--card-gradient)', border: `1px solid ${s.urgency === 'overdue' ? 'rgba(239,68,68,0.35)' : 'var(--border)'}`,
                boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 280px', minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{r.employeeName}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                        background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text2)',
                      }}>{fwaTypeLabels[r.requestType] || r.requestType}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{r.requestDetails}</p>
                    <p style={{ fontSize: 10.5, color: 'var(--text3)', marginTop: 6, fontFamily: 'var(--mono)' }}>
                      Submitted {new Date(r.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    {r.status !== 'Pending' && (
                      <p style={{ fontSize: 11.5, color: 'var(--text2)', marginTop: 6 }}>
                        <strong style={{ color: r.status === 'Approved' ? 'var(--green)' : 'var(--red)' }}>{r.status}</strong>
                        {r.responseNote ? ` — ${r.responseNote}` : ''}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                      color, background: `${color}18`, border: `1px solid ${color}55`,
                    }}>
                      {s.label}
                    </span>
                    {r.status === 'Pending' && !isResponding && (
                      <button onClick={() => { setRespondingId(r.id); setResponseNote('') }} style={{
                        fontSize: 11, color: 'var(--text2)', background: 'var(--card2)',
                        border: '1px solid var(--border)', borderRadius: 6, padding: '5px 10px',
                      }}>Respond</button>
                    )}
                  </div>
                </div>

                {isResponding && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <textarea
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                      placeholder="Short note for the record (optional)…"
                      rows={2}
                      style={{ ...fieldStyle, width: '100%', marginBottom: 8, resize: 'vertical', fontFamily: 'var(--font)' }}
                    />
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => setRespondingId(null)} style={{
                        fontSize: 11.5, color: 'var(--text3)', background: 'none', padding: '7px 10px',
                      }}>Cancel</button>
                      <button onClick={() => submitResponse(r.id, 'Refused')} style={{
                        display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--red)',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 7, padding: '7px 12px',
                      }}>
                        <XCircle size={12} /> Refuse
                      </button>
                      <button onClick={() => submitResponse(r.id, 'Approved')} style={{
                        display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--green)',
                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 7, padding: '7px 12px',
                      }}>
                        <CheckCircle2 size={12} /> Approve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      )}
    </div>
  )
}
