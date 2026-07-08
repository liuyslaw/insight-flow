// Parses the plain-text talent records (SITE / ROLE / ASSIGNED LEVEL /
// APPRAISAL RATING blocks, separated by "---") into structured objects for
// charting. Tolerant of missing fields — records that don't match are
// skipped rather than breaking the whole parse, since real-world exports
// won't always be perfectly uniform.

const FUNCTION_RULES = [
  { match: /engineer|design|test|mechatronic/i, label: 'Engineering' },
  { match: /quality/i, label: 'Quality' },
  { match: /technician|supervisor|manufactur/i, label: 'Operations' },
  { match: /supply chain|procurement/i, label: 'Supply Chain' },
  { match: /hr|human resource/i, label: 'HR' },
  { match: /finance/i, label: 'Finance' },
  { match: /program|project manager/i, label: 'Program Management' },
  { match: /ehs|safety/i, label: 'EHS' },
  { match: /continuous improvement/i, label: 'Continuous Improvement' },
]

function classifyFunction(role) {
  const hit = FUNCTION_RULES.find((r) => r.match.test(role))
  return hit ? hit.label : 'Other'
}

export function parseTalentRecords(text) {
  if (!text || !text.trim()) return []

  const blocks = text.split(/\n+-{3,}\n+/)
  const records = []

  for (const block of blocks) {
    const site = block.match(/SITE:\s*(.+)/)?.[1]?.trim()
    const employee = block.match(/EMPLOYEE:\s*(.+)/)?.[1]?.trim()
    const role = block.match(/ROLE:\s*(.+)/)?.[1]?.trim()
    const businessUnit = block.match(/BUSINESS UNIT:\s*(.+)/)?.[1]?.trim()
    const level = block.match(/ASSIGNED LEVEL:\s*(L?\d+)/i)?.[1]?.trim()
    const rating = block.match(/APPRAISAL RATING:\s*(\d)/)?.[1]
    const gender = block.match(/GENDER:\s*(\w+)/i)?.[1]?.trim()
    const age = block.match(/AGE:\s*(\d+)/i)?.[1]
    const yearsOfService = block.match(/YEARS OF SERVICE:\s*(\d+)/i)?.[1]
    const appraisalCycle = block.match(/APPRAISAL CYCLE:\s*(\d{4})/i)?.[1]
    const status = block.match(/STATUS:\s*(Active|Left)/i)?.[1]
    const exitDate = block.match(/EXIT DATE:\s*(.+)/i)?.[1]?.trim()

    if (!site && !role && !level && !rating) continue

    records.push({
      site: site || 'Unknown site',
      employee: employee || null,
      role: role || 'Unknown role',
      businessUnit: businessUnit || null,
      level: level ? (level.startsWith('L') ? level : `L${level}`) : 'Unknown',
      rating: rating ? Number(rating) : null,
      function: classifyFunction(role || ''),
      gender: gender || null,
      age: age ? Number(age) : null,
      yearsOfService: yearsOfService ? Number(yearsOfService) : null,
      appraisalCycle: appraisalCycle ? Number(appraisalCycle) : null,
      status: status || 'Active',
      exitDate: exitDate || null,
      raw: block.trim(),
    })
  }

  return records
}

export function countBy(records, key) {
  const counts = {}
  for (const r of records) {
    const k = r[key] ?? 'Unknown'
    counts[k] = (counts[k] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (a.name > b.name ? 1 : -1))
}

const AGE_BUCKETS = [
  { label: 'Under 25', test: (a) => a < 25 },
  { label: '25–34', test: (a) => a >= 25 && a <= 34 },
  { label: '35–44', test: (a) => a >= 35 && a <= 44 },
  { label: '45–54', test: (a) => a >= 45 && a <= 54 },
  { label: '55+', test: (a) => a >= 55 },
]

const TENURE_BUCKETS = [
  { label: '< 1 yr', test: (y) => y < 1 },
  { label: '1–3 yrs', test: (y) => y >= 1 && y <= 3 },
  { label: '4–7 yrs', test: (y) => y >= 4 && y <= 7 },
  { label: '8–15 yrs', test: (y) => y >= 8 && y <= 15 },
  { label: '15+ yrs', test: (y) => y > 15 },
]

export function countByBucket(records, field, buckets) {
  return buckets.map((b) => ({
    name: b.label,
    value: records.filter((r) => r[field] != null && b.test(r[field])).length,
  }))
}

export function countByAgeBucket(records) {
  return countByBucket(records, 'age', AGE_BUCKETS)
}

export function countByTenureBucket(records) {
  return countByBucket(records, 'yearsOfService', TENURE_BUCKETS)
}

/**
 * Attrition rate for a given cycle, defined here as:
 *   leavers in that cycle ÷ (active + leavers in that cycle) × 100
 * A simplified proxy suitable for a phase-1 demo — not official HR
 * methodology (which typically uses average headcount over the period).
 * Stated explicitly wherever this number is shown in the UI.
 */
export function computeAttrition(records, cycle) {
  const inCycle = records.filter((r) => r.appraisalCycle === cycle)
  const active = inCycle.filter((r) => r.status === 'Active')
  const leavers = inCycle.filter((r) => r.status === 'Left')
  const total = inCycle.length
  return {
    cycle,
    headcount: total,
    activeCount: active.length,
    leaverCount: leavers.length,
    leavers,
    rate: total > 0 ? (leavers.length / total) * 100 : 0,
  }
}
