import { useState, useRef, useEffect } from 'react'
import { getKnowledgeBase } from '../data/knowledgeBase.js'

const starterQuestions = [
  'How many days of annual leave do I get?',
  'Can I work from home permanently?',
  'What does my new job level mean?',
  'How do I raise a concern about my manager?',
]

export default function AssistantModule() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi, I'm the HR assistant. Ask me about leave, remote work, appraisals, benefits, or workplace conduct — I answer from the current knowledge base, not a generic script.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [kb, setKb] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    setKb(getKnowledgeBase())
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send(question) {
    const text = (question ?? input).trim()
    if (!text || loading) return
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          context: kb.map((d) => ({ title: d.title, body: d.body })),
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.answer }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: "Couldn't reach the assistant just now — try again in a moment." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-teal">
          Module 02 — Self-Service Assistant
        </span>
        <h1 className="font-display text-4xl text-white mt-2 mb-3">
          Take the admin load off HR
        </h1>
        <p className="text-text-dim max-w-2xl leading-relaxed text-[15px]">
          Generic HR questions answered instantly from the knowledge base built in the Admin
          module, so your team spends its time on the talent and culture work — not repeating the
          leave policy for the tenth time this week.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Chat panel */}
        <div className="md:col-span-2 bg-card border border-line rounded-lg flex flex-col h-[28rem] md:h-[32rem] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-line bg-teal-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-teal">
              AI Analysis — Live Q&amp;A
            </span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-white/10 text-white'
                      : 'bg-teal-soft text-text/90'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-teal-soft text-text-faint rounded-lg px-4 py-2.5 text-sm font-mono">
                  thinking…
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-line p-3 flex gap-2 bg-[#0e0e11]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask an HR question…"
              className="flex-1 bg-card border border-line rounded-md px-3 py-2 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-teal/50 focus:border-teal/50"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="bg-teal text-ink font-medium text-sm px-4 py-2 rounded-md disabled:opacity-25 disabled:cursor-not-allowed hover:bg-teal/85 transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-faint">
              Try asking
            </span>
            <div className="space-y-2 mt-2">
              {starterQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full text-left text-sm bg-card border border-line rounded-md px-3 py-2 text-text/85 hover:border-teal/40 hover:bg-teal-soft/40 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-faint">
              Knowledge base loaded — {kb.length} doc{kb.length === 1 ? '' : 's'}
            </span>
            <ul className="text-sm text-text-dim space-y-1 mt-2">
              {kb.map((d) => (
                <li key={d.id}>· {d.title}</li>
              ))}
            </ul>
            <p className="text-[11px] text-text-faint mt-2 italic">
              Managed in the Admin module.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
