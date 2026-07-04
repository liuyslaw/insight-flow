// Simple localStorage-backed knowledge base shared between the Admin module
// (where documents are uploaded) and the Self-Service Assistant (which reads
// them). This is a genuine deployed app (not a Claude Artifact), so
// localStorage is the right tool here for a phase-1 demo with no backend
// database — content persists in the browser across page loads.

import { policies as defaultPolicies } from './policies.js'

const STORAGE_KEY = 'insightflow_kb_v1'

function seedDocs() {
  return defaultPolicies.map((p, i) => ({
    id: `seed-${i}`,
    title: p.title,
    body: p.body,
    source: 'Sample policy set',
    addedAt: new Date().toISOString(),
  }))
}

export function getKnowledgeBase() {
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

export function addDocument({ title, body, source }) {
  const docs = getKnowledgeBase()
  const doc = {
    id: `doc-${Date.now()}`,
    title: title.trim(),
    body: body.trim(),
    source: source || 'Uploaded by admin',
    addedAt: new Date().toISOString(),
  }
  const next = [...docs, doc]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function removeDocument(id) {
  const docs = getKnowledgeBase().filter((d) => d.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
  return docs
}

export function resetToSample() {
  const seeded = seedDocs()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}
