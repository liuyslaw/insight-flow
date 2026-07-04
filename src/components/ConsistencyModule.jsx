import { useState } from 'react'
import { sampleTalentDocs } from '../data/sampleTalentDocs.js'

const severityStyles = {
  high: 'border-l-flag-high bg-flag-high/[0.07] text-flag-high',
  medium: 'border-l-flag-med bg-flag-med/[0.07] text-flag-med',
  low: 'border-l-flag-low bg-white/[0.03] text-flag-low',
}

export default function ConsistencyModule() {
  const [docs, setDocs] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  async function analyze() {
    if (!docs.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docs }),
      })
      if (!res.ok) throw new Error(`Analysis failed (${res.status})`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-magenta">
          Module 01 — Consistency Intelligence
        </span>
        <h1 className="font-display text-4xl text-white mt-2 mb-3">
          Catch what Workday won't flag
        </h1>
        <p className="text-text-dim max-w-2xl leading-relaxed text-[15px]">
          Paste or upload job description, job level, and appraisal exports from your job
          architecture rollout. InsightFlow reads across sites and flags level/JD mismatches,
          appraisal calibration outliers, and rating-narrative gaps — then writes the leadership
          summary.
        </p>
      </div>

      {/* Input section */}
      <section className="bg-card border border-line rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line">
          <span className="text-[11px] font-mono uppercase tracking-widest text-text-faint">
            Input — Job level, JD &amp; appraisal export
          </span>
          <button
            onClick={() => setDocs(sampleTalentDocs)}
            className="text-xs font-mono uppercase tracking-wide text-magenta hover:text-magenta/80"
          >
            Load sample export · 50 employees, SG/MY/EU/CN
          </button>
        </div>
        <div className="p-5">
          <textarea
            value={docs}
            onChange={(e) => setDocs(e.target.value)}
            placeholder="Paste exported JD text, assigned job levels, and appraisal narratives here — one record per site/role..."
            className="w-full h-56 md:h-72 bg-[#0e0e11] border border-line rounded-md p-3 font-mono text-sm leading-relaxed text-text placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-magenta/50 focus:border-magenta/50"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs font-mono text-text-faint">
              {docs.length.toLocaleString()} characters
            </span>
            <button
              onClick={analyze}
              disabled={loading || !docs.trim()}
              className="bg-magenta text-white text-sm font-medium px-5 py-2.5 rounded-md disabled:opacity-25 disabled:cursor-not-allowed hover:bg-magenta/85 transition-colors"
            >
              {loading ? 'Analysing…' : 'Analyse for inconsistencies'}
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="border-l-4 border-flag-high bg-flag-high/[0.07] text-flag-high text-sm p-4 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Analysis section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-faint">
                Analysis — {result.flags?.length || 0} item{result.flags?.length === 1 ? '' : 's'} flagged
              </span>
            </div>
            <div className="space-y-2.5">
              {(result.flags || []).map((flag, i) => (
                <div
                  key={i}
                  className={`border-l-4 rounded-r-md p-4 ${severityStyles[flag.severity] || severityStyles.low}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono uppercase tracking-wide">
                      {flag.type}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-current/30">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-sm text-text/90 leading-relaxed">{flag.detail}</p>
                  {flag.site && (
                    <p className="text-xs text-text-faint mt-1.5 font-mono">{flag.site}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* AI Analysis narrative panel */}
          {result.narrative && (
            <section className="bg-card border border-magenta/25 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-line bg-magenta-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-magenta" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-magenta">
                  AI Analysis — Leadership Summary
                </span>
              </div>
              <div className="p-5">
                <p className="text-[15px] leading-relaxed whitespace-pre-line text-text/90 font-display italic">
                  {result.narrative}
                </p>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
