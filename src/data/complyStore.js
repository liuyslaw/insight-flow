// Foreign worker permit, levy & statutory compliance tracker — localStorage-backed,
// same lazy-seed-on-first-read pattern as fwaStore.js and documentStore.js.
//
// Tracks four deadline types per foreign worker, each with a different statutory
// clock under Malaysian law:
//   - PLKS (Pas Lawatan Kerja Sementara) permit expiry — renewal should be
//     initiated ~90 days before lapse. A lapsed PLKS creates immediate legal
//     exposure for both employer and worker.
//   - FOMEMA medical screening — new/renewal screening window, ~30 days.
//     Missing it can trigger repatriation of the worker.
//   - Foreign worker levy payment — annual, paid to the Immigration Department
//     (JIM). Missing a payment blocks permit renewal outright.
//   - EPF / SOCSO / EIS statutory contribution enrolment — ongoing accuracy
//     check, not date-driven the same way, tracked as enrolled/not-enrolled.
//
// As with fwaStore.js: only the underlying facts are persisted (dates, paid/
// enrolled flags). Urgency is always derived at render time from the current
// date, never stored, so it can't go stale.
//
// Reference tool only. Rates, windows and requirements change — always confirm
// current figures against JTKSM / Immigration Department / SOCSO / EPF
// guidance directly before acting on an alert shown here.

const STORAGE_KEY = 'hrinsight_comply_workers_v1'

export const PLKS_WINDOW_DAYS = 90   // start renewal ~90 days before expiry
export const FOMEMA_WINDOW_DAYS = 30 // screening/renewal window
export const LEVY_WINDOW_DAYS = 30   // flag upcoming levy payments 30 days out

function daysUntil(isoDate) {
  if (!isoDate) return null
  const target = new Date(isoDate)
  const now = new Date()
  const targetDay = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate())
  const nowDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((targetDay - nowDay) / 86400000)
}

function isoDaysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD — matches <input type="date"> exactly
}

function seedWorkers() {
  return [
    {
      id: 'seed-comply-1',
      workerName: 'Md. Rahim (placeholder name, BGD)',
      sector: 'Manufacturing',
      permitType: 'PLKS',
      permitExpiry: isoDaysFromNow(18),
      fomemaDue: isoDaysFromNow(140),
      levyDue: isoDaysFromNow(200),
      levyPaid: true,
      epfEnrolled: true,
      socsoEnrolled: true,
      eisEnrolled: true,
      notes: '',
    },
    {
      id: 'seed-comply-2',
      workerName: 'Siti Norhayati (placeholder name, IDN)',
      sector: 'Manufacturing',
      permitType: 'PLKS',
      permitExpiry: isoDaysFromNow(260),
      fomemaDue: isoDaysFromNow(22),
      levyDue: isoDaysFromNow(260),
      levyPaid: true,
      epfEnrolled: true,
      socsoEnrolled: true,
      eisEnrolled: false,
      notes: 'EIS enrolment pending — flagged by payroll 2 weeks ago.',
    },
    {
      id: 'seed-comply-3',
      workerName: 'Aung Ko (placeholder name, MMR)',
      sector: 'Manufacturing',
      permitType: 'PLKS',
      permitExpiry: isoDaysFromNow(-6),
      fomemaDue: isoDaysFromNow(310),
      levyDue: isoDaysFromNow(310),
      levyPaid: true,
      epfEnrolled: true,
      socsoEnrolled: true,
      eisEnrolled: true,
      notes: 'Renewal submitted, awaiting JTKSM approval — permit technically lapsed.',
    },
    {
      id: 'seed-comply-4',
      workerName: 'Thura Zaw (placeholder name, MMR)',
      sector: 'Manufacturing',
      permitType: 'PLKS',
      permitExpiry: isoDaysFromNow(200),
      fomemaDue: isoDaysFromNow(190),
      levyDue: isoDaysFromNow(12),
      levyPaid: false,
      epfEnrolled: true,
      socsoEnrolled: true,
      eisEnrolled: true,
      notes: '',
    },
  ]
}

export function getComplyWorkers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedWorkers()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : seedWorkers()
  } catch {
    return seedWorkers()
  }
}

function persist(workers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workers))
  return workers
}

export function addComplyWorker(fields) {
  const workers = getComplyWorkers()
  const worker = {
    id: `comply-${Date.now()}`,
    workerName: (fields.workerName || '').trim(),
    sector: fields.sector || 'Manufacturing',
    permitType: fields.permitType || 'PLKS',
    permitExpiry: fields.permitExpiry || null,
    fomemaDue: fields.fomemaDue || null,
    levyDue: fields.levyDue || null,
    levyPaid: !!fields.levyPaid,
    epfEnrolled: !!fields.epfEnrolled,
    socsoEnrolled: !!fields.socsoEnrolled,
    eisEnrolled: !!fields.eisEnrolled,
    notes: (fields.notes || '').trim(),
  }
  return persist([...workers, worker])
}

export function updateComplyWorker(id, patch) {
  const workers = getComplyWorkers().map((w) => (w.id === id ? { ...w, ...patch } : w))
  return persist(workers)
}

export function deleteComplyWorker(id) {
  return persist(getComplyWorkers().filter((w) => w.id !== id))
}

export function resetComplyToSample() {
  return persist(seedWorkers())
}

/**
 * Derived, render-time-only urgency for a single date-driven deadline.
 * urgency: 'overdue' | 'urgent' | 'upcoming' | 'ok' | 'unset'
 */
function deadlineStatus(isoDate, windowDays) {
  if (!isoDate) return { daysRemaining: null, label: 'Not set', urgency: 'unset' }
  const daysRemaining = daysUntil(isoDate)
  if (daysRemaining < 0) {
    return { daysRemaining, label: `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) === 1 ? '' : 's'}`, urgency: 'overdue' }
  }
  if (daysRemaining <= windowDays) {
    return { daysRemaining, label: `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`, urgency: 'urgent' }
  }
  if (daysRemaining <= windowDays * 2) {
    return { daysRemaining, label: `${daysRemaining} days left`, urgency: 'upcoming' }
  }
  return { daysRemaining, label: `${daysRemaining} days left`, urgency: 'ok' }
}

/**
 * Full derived status for one worker across all four deadline types,
 * plus a single worst-case "overall" urgency for sorting/summary tiles.
 */
export function getComplyStatus(worker) {
  const permit = deadlineStatus(worker.permitExpiry, PLKS_WINDOW_DAYS)
  const fomema = deadlineStatus(worker.fomemaDue, FOMEMA_WINDOW_DAYS)
  const levy = worker.levyPaid
    ? { daysRemaining: null, label: 'Paid', urgency: 'ok' }
    : deadlineStatus(worker.levyDue, LEVY_WINDOW_DAYS)
  const statutoryGaps = ['epfEnrolled', 'socsoEnrolled', 'eisEnrolled'].filter((k) => !worker[k])
  const statutory = statutoryGaps.length
    ? { label: `${statutoryGaps.length} contribution${statutoryGaps.length === 1 ? '' : 's'} not enrolled`, urgency: 'urgent', gaps: statutoryGaps }
    : { label: 'All enrolled', urgency: 'ok', gaps: [] }

  const rank = { overdue: 4, urgent: 3, upcoming: 2, ok: 1, unset: 0 }
  const overallUrgency = [permit, fomema, levy, statutory]
    .map((s) => s.urgency)
    .reduce((worst, u) => (rank[u] > rank[worst] ? u : worst), 'ok')

  return { permit, fomema, levy, statutory, overallUrgency }
}

/**
 * Portfolio-level summary counts for the module's top stat tiles.
 */
export function getComplySummary(workers) {
  const statuses = workers.map(getComplyStatus)
  return {
    total: workers.length,
    overdue: statuses.filter((s) => s.overallUrgency === 'overdue').length,
    urgent: statuses.filter((s) => s.overallUrgency === 'urgent').length,
    upcoming: statuses.filter((s) => s.overallUrgency === 'upcoming').length,
    clear: statuses.filter((s) => s.overallUrgency === 'ok').length,
  }
}
