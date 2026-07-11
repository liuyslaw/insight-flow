import { getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords } from './parseTalentDocs.js'

/**
 * Returns de-duplicated (by role+level) talent records with a JD, for use
 * in "select an existing role" dropdowns across the Hiring module — avoids
 * showing the same role repeated once per appraisal cycle.
 */
export function getUniqueRolesWithJD() {
  const talentDocs = getDocumentsByType('talent')
  const all = parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n'))
  const seen = new Set()
  return all.filter((r) => {
    const key = `${r.role}__${r.level}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Builds a plain-text JD block from a role record, in the same shape the
 * rest of the app already reasons over — suitable for pre-filling a JD
 * textarea from an existing role.
 */
export function formatRoleAsJD(role) {
  if (!role) return ''
  const lines = [
    `ROLE: ${role.role}`,
    role.level ? `LEVEL: ${role.level}` : null,
    role.businessUnit ? `BUSINESS UNIT: ${role.businessUnit}` : null,
    role.site ? `SITE: ${role.site}` : null,
  ].filter(Boolean)
  const jdText = role.raw?.match(/JOB DESCRIPTION EXCERPT:\s*"(.*)"/)?.[1]
  if (jdText) lines.push('', jdText)
  return lines.join('\n')
}
