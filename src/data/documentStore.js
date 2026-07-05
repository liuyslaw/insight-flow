// Shared document repository — single intake point for all uploads.
// Documents are tagged by type ('talent' or 'policy') so each module reads
// only what's relevant to it. localStorage-backed for this phase-1 demo —
// a genuine deployed app (not a Claude Artifact), so this is the right tool
// for persistence without standing up a backend database.

import { policies as defaultPolicies } from './policies.js'
import { sampleTalentDocs } from './sampleTalentDocs.js'

const STORAGE_KEY = 'insightflow_docs_v3'

const sampleOnboardingTemplates = [
  {
    title: 'Standard Onboarding Checklist — Template',
    body: `DAY 1: Welcome email sent, workstation and system access confirmed, org chart and team introductions, review job description and reporting line, complete tax and bank details, IT security and acceptable use briefing.
WEEK 1: Complete mandatory compliance training (code of conduct, workplace safety), meet with manager to confirm 30-60-90 day goals, shadow a team member on core workflows, set up 1:1 cadence with manager, join relevant team channels/distribution lists.
MONTH 1: Complete role-specific systems training, first informal check-in survey, meet key cross-functional stakeholders, review probation/confirmation criteria with manager.
MONTH 2-3: Take ownership of first independent task or project, mid-probation review with manager, feedback session on onboarding experience.`,
  },
  {
    title: 'IT Equipment & Access Request Guide',
    body: `Standard IT provisioning for new hires: laptop/desktop matched to role (engineering roles require CAD-capable hardware, minimum 32GB RAM), email and calendar account, VPN access for remote sites, role-based system access (ERP, timesheet, engineering tools as applicable), badge/building access request submitted 5 working days before start date, phone/mobile device if role requires travel.`,
  },
]

function seedDocs() {
  return [
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
    ...sampleOnboardingTemplates.map((t, i) => ({
      id: `seed-onboarding-${i}`,
      title: t.title,
      type: 'onboarding',
      body: t.body,
      source: 'Sample data',
      addedAt: new Date().toISOString(),
    })),
  ]
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
