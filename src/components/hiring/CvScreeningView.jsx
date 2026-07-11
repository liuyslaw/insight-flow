import { useEffect, useState } from 'react'
import { Sparkles, RefreshCw, AlertTriangle, Upload, X, ShieldCheck } from 'lucide-react'
import { importFile, SUPPORTED_EXTENSIONS } from '../../lib/fileImport.js'
import { getUniqueRolesWithJD, formatRoleAsJD } from '../../lib/getUniqueRoles.js'

export default function CvScreeningView() {
  const [existingRoles, setExistingRoles] = useState([])
  const [roleSelection, setRoleSelection] = useState('')
  const [jdText, setJdText] = useState('')
  const [cvs, setCvs] = useState([]) // [{ name, text }]
  const [importing, setImporting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([]) // [{ name, matches, gaps, notes }]

  useEffect(() => { setExistingRoles(getUniqueRolesWithJD()) }, [])

  function handleRoleSelect(value) {
    setRoleSelection(value)
    if (value === '' || value === 'custom') return
    const role = existingRoles[Number(value)]
    if (role) setJdText(formatRoleAsJD(role))
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setImporting(true)
    try {
      const imported = await Promise.all(files.map(async (f) => ({ name: f.name, text: await importFile(f, 'candidate') })))
      setCvs((c) => [...c, ...imported])
    } catch (err) {
      setError('Could not read one or more files — try a different format or paste the CV text directly.')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  function removeCv(i) {
    setCvs((c) => c.filter((_, idx) => idx !== i))
  }

  async function screenOne(cv) {
    const res = await fetch('/api/hiring', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'cv-screen', input: `TARGET JOB DESCRIPTION:\n${jdText}\n\nCANDIDATE CV:\n${cv.text}` }),
    })
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    const data = await res.json()
    return { name: cv.name, ...data }
  }

  async function screenAll() {
    if (!jdText.trim() || cvs.length === 0) return
    setLoading(true); setError(null); setResults([])
    try {
      const settled = await Promise.allSettled(cvs.map(screenOne))
      const ok = settled.filter((r) => r.status === 'fulfilled').map((r) => r.value)
      const failed = settled.filter((r) => r.status === 'rejected')
      setResults(ok)
      if (failed.length) setError(`${failed.length} of ${cvs.length} CV(s) could not be screened.`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 9, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 8 }}>
        <ShieldCheck size={14} color="#16a34a" style={{ marginTop: 1, flexShrink: 0 }} />
        <p style={{ fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.6 }}>
          This summarises fit against the job description — it does not score, rank, or recommend
          candidates. Results are shown in upload order, not by any ranking. You make every decision.
        </p>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
          Target job description
        </div>
        <select
          value={roleSelection}
          onChange={(e) => handleRoleSelect(e.target.value)}
          style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: 'var(--text)', marginBottom: 10 }}
        >
          <option value="">Select an existing role to prefill…</option>
          {existingRoles.map((r, i) => (
            <option key={i} value={i}>{r.role} — {r.level}{r.businessUnit ? ` — ${r.businessUnit}` : ''}</option>
          ))}
          <option value="custom">Paste a JD manually instead</option>
        </select>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description to screen candidates against, or select an existing role above…"
          style={{ width: '100%', height: 110, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: 12.5, lineHeight: 1.6, color: 'var(--text)', resize: 'vertical' }}
        />
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
            Candidate CVs — {cvs.length} uploaded
          </span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#16a34a', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
            <Upload size={13} /> {importing ? 'Reading…' : 'Upload CV(s)'}
            <input type="file" multiple accept={SUPPORTED_EXTENSIONS} onChange={handleFiles} disabled={importing} style={{ display: 'none' }} />
          </label>
        </div>
        {cvs.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No CVs uploaded yet — accepts .pdf, .docx, .txt.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {cvs.map((cv, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 7, padding: '6px 10px' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{cv.name}</span>
                <button onClick={() => removeCv(i)} style={{ background: 'none' }}><X size={13} color="var(--text3)" /></button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button onClick={screenAll} disabled={loading || !jdText.trim() || cvs.length === 0} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.35)',
            borderRadius: 8, padding: '9px 18px', color: '#16a34a', fontSize: 12.5, fontWeight: 500,
            opacity: (loading || !jdText.trim() || cvs.length === 0) ? 0.4 : 1,
          }}>
            {loading
              ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> Screening…</>
              : <><Sparkles size={13} /> Screen {cvs.length > 1 ? `${cvs.length} CVs` : 'CV'}</>}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '12px 16px', marginBottom: 18, display: 'flex', gap: 8 }}>
          <AlertTriangle size={14} color="var(--red)" />
          <span style={{ fontSize: 12.5, color: 'var(--red)' }}>{error}</span>
        </div>
      )}

      {results.map((r, i) => (
        <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', marginBottom: 12 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{r.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: '1 1 220px' }}>
              <div style={{ fontSize: 10, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, marginBottom: 6 }}>Matches</div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {(r.matches || []).map((m, j) => <li key={j} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{m}</li>)}
              </ul>
            </div>
            <div style={{ flex: '1 1 220px' }}>
              <div style={{ fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, marginBottom: 6 }}>Gaps</div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {(r.gaps || []).map((g, j) => <li key={j} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{g}</li>)}
              </ul>
            </div>
          </div>
          {r.notes && <p style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 10, fontStyle: 'italic' }}>{r.notes}</p>}
        </div>
      ))}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
