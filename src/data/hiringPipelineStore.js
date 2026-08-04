// Hiring pipeline tracker — localStorage-backed, same lazy-seed-on-first-read
// pattern as the FWA request tracker (see fwaStore.js) and the shared
// document repository (see documentStore.js).
const STORAGE_KEY = 'hrinsight_hiring_pipeline_v1'

export const STAGES = ['Screened', 'Interview', 'Offer', 'Hired', 'Rejected']

function isoDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function seedCandidates() {
  return [
    {
      id: 'candidate-seed-1',
      name: 'Aisyah Rahman (placeholder name, MY)',
      role: 'Finance Executive',
      stage: 'Screened',
      createdAt: isoDaysAgo(6),
      updatedAt: isoDaysAgo(6),
      screening: {
        matches: ['5 years AP/AR experience', 'Proficient in SAP and Excel'],
        gaps: ['No direct exposure to multi-entity consolidation'],
        notes: 'Strong candidate for a mid-level finance role.',
      },
      offerLetter: null,
      history: [{ stage: 'Screened', at: isoDaysAgo(6) }],
    },
    {
      id: 'candidate-seed-2',
      name: 'Wei Jian Tan (placeholder name, SG)',
      role: 'Procurement Analyst',
      stage: 'Interview',
      createdAt: isoDaysAgo(12),
      updatedAt: isoDaysAgo(4),
      screening: {
        matches: ['3 years procurement operations', 'Vendor negotiation experience'],
        gaps: ['Limited exposure to P2P automation tools'],
        notes: 'Shortlisted for first-round interview.',
      },
      offerLetter: null,
      history: [
        { stage: 'Screened', at: isoDaysAgo(12) },
        { stage: 'Interview', at: isoDaysAgo(4) },
      ],
    },
    {
      id: 'candidate-seed-3',
      name: 'Nur Farhana Ismail (placeholder name, MY)',
      role: 'HR Business Partner',
      stage: 'Offer',
      createdAt: isoDaysAgo(20),
      updatedAt: isoDaysAgo(2),
      screening: {
        matches: ['6 years HRBP experience', 'Strong stakeholder management'],
        gaps: ['New to regional (multi-country) scope'],
        notes: 'Offer drafted, pending candidate response.',
      },
      offerLetter: 'Dear Nur Farhana,\n\nWe are pleased to offer you the position of HR Business Partner...',
      history: [
        { stage: 'Screened', at: isoDaysAgo(20) },
        { stage: 'Interview', at: isoDaysAgo(10) },
        { stage: 'Offer', at: isoDaysAgo(2) },
      ],
    },
    {
      id: 'candidate-seed-4',
      name: 'Marcus Lim (placeholder name, SG)',
      role: 'Finance Manager',
      stage: 'Hired',
      createdAt: isoDaysAgo(45),
      updatedAt: isoDaysAgo(15),
      screening: {
        matches: ['8 years finance leadership', 'Led ERP migration project'],
        gaps: [],
        notes: 'Excellent fit, offer accepted.',
      },
      offerLetter: 'Dear Marcus,\n\nWe are pleased to offer you the position of Finance Manager...',
      history: [
        { stage: 'Screened', at: isoDaysAgo(45) },
        { stage: 'Interview', at: isoDaysAgo(35) },
        { stage: 'Offer', at: isoDaysAgo(22) },
        { stage: 'Hired', at: isoDaysAgo(15) },
      ],
    },
  ]
}

function save(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function getPipeline() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedCandidates()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : seedCandidates()
  } catch {
    return seedCandidates()
  }
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8)
}

function findCandidateIndex(candidates, name, role) {
  const normName = (name || '').trim().toLowerCase()
  const normRole = (role || '').trim().toLowerCase()
  return candidates.findIndex(
    (c) => (c.name || '').trim().toLowerCase() === normName && (c.role || '').trim().toLowerCase() === normRole
  )
}

export function addOrUpdateCandidateFromScreening({ name, role, matches, gaps, notes }) {
  const candidates = getPipeline()
  const now = new Date().toISOString()
  const idx = findCandidateIndex(candidates, name, role)

  if (idx !== -1) {
    const existing = candidates[idx]
    const updated = {
      ...existing,
      screening: { matches: matches || [], gaps: gaps || [], notes: notes || '' },
      updatedAt: now,
    }
    const next = [...candidates]
    next[idx] = updated
    return save(next)
  }

  const candidate = {
    id: `candidate-${Date.now()}-${randomSuffix()}`,
    name: (name || 'Unnamed candidate').trim(),
    role: (role || 'Unspecified role').trim(),
    stage: 'Screened',
    createdAt: now,
    updatedAt: now,
    screening: { matches: matches || [], gaps: gaps || [], notes: notes || '' },
    offerLetter: null,
    history: [{ stage: 'Screened', at: now }],
  }
  const next = [...candidates, candidate]
  return save(next)
}

export function recordOfferLetter({ candidateName, role, letter }) {
  const candidates = getPipeline()
  const now = new Date().toISOString()
  const idx = findCandidateIndex(candidates, candidateName, role)

  if (idx !== -1) {
    const existing = candidates[idx]
    const updated = {
      ...existing,
      stage: 'Offer',
      offerLetter: letter,
      updatedAt: now,
      history: [...existing.history, { stage: 'Offer', at: now }],
    }
    const next = [...candidates]
    next[idx] = updated
    return save(next)
  }

  const candidate = {
    id: `candidate-${Date.now()}-${randomSuffix()}`,
    name: (candidateName || 'Unnamed candidate').trim(),
    role: (role || 'Unspecified role').trim(),
    stage: 'Offer',
    createdAt: now,
    updatedAt: now,
    screening: null,
    offerLetter: letter,
    history: [{ stage: 'Offer', at: now }],
  }
  const next = [...candidates, candidate]
  return save(next)
}

export function setStage(id, newStage) {
  if (!STAGES.includes(newStage)) return getPipeline()
  const candidates = getPipeline()
  const now = new Date().toISOString()
  const next = candidates.map((c) => {
    if (c.id !== id) return c
    return {
      ...c,
      stage: newStage,
      updatedAt: now,
      history: [...c.history, { stage: newStage, at: now }],
    }
  })
  return save(next)
}

export function getPipelineByStage() {
  const candidates = getPipeline()
  const grouped = { Screened: [], Interview: [], Offer: [], Hired: [], Rejected: [] }
  for (const c of candidates) {
    if (grouped[c.stage]) grouped[c.stage].push(c)
    else grouped.Screened.push(c)
  }
  return grouped
}
