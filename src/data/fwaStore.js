// Flexible Work Arrangement (FWA) request tracker — localStorage-backed,
// same lazy-seed-on-first-read pattern as the shared document repository
// (see documentStore.js).
//
// Tracks the statutory 60-day response window under Malaysia's Employment
// Act 1955 s.60P: an employee may request a flexible work arrangement
// (hours, location, or pattern) and the employer must respond in writing
// within 60 days of receipt. This store only persists the facts (submitted
// date, response date, decision) — how many days are left/overdue is always
// derived at render time from the current date, never stored, so it can't
// go stale.

const STORAGE_KEY = 'hrinsight_fwa_requests_v1'
export const RESPONSE_WINDOW_DAYS = 60

function daysSince(isoDate) {
  const start = new Date(isoDate)
  const now = new Date()
  // Compare at day granularity (midnight-to-midnight) so "submitted this
  // morning" doesn't show as partial/fractional days.
  const startDay = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const nowDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((nowDay - startDay) / 86400000)
}

function isoDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function seedRequests() {
  return [
    {
      id: 'seed-fwa-1',
      employeeName: 'Nur Aisyah (placeholder name, MY)',
      requestType: 'hours',
      requestDetails: 'Requests a compressed work week (4x10-hour days, Mon-Thu) to manage childcare pickup on Fridays.',
      submittedAt: isoDaysAgo(10),
      status: 'Pending',
      respondedAt: null,
      responseNote: null,
    },
    {
      id: 'seed-fwa-2',
      employeeName: 'Wei Lin (placeholder name, SG)',
      requestType: 'location',
      requestDetails: 'Requests to work fully remote from Johor Bahru 3 days a week, commuting to Singapore HQ on Tue/Thu.',
      submittedAt: isoDaysAgo(55),
      status: 'Pending',
      respondedAt: null,
      responseNote: null,
    },
    {
      id: 'seed-fwa-3',
      employeeName: 'Ramesh Kumar (placeholder name, MY)',
      requestType: 'pattern',
      requestDetails: 'Requests staggered start/end times (7am-3pm instead of 9am-5pm) to avoid peak-hour commute.',
      submittedAt: isoDaysAgo(70),
      status: 'Pending',
      respondedAt: null,
      responseNote: null,
    },
    {
      id: 'seed-fwa-4',
      employeeName: 'Chen Mei (placeholder name, MY)',
      requestType: 'hours',
      requestDetails: 'Requests reduced hours (0.8 FTE, 4 days/week) following return from parental leave.',
      submittedAt: isoDaysAgo(40),
      status: 'Approved',
      respondedAt: isoDaysAgo(33),
      responseNote: 'Approved on a 6-month trial basis, reviewed against a Sept 2026 checkpoint with the reporting manager.',
    },
  ]
}

export function getFwaRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedRequests()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : seedRequests()
  } catch {
    return seedRequests()
  }
}

export function addFwaRequest({ employeeName, requestType, requestDetails }) {
  const requests = getFwaRequests()
  const request = {
    id: `fwa-${Date.now()}`,
    employeeName: employeeName.trim(),
    requestType,
    requestDetails: requestDetails.trim(),
    submittedAt: new Date().toISOString(),
    status: 'Pending',
    respondedAt: null,
    responseNote: null,
  }
  const next = [...requests, request]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

// decision: 'Approved' | 'Refused'
export function respondToFwaRequest(id, { decision, note }) {
  const requests = getFwaRequests().map((r) =>
    r.id === id
      ? { ...r, status: decision, respondedAt: new Date().toISOString(), responseNote: (note || '').trim() || null }
      : r
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  return requests
}

export function resetFwaToSample() {
  const seeded = seedRequests()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}

/**
 * Derived, render-time-only status for a request — never persisted.
 * urgency: 'done' | 'ok' | 'warning' | 'overdue'
 */
export function getFwaStatus(request) {
  if (request.status !== 'Pending') {
    return { daysElapsed: null, daysRemaining: null, label: 'Responded', urgency: 'done' }
  }
  const daysElapsed = daysSince(request.submittedAt)
  const daysRemaining = RESPONSE_WINDOW_DAYS - daysElapsed
  if (daysRemaining < 0) {
    return { daysElapsed, daysRemaining, label: `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) === 1 ? '' : 's'}`, urgency: 'overdue' }
  }
  if (daysRemaining <= 10) {
    return { daysElapsed, daysRemaining, label: `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`, urgency: 'warning' }
  }
  return { daysElapsed, daysRemaining, label: `${daysRemaining} days left`, urgency: 'ok' }
}
