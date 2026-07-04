import { useState, useRef, useEffect } from 'react'
import { policies } from '../data/policies.js'

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
        "Hi, I'm the HR assistant. Ask me about leave, remote work, appraisals, benefits, or workplace conduct — I answer from the current policy set, not a generic script.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

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
        body: JSON.stringify({ question: text }),
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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Take the admin load off HR</h1>
        <p className="text-ink/60 max-w-2xl leading-relaxed">
          Generic HR questions answered instantly from your policy set, so your team spends its
          time on the talent and culture work — not repeating the leave policy for the tenth time
          this week. Policy content shown here is generic placeholder text for this demo.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-line rounded-lg flex flex-col h-[28rem] md:h-[34rem]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-ink text-white'
                      : 'bg-teal-soft text-ink/85'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-teal-soft text-ink/50 rounded-lg px-4 py-2.5 text-sm font-mono">
                  thinking…
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-line p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask an HR question…"
              className="flex-1 border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="bg-ink text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-30 hover:bg-teal transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-2">
              Try asking
            </h2>
            <div className="space-y-2">
              {starterQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="w-full text-left text-sm bg-white border border-line rounded-md px-3 py-2 hover:border-teal/50 hover:bg-teal-soft/50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-2">
              Policy set loaded
            </h2>
            <ul className="text-sm text-ink/60 space-y-1">
              {policies.map((p) => (
                <li key={p.title}>· {p.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
