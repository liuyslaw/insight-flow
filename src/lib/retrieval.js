// Chunking + retrieval for Admin Services' policy Q&A.
//
// Why this exists: the assistant used to send every published policy
// document's FULL text into the LLM prompt on every question. That works
// for a handful of short sample policies, but breaks down on real
// documents — a single 30-50 page employee handbook is already tens of
// thousands of tokens, which blows past Groq's free-tier rate limit
// (roughly 6,000-12,000 tokens/minute for llama-3.3-70b-versatile) in a
// single request, and even on a higher tier, dumping 30-50 pages of
// undifferentiated text into one prompt measurably hurts answer quality
// versus retrieving just the relevant passages.
//
// This module fixes that without adding a new API, vendor, or backend:
//   1. chunkDocument() splits a document into ~180-260 word passages on
//      natural paragraph boundaries.
//   2. retrieveChunks() scores every chunk against the question using
//      BM25 (a standard, dependency-free lexical ranking algorithm — the
//      same family of technique search engines used before embeddings
//      became common) and returns only the top-scoring chunks, capped to
//      a character budget that comfortably fits Groq's rate limit.
//
// This is intentionally lexical (keyword-based), not embeddings-based —
// no new API key, no added network round-trip, no new cost, and for
// policy Q&A the question and the relevant passage usually share real
// words ("annual leave", "remote work", "levy"), so BM25 performs well
// here without the added complexity of a vector store.

const TARGET_CHUNK_WORDS = 220
const MIN_CHUNK_WORDS = 40
const CONTEXT_CHAR_BUDGET = 18000 // ≈ 4,500-5,000 tokens — safe under Groq's free-tier TPM cap
const TOP_K = 12

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'for', 'is', 'are', 'on',
  'at', 'by', 'with', 'as', 'that', 'this', 'it', 'be', 'was', 'were', 'i',
  'my', 'me', 'do', 'does', 'can', 'what', 'how', 'when', 'will', 'if',
])

/**
 * Minimal suffix-stripping stemmer — not a full Porter stemmer, but enough
 * to catch the common case that actually bit this system in testing:
 * a question asking about a "gift" failed to match a policy written in
 * terms of "gifts". No dependency needed for this; a few safe suffix
 * rules cover most singular/plural and verb-tense mismatches between a
 * question and the policy prose it should match.
 */
function stem(word) {
  if (word.length <= 4) return word
  if (word.endsWith('ies') && word.length > 5) return word.slice(0, -3) + 'y'
  if (word.endsWith('ing') && word.length > 6) return word.slice(0, -3)
  if (word.endsWith('ed') && word.length > 5) return word.slice(0, -2)
  if (word.endsWith('es') && word.length > 5) return word.slice(0, -2)
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) || [])
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem)
}

/**
 * A short line with no sentence-ending punctuation reads as a heading in
 * real policy documents ("Annual Leave", "Data Breach Reporting") — Word
 * headings survive as their own paragraph after mammoth's text extraction.
 * Treating these as hard section boundaries (never merged across) matters:
 * without it, several short adjacent sections get jumbled into one chunk,
 * which measurably hurts BM25's ability to tell topics apart.
 */
function looksLikeHeading(paragraph) {
  const words = paragraph.split(/\s+/)
  return words.length <= 8 && !/[.!?]$/.test(paragraph.trim())
}

/**
 * Splits one document's body into chunks. Headings are hard section
 * boundaries — content is never merged across one. Within a section,
 * short adjacent paragraphs still merge up toward TARGET_CHUNK_WORDS,
 * and an overlong section is split on its own paragraph breaks.
 */
export function chunkDocument(doc) {
  const paragraphs = doc.body
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  // First pass: group paragraphs into sections, splitting at each detected
  // heading. Content before the first heading (if any) is its own section.
  const sections = []
  let current = []
  for (const para of paragraphs) {
    if (looksLikeHeading(para) && current.length) {
      sections.push(current)
      current = []
    }
    current.push(para)
  }
  if (current.length) sections.push(current)

  const chunks = []
  for (const section of sections) {
    const sectionWordCount = section.reduce((sum, p) => sum + p.split(/\s+/).length, 0)

    if (sectionWordCount <= TARGET_CHUNK_WORDS * 1.6) {
      // Whole section fits comfortably in one chunk — keep it intact so
      // the LLM always sees a complete section, not a fragment of one.
      chunks.push({ docId: doc.id, docTitle: doc.title, text: section.join('\n') })
      continue
    }

    // Section is long enough to need its own internal splitting.
    let buffer = []
    let bufferWords = 0
    for (const para of section) {
      const words = para.split(/\s+/).length
      if (bufferWords + words > TARGET_CHUNK_WORDS && bufferWords >= MIN_CHUNK_WORDS) {
        chunks.push({ docId: doc.id, docTitle: doc.title, text: buffer.join('\n') })
        buffer = []
        bufferWords = 0
      }
      buffer.push(para)
      bufferWords += words
    }
    if (buffer.length) chunks.push({ docId: doc.id, docTitle: doc.title, text: buffer.join('\n') })
  }

  return chunks
}

export function chunkAllDocuments(docs) {
  return docs.flatMap((d) => chunkDocument(d))
}

/**
 * BM25 ranking of `chunks` against `query`. Standard formula, k1=1.5, b=0.75.
 * Returns the same chunk objects with a `score` field added, sorted
 * highest-first. Pure function, no side effects, no network calls.
 */
function bm25Rank(chunks, query) {
  const k1 = 1.5
  const b = 0.75
  const queryTerms = tokenize(query)
  if (!queryTerms.length || !chunks.length) return chunks.map((c) => ({ ...c, score: 0 }))

  const docTokens = chunks.map((c) => tokenize(c.text))
  const docLengths = docTokens.map((t) => t.length)
  const avgLen = docLengths.reduce((a, b2) => a + b2, 0) / (docLengths.length || 1)
  const N = chunks.length

  // Document frequency per query term (how many chunks contain it at all)
  const df = {}
  queryTerms.forEach((term) => {
    df[term] = docTokens.filter((tokens) => tokens.includes(term)).length
  })

  const scored = chunks.map((chunk, i) => {
    const tokens = docTokens[i]
    const termFreq = {}
    tokens.forEach((t) => { termFreq[t] = (termFreq[t] || 0) + 1 })

    let score = 0
    queryTerms.forEach((term) => {
      const f = termFreq[term] || 0
      if (!f) return
      const idf = Math.log(1 + (N - df[term] + 0.5) / (df[term] + 0.5))
      const denom = f + k1 * (1 - b + (b * docLengths[i]) / (avgLen || 1))
      score += idf * ((f * (k1 + 1)) / (denom || 1))
    })
    return { ...chunk, score }
  })

  return scored.sort((a, b2) => b2.score - a.score)
}

/**
 * Main entry point: given the full set of published policy documents and
 * a question, return only the chunks worth sending to the LLM — ranked,
 * deduplicated by document where sensible, and capped to a character
 * budget so a 30-50 page handbook can never blow the token limit no
 * matter how large the source repository grows.
 *
 * Returns { chunks, usedChunkCount, totalChunkCount } so the caller can
 * show the person what was actually consulted.
 */
export function retrieveChunks(docs, question) {
  const allChunks = chunkAllDocuments(docs)
  const ranked = bm25Rank(allChunks, question).filter((c) => c.score > 0)

  const selected = []
  let charCount = 0
  for (const chunk of ranked) {
    if (selected.length >= TOP_K) break
    if (charCount + chunk.text.length > CONTEXT_CHAR_BUDGET) continue
    selected.push(chunk)
    charCount += chunk.text.length
  }

  // No lexical overlap at all (e.g. a very vague or off-topic question) —
  // fall back to the first chunk of each document rather than sending
  // nothing, so the assistant can still say "I don't see that covered"
  // with something to check against instead of an empty context.
  if (!selected.length) {
    const seen = new Set()
    for (const doc of docs) {
      if (seen.has(doc.id)) continue
      const first = allChunks.find((c) => c.docId === doc.id)
      if (first) { selected.push({ ...first, score: 0 }); seen.add(doc.id) }
      if (selected.length >= 4) break
    }
  }

  return {
    chunks: selected,
    usedChunkCount: selected.length,
    totalChunkCount: allChunks.length,
    sourceTitles: [...new Set(selected.map((c) => c.docTitle))],
  }
}
