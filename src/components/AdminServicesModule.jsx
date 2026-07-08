import { useEffect, useRef, useState } from 'react'
import { Headset, Send, FileText, FileDown } from 'lucide-react'
import { getDocumentsByType } from '../data/documentStore.js'
import { buildChatTranscriptDocx } from '../lib/buildChatTranscript.js'

const starterQuestions = [
  'How many days of annual leave do I get?',
  'Can I work from home permanently?',
  'What does my new job level mean?',
  'How do I raise a concern about my manager?',
]

export default function AdminServicesModule() {
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
      const res = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, context: policyDocs.map((d) => ({ title: d.title, body: d.body })) }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.answer }])
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

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Headset size={17} color="var(--blue)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Admin Services</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 560, marginBottom: 20 }}>
        Reads policy, onboarding, and general enquiry documents from Document. Employees ask
        questions here directly, so HR spends its time on talent and culture work instead.
      </p>

      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Chat panel */}
        <div style={{
          flex: '1 1 480px', minWidth: 320, background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 10, display: 'flex', flexDirection: 'column', height: 480, overflow: 'hidden',
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
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', borderRadius: 10, padding: '9px 13px', fontSize: 13, lineHeight: 1.6,
                  background: m.role === 'user' ? 'var(--card2)' : 'rgba(59,130,246,0.08)',
                  color: m.role === 'user' ? 'var(--text)' : 'var(--text2)',
                }}>{m.content}</div>
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
    </div>
  )
}
