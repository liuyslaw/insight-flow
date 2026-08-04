// Parses training/development records — a distinct shape from talent records
// (no SITE/ROLE/LEVEL structure), so this is deliberately a separate parser
// rather than overloading parseTalentRecords.

export function parseTrainingRecords(text) {
  if (!text || !text.trim()) return []

  const blocks = text.split(/\n+-{3,}\n+/)
  const records = []

  for (const block of blocks) {
    const employee = block.match(/EMPLOYEE:\s*(.+)/)?.[1]?.trim()
    // Optional explicit identifier, same convention as parseTalentDocs.js —
    // absent on exports that predate the identifier being added, in which
    // case callers should fall back to matching on the EMPLOYEE name string.
    const employeeId = block.match(/EMPLOYEE ID:\s*(\S+)/i)?.[1]?.trim()
    const course = block.match(/COURSE:\s*(.+)/)?.[1]?.trim()
    const status = block.match(/STATUS:\s*(Completed|In Progress|Not Started)/i)?.[1]?.trim()
    const completionDate = block.match(/COMPLETION DATE:\s*(.+)/i)?.[1]?.trim()

    if (!employee && !course) continue

    records.push({
      employee: employee || 'Unknown',
      employeeId: employeeId || null,
      course: course || 'Unknown course',
      status: status || 'Not Started',
      completionDate: completionDate || null,
      raw: block.trim(),
    })
  }

  return records
}

export function countByStatus(records) {
  const order = ['Completed', 'In Progress', 'Not Started']
  const counts = { Completed: 0, 'In Progress': 0, 'Not Started': 0 }
  for (const r of records) {
    counts[r.status] = (counts[r.status] || 0) + 1
  }
  return order.map((name) => ({ name, value: counts[name] }))
}

export function countByCourse(records) {
  const counts = {}
  for (const r of records) {
    counts[r.course] = (counts[r.course] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}
