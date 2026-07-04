import { useEffect, useState } from 'react'
import { getKnowledgeBase, addDocument, removeDocument, resetToSample } from '../data/knowledgeBase.js'

export default function AdminModule() {
  const [docs, setDocs] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    setDocs(getKnowledgeBase())
  }, [])

  function handleAdd() {
    if (!title.trim() || !body.trim()) return
    const next = addDocument({ title, body })
    setDocs(next)
    setTitle('')
    setBody('')
    setNotice(`Added "${title.trim()}" to the knowledge base.`)
    setTimeout(() => setNotice(null), 3000)
  }

  function handleRemove(id) {
    setDocs(removeDocument(id))
  }

  function handleReset() {
    setDocs(resetToSample())
    setNotice('Reset to the sample policy set.')
    setTimeout(() => setNotice(null), 3000)
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    if (!title.trim()) setTitle(file.name.replace(/\.[^/.]+$/, ''))
    setBody(text)
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gold">
          Module 03 — Admin
        </span>
        <h1 className="font-display text-4xl text-white mt-2 mb-3">
          Build the knowledge base employees ask from
        </h1>
        <p className="text-text-dim max-w-2xl leading-relaxed text-[15px]">
          Upload or paste company policies, onboarding material, and general enquiry content here.
          The Self-Service Assistant answers only from what's in this repository — nothing is
          invented, and nothing leaves this browser session in this phase-1 demo.
        </p>
      </div>

      {/* Add document */}
      <section className="bg-card border border-line rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-line">
          <span className="text-[11px] font-mono uppercase tracking-widest text-text-faint">
            Add to repository
          </span>
        </div>
        <div className="p-5 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title — e.g. Parental Leave Policy"
            className="w-full bg-[#0e0e11] border border-line rounded-md px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the document content here, or upload a .txt file below…"
            className="w-full h-40 bg-[#0e0e11] border border-line rounded-md p-3 font-mono text-sm leading-relaxed text-text placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50"
          />
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wide text-gold hover:text-gold/80 cursor-pointer">
              Upload .txt file
              <input type="file" accept=".txt,.md" onChange={handleFile} className="hidden" />
            </label>
            <button
              onClick={handleAdd}
              disabled={!title.trim() || !body.trim()}
              className="bg-gold text-ink font-medium text-sm px-5 py-2.5 rounded-md disabled:opacity-25 disabled:cursor-not-allowed hover:bg-gold/85 transition-colors"
            >
              Add document
            </button>
          </div>
          {notice && <p className="text-xs font-mono text-gold">{notice}</p>}
        </div>
      </section>

      {/* Repository list */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-text-faint">
            Repository — {docs.length} document{docs.length === 1 ? '' : 's'}
          </span>
          <button
            onClick={handleReset}
            className="text-xs font-mono uppercase tracking-wide text-text-faint hover:text-text/80"
          >
            Reset to sample set
          </button>
        </div>
        <div className="space-y-2.5">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-card border border-line rounded-md p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium">{doc.title}</span>
                  <span className="text-[10px] font-mono uppercase text-text-faint border border-line rounded-full px-2 py-0.5">
                    {doc.source}
                  </span>
                </div>
                <p className="text-xs text-text-faint mt-1.5 line-clamp-2">{doc.body}</p>
              </div>
              <button
                onClick={() => handleRemove(doc.id)}
                className="shrink-0 text-xs font-mono uppercase text-flag-high/80 hover:text-flag-high"
              >
                Remove
              </button>
            </div>
          ))}
          {docs.length === 0 && (
            <p className="text-sm text-text-faint italic">
              Repository is empty — add a document above, or reset to the sample set.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
