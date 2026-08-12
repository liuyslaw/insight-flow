// Central employee roster — the single source of truth that makes Hiring,
// Onboarding, and Talent Management feel like one connected tool instead of
// three separate data silos.
//
// Why this exists: before this file, each module only knew about the people
// its own data source happened to mention — Talent Management only saw
// people with an appraisal record, Onboarding only saw the same talent
// records plus whatever was typed into its own form and thrown away on
// refresh, and a newly-Hired candidate in the Hiring pipeline was invisible
// everywhere else. This store is what a person becomes part of the moment
// they're either marked Hired in the pipeline, or added directly as a new
// employee from Onboarding — from that point on, every module that reads
// from here sees them.
//
// Same lazy-seed-on-first-read, localStorage-backed pattern as the other
// stores (fwaStore.js, documentStore.js, hiringPipelineStore.js).

const STORAGE_KEY = 'hrinsight_employee_roster_v1'

function save(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function getEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      save([])
      return []
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalize(s) {
  return (s || '').trim().toLowerCase()
}

export function findEmployeeByName(name) {
  const target = normalize(name)
  if (!target) return null
  return getEmployees().find((e) => normalize(e.name) === target) || null
}

/**
 * Adds a new employee, or updates the existing one if the name already
 * matches a roster entry (so hiring the same person twice, or re-running
 * onboarding creation on someone already in Talent Management's data,
 * doesn't create a duplicate).
 *
 * source: 'Hiring' | 'Manual' | 'Import' — where this record came from,
 * shown in the UI so it's clear whether a person arrived via the pipeline
 * or was added directly.
 */
export function addOrUpdateEmployee({ name, role, level, site, hireDate, source, sourceCandidateId, status }) {
  if (!name || !name.trim()) return getEmployees()
  const employees = getEmployees()
  const idx = employees.findIndex((e) => normalize(e.name) === normalize(name))
  const now = new Date().toISOString()

  if (idx !== -1) {
    const existing = employees[idx]
    const updated = {
      ...existing,
      role: role || existing.role,
      level: level ?? existing.level,
      site: site ?? existing.site,
      hireDate: hireDate ?? existing.hireDate,
      status: status || existing.status,
      updatedAt: now,
    }
    const next = [...employees]
    next[idx] = updated
    return save(next)
  }

  const employee = {
    id: `employee-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    role: role || 'Unspecified role',
    level: level || null,
    site: site || null,
    hireDate: hireDate || null,
    status: status || 'Onboarding',
    source: source || 'Manual',
    sourceCandidateId: sourceCandidateId || null,
    createdAt: now,
    updatedAt: now,
  }
  return save([...employees, employee])
}

export function removeEmployee(id) {
  return save(getEmployees().filter((e) => e.id !== id))
}
