import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send } from 'lucide-react'

/**
 * moduleKey: 'talent' | 'workforce' — tells /api/insight-chat which framing to use
 * context: plain object of whatever aggregated data is currently in view — sent
 *   fresh on every question so answers stay grounded in the live filter/period
 * accentColor: hex or css var for the module's accent
 * starterQuestions: optional array of suggested questions
 * initialMessage: optional first assistant message (e.g. an auto-generated summary)
 */
export default function AIChatPanel({ moduleKey, context, accentColor, starterQuestions = [], initialMessage }) {
  const [messages, setMessages] = useState(
    initialMessage ? [{ role: 'assistant', content: initialMessage }] : []
  )
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (initialMessage) setMessages([{ role: 'assistant', content: initialMessage }])
  }, [initialMessage])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send(question) {
    const text = (question ?? input).trim()
    if (!text || loading) return
    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    setMessages((m) => [...m, { role: 'user', content: text }])
    setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/insight-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: moduleKey, context, question: text, history }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.answer }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: "Couldn't reach the assistant just now — try again in a moment." }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      <div style={{
        flex: '1 1 420px', minWidth: 300, background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 10, display: 'flex', flexDirection: 'column', height: 380, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
          borderBottom: '1px solid var(--border)', background: `${accentColor}12`,
        }}>
          <Sparkles size={12} color={accentColor} />
          <span style={{ fontSize: 10, color: accentColor, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
            Ask about this data
          </span>
        </div>
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {messages.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>
              Ask a question about the current selection — only the aggregated data shown on this page is sent, nothing else.
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', borderRadius: 9, padding: '8px 12px', fontSize: 12.5, lineHeight: 1.55,
                background: m.role === 'user' ? 'var(--card2)' : `${accentColor}10`,
                color: m.role === 'user' ? 'var(--text)' : 'var(--text2)',
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: `${accentColor}10`, color: 'var(--text3)', borderRadius: 9, padding: '8px 12px', fontSize: 11.5, fontFamily: 'var(--mono)' }}>
                thinking…
              </div>
            </div>
          )}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', padding: 9, display: 'flex', gap: 7, background: 'var(--bg2)' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="e.g. Which site has the most attrition?"
            style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--text)' }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: `${accentColor}18`, border: `1px solid ${accentColor}55`,
            borderRadius: 7, padding: '7px 12px', color: accentColor, fontSize: 11.5, fontWeight: 500,
            opacity: (loading || !input.trim()) ? 0.4 : 1,
          }}>
            <Send size={11} /> Send
          </button>
        </div>
      </div>

      {starterQuestions.length > 0 && (
        <div style={{ flex: '0 1 220px', minWidth: 200 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
            Try asking
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {starterQuestions.map((q) => (
              <button key={q} onClick={() => send(q)} style={{
                textAlign: 'left', fontSize: 12, background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '8px 10px', color: 'var(--text2)',
              }}>{q}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
