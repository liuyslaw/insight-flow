// Handles importing content from .txt/.md, .docx, and .xlsx/.xls files into
// plain text suitable for the document repository. Excel talent exports get
// special treatment — rows are mapped to the SITE/ROLE/ASSIGNED LEVEL/
// APPRAISAL RATING block format the rest of the app already expects,
// tolerant of common header name variants since real exports won't always
// use InsightFlow's exact field names.

import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

const HEADER_MAP = {
  site: /^(site|location|office|plant)$/i,
  employee: /^(employee|name|employee name)$/i,
  role: /^(role|title|job title|position)$/i,
  level: /^(level|grade|job level|assigned level)$/i,
  jd: /^(job description|jd|description|scope)$/i,
  rating: /^(rating|appraisal rating|score|performance rating)$/i,
  narrative: /^(narrative|comments|appraisal narrative|manager comments)$/i,
}

function matchHeader(header) {
  const key = Object.keys(HEADER_MAP).find((k) => HEADER_MAP[k].test(header.trim()))
  return key || null
}

function ratingLabel(r) {
  const n = Number(r)
  return { 1: 'Below Expectations', 2: 'Below Expectations', 3: 'Meets Expectations', 4: 'Exceeds Expectations', 5: 'Outstanding' }[n] || ''
}

function rowsToTalentBlocks(rows) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const mapped = {}
  headers.forEach((h) => {
    const key = matchHeader(h)
    if (key) mapped[key] = h
  })

  // If we can't identify at least site/role, fall back to a generic dump
  if (!mapped.site && !mapped.role) return null

  return rows
    .map((row) => {
      const lines = []
      if (mapped.site) lines.push(`SITE: ${row[mapped.site] ?? ''}`)
      if (mapped.employee) lines.push(`EMPLOYEE: ${row[mapped.employee] ?? ''}`)
      if (mapped.role) lines.push(`ROLE: ${row[mapped.role] ?? ''}`)
      if (mapped.level) lines.push(`ASSIGNED LEVEL: ${row[mapped.level] ?? ''}`)
      if (mapped.jd) lines.push(`JOB DESCRIPTION EXCERPT: "${row[mapped.jd] ?? ''}"`)
      if (mapped.rating) {
        const r = row[mapped.rating]
        lines.push(`APPRAISAL RATING: ${r} / 5 (${ratingLabel(r)})`)
      }
      if (mapped.narrative) lines.push(`APPRAISAL NARRATIVE: "${row[mapped.narrative] ?? ''}"`)
      return lines.join('\n')
    })
    .join('\n\n---\n\n')
}

async function importXlsx(file, docType) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  if (docType === 'talent') {
    const blocks = rowsToTalentBlocks(rows)
    if (blocks) return blocks
  }

  // Generic fallback: CSV-style dump of the sheet
  return XLSX.utils.sheet_to_csv(sheet)
}

async function importDocx(file) {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}

export async function importFile(file, docType) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.docx')) return importDocx(file)
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return importXlsx(file, docType)
  // .txt, .md, or anything else — read as plain text
  return file.text()
}

export const SUPPORTED_EXTENSIONS = '.txt,.md,.docx,.xlsx,.xls'
