// Generates a downloadable .docx offer letter, client-side, no server round
// trip — same pattern as buildTalentReport.js / buildWorkforceReport.js.

import { Document, Packer, Paragraph, TextRun } from 'docx'

export async function buildOfferLetterDocx(letterText, candidateName) {
  const paragraphs = letterText.split('\n').map((line) =>
    new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: line })] })
  )

  const doc = new Document({
    sections: [{ children: paragraphs }],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const safeName = (candidateName || 'candidate').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  a.download = `HRinsight-Offer-Letter-${safeName}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
