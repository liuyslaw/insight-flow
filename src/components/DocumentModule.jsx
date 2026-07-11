import { useEffect, useState } from 'react'
import { Upload, Trash2, RotateCcw, FileText, Table2 } from 'lucide-react'
import { getDocuments, addDocument, removeDocument, resetToSample } from '../data/documentStore.js'
import { importFile, SUPPORTED_EXTENSIONS } from '../lib/fileImport.js'
import { exportRowsToExcel } from '../lib/exportExcel.js'

const typeMeta = {
  talent: { label: 'Talent data', className: 'badge-magenta' },
  policy: { label: 'Policy / admin', className: 'badge-blue' },
  onboarding: { label: 'Onboarding', className: 'badge-green' },
  training: { label: 'Training', className: 'badge-gold' },
}

export default function DocumentModule({ onChange }) {
  const [docs, setDocs] = useState([])
  const [title, setTitle] = useState('')
  const [type, setType] = useState('talent')
  const [body, setBody] = useState('')
  const [notice, setNotice] = useState(null)

  useEffect(() => { setDocs(getDocuments()) }, [])

  function refresh(next) {
    setDocs(next)
    onChange?.(next)
  }

  function handleAdd() {
    if (!title.trim() || !body.trim()) return
    refresh(addDocument({ title, type, body }))
    setTitle(''); setBody('')
    setNotice(`Added "${title.trim()}" to the repository.`)
    setTimeout(() => setNotice(null), 3000)
  }

  function handleRemove(id) { refresh(removeDocument(id)) }

  function handleReset() {
    refresh(resetToSample())
    setNotice('Reset to the sample document set.')
    setTimeout(() => setNotice(null), 3000)
  }

  const [importing, setImporting] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const text = await importFile(file, type)
      if (!title.trim()) setTitle(file.name.replace(/\.[^/.]+$/, ''))
      setBody(text)
    } catch (err) {
      setNotice(`Could not read "${file.name}" — try a different file or paste the content directly.`)
      setTimeout(() => setNotice(null), 4000)
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  function exportInventory() {
    const rows = docs.map((d) => ({
      Title: d.title, Type: typeMeta[d.type]?.label || d.type, Source: d.source,
      'Added At': new Date(d.addedAt).toLocaleDateString('en-GB'), 'Characters': d.body.length,
    }))
    exportRowsToExcel(rows, `HRinsight-Document-Inventory-${new Date().toISOString().slice(0, 10)}`, 'Repository')
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 860 }}>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Document</div>
        <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 560 }}>
          One place to bring in everything — job architecture exports, appraisal data, company
          policies, onboarding material. Tag each document on the way in; Talent Management and
          Admin Services both read from this repository.
        </p>
      </div>

      {/* Add document */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 20 }}>
        <div style={{
          fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8,
          fontWeight: 600, padding: '12px 16px', borderBottom: '1px solid var(--border)',
        }}>
          Add to repository
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title — e.g. Job Architecture Export, Q3 2026"
              style={{
                flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text)',
              }}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text)',
              }}
            >
              <option value="talent">Talent data</option>
              <option value="policy">Policy / admin</option>
              <option value="onboarding">Onboarding</option>
              <option value="training">Training</option>
            </select>
          </div>
          <p style={{ fontSize: 10.5, color: 'var(--text3)', marginBottom: 10, lineHeight: 1.5 }}>
            Excel imports tagged "Talent data" auto-detect columns like Site, Role, Level, Rating, Gender, Age, and Years of Service. Word files import as plain text.
          </p>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the document content here, or upload a .txt file below…"
            style={{
              width: '100%', height: 150, background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 8, padding: 12, fontFamily: 'var(--mono)', fontSize: 12.5,
              lineHeight: 1.6, color: 'var(--text)', resize: 'vertical', marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
              color: 'var(--gold)', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1,
            }}>
              <Upload size={13} /> {importing ? 'Reading file…' : 'Upload file (.docx, .xlsx, .pdf, .txt)'}
              <input type="file" accept={SUPPORTED_EXTENSIONS} onChange={handleFile} disabled={importing} style={{ display: 'none' }} />
            </label>
            <button
              onClick={handleAdd}
              disabled={!title.trim() || !body.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)',
                borderRadius: 8, padding: '9px 18px', color: 'var(--gold)', fontSize: 12.5, fontWeight: 500,
                opacity: (!title.trim() || !body.trim()) ? 0.4 : 1,
              }}
            >
              Add document
            </button>
          </div>
          {notice && <p style={{ fontSize: 11, color: 'var(--gold)', marginTop: 10 }}>{notice}</p>}
        </div>
      </div>

      {/* Repository list */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
          Repository — {docs.length} document{docs.length === 1 ? '' : 's'}
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {docs.length > 0 && (
            <button
              onClick={exportInventory}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}
            >
              <Table2 size={11} /> Export inventory as Excel
            </button>
          )}
          <button
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}
          >
            <RotateCcw size={11} /> Reset to sample set
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {docs.map((doc) => (
          <div key={doc.id} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '12px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ minWidth: 0, display: 'flex', gap: 10 }}>
              <FileText size={14} color="var(--text3)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{doc.title}</span>
                  <span className={`badge ${typeMeta[doc.type]?.className}`}>{typeMeta[doc.type]?.label || doc.type}</span>
                  <span className="chip">{doc.source}</span>
                </div>
                <p style={{
                  fontSize: 11.5, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>{doc.body}</p>
              </div>
            </div>
            <button onClick={() => handleRemove(doc.id)} style={{ background: 'none', color: 'var(--red)', opacity: 0.7, flexShrink: 0 }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {docs.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--text3)', fontStyle: 'italic', padding: '20px 0' }}>
            Repository is empty — add a document above, or reset to the sample set.
          </p>
        )}
      </div>
    </div>
  )
}
