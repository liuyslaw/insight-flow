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
    const role = block.match(/ROLE:\s*(.+)/)?.[1]?.trim()
    const level = block.match(/ASSIGNED LEVEL:\s*(L?\d+)/i)?.[1]?.trim()
    const rating = block.match(/APPRAISAL RATING:\s*(\d)/)?.[1]

    if (!site && !role && !level && !rating) continue

    records.push({
      site: site || 'Unknown site',
      role: role || 'Unknown role',
      level: level ? (level.startsWith('L') ? level : `L${level}`) : 'Unknown',
      rating: rating ? Number(rating) : null,
      function: classifyFunction(role || ''),
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
