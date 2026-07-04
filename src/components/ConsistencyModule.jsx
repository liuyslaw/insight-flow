import { useState } from 'react'
import { sampleTalentDocs } from '../data/sampleTalentDocs.js'

const severityStyles = {
  high: 'border-l-flag-high bg-red-50/60 text-flag-high',
  medium: 'border-l-flag-med bg-amber-soft text-flag-med',
  low: 'border-l-flag-low bg-ink/5 text-flag-low',
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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">
          Catch what Workday won't flag
        </h1>
        <p className="text-ink/60 max-w-2xl leading-relaxed">
          Paste or upload job description, job level, and appraisal exports from your job
          architecture rollout. InsightFlow reads across sites and flags level/JD mismatches,
          appraisal calibration outliers, and rating-narrative gaps — then writes the leadership
          summary.
        </p>
      </div>

      <div className="bg-white border border-line rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-ink/70">
            Job level, JD &amp; appraisal export
          </label>
          <button
            onClick={() => setDocs(sampleTalentDocs)}
            className="text-xs font-mono uppercase tracking-wide text-teal hover:underline"
          >
            Load sample export (50 employees, SG/MY/EU/CN)
          </button>
        </div>
        <textarea
          value={docs}
          onChange={(e) => setDocs(e.target.value)}
          placeholder="Paste exported JD text, assigned job levels, and appraisal narratives here — one record per site/role..."
          className="w-full h-56 md:h-80 border border-line rounded-md p-3 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-ink/40">
            {docs.length.toLocaleString()} characters
          </span>
          <button
            onClick={analyze}
            disabled={loading || !docs.trim()}
            className="bg-ink text-white text-sm font-medium px-5 py-2.5 rounded-md disabled:opacity-30 hover:bg-teal transition-colors"
          >
            {loading ? 'Analysing…' : 'Analyse for inconsistencies'}
          </button>
        </div>
      </div>

      {error && (
        <div className="border-l-4 border-flag-high bg-red-50/60 text-flag-high text-sm p-4 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-3">
              {result.flags?.length || 0} item{result.flags?.length === 1 ? '' : 's'} flagged
            </h2>
            <div className="space-y-3">
              {(result.flags || []).map((flag, i) => (
                <div
                  key={i}
                  className={`border-l-4 rounded p-4 ${severityStyles[flag.severity] || severityStyles.low}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono uppercase tracking-wide">
                      {flag.type}
                    </span>
                    <span className="text-xs font-mono uppercase">{flag.severity}</span>
                  </div>
                  <p className="text-sm text-ink/80 leading-relaxed">{flag.detail}</p>
                  {flag.site && (
                    <p className="text-xs text-ink/40 mt-1 font-mono">{flag.site}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {result.narrative && (
            <div className="bg-white border border-line rounded-lg p-5">
              <h2 className="text-xs font-mono uppercase tracking-widest text-ink/40 mb-2">
                Leadership summary
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-ink/85">
                {result.narrative}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
