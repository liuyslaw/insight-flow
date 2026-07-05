// Shared document repository — single intake point for all uploads.
// Documents are tagged by type ('talent' or 'policy') so each module reads
// only what's relevant to it. localStorage-backed for this phase-1 demo —
// a genuine deployed app (not a Claude Artifact), so this is the right tool
// for persistence without standing up a backend database.

import { sampleTalentDocs } from './sampleTalentDocs.js'
import { policies as defaultPolicies } from './policies.js'

const STORAGE_KEY = 'insightflow_docs_v2'

function seedDocs() {
  const seeded = [
    {
      id: 'seed-talent-sample',
      title: 'Sample talent export — 50 employees (SG / MY / EU / CN)',
      type: 'talent',
      body: sampleTalentDocs,
      source: 'Sample data',
      addedAt: new Date().toISOString(),
    },
    ...defaultPolicies.map((p, i) => ({
      id: `seed-policy-${i}`,
      title: p.title,
      type: 'policy',
      body: p.body,
      source: 'Sample data',
      addedAt: new Date().toISOString(),
    })),
  ]
  return seeded
}

export function getDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedDocs()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : seedDocs()
  } catch {
    return seedDocs()
  }
}

export function getDocumentsByType(type) {
  return getDocuments().filter((d) => d.type === type)
}

export function addDocument({ title, type, body, source }) {
  const docs = getDocuments()
  const doc = {
    id: `doc-${Date.now()}`,
    title: title.trim(),
    type,
    body: body.trim(),
    source: source || 'Uploaded',
    addedAt: new Date().toISOString(),
  }
  const next = [...docs, doc]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function removeDocument(id) {
  const docs = getDocuments().filter((d) => d.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
  return docs
}

export function resetToSample() {
  const seeded = seedDocs()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}
