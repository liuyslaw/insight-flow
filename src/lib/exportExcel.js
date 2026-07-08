// Generic .xlsx export, entirely client-side via SheetJS (already a
// dependency for Excel import). Used by any module that wants to hand off
// its underlying data as a spreadsheet, e.g. for further analysis or to
// build into a larger report.

import * as XLSX from 'xlsx'

/**
 * @param {object[]} rows - array of plain objects; keys become column headers
 * @param {string} filename - without extension
 * @param {string} sheetName
 */
export function exportRowsToExcel(rows, filename, sheetName = 'Sheet1') {
  const sheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName)
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
