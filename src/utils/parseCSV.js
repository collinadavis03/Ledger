import { categorize } from './categories.js'

/**
 * Parses a CSV string exported from a bank into transaction objects.
 * Handles quoted fields, $ signs, and negative amounts.
 * Supports common bank CSV formats from Chase, Wells Fargo, BofA, Capital One.
 */
export function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0]
    .split(',')
    .map((h) => h.trim().toLowerCase().replace(/"/g, ''))

  const dateCol = headers.findIndex((h) => h.includes('date'))
  const descCol = headers.findIndex(
    (h) => h.includes('desc') || h.includes('name') || h.includes('memo') || h.includes('payee')
  )
  const amtCol = headers.findIndex(
    (h) => h.includes('amount') || h.includes('amt') || h.includes('debit') || h.includes('credit')
  )

  if (dateCol === -1 || descCol === -1 || amtCol === -1) {
    console.warn('Could not detect required columns (date, description, amount) in CSV headers:', headers)
    return []
  }

  return lines
    .slice(1)
    .map((line) => {
      // Handle quoted CSV fields
      const cols = line.match(/(".*?"|[^,]+|(?<=,)(?=,))/g)?.map((c) =>
        c.replace(/^"|"$/g, '').trim()
      ) || []

      const rawAmt = parseFloat(cols[amtCol]?.replace(/[$, ]/g, '') || '0')
      const desc = cols[descCol] || 'Unknown'
      const date = cols[dateCol] || new Date().toISOString().split('T')[0]

      return {
        date: normalizeDate(date),
        description: desc,
        amount: Math.abs(rawAmt),
        type: rawAmt < 0 ? 'expense' : 'income',
        category: categorize(desc),
      }
    })
    .filter((t) => t.amount > 0 && t.date)
}

function normalizeDate(raw) {
  // Handles MM/DD/YYYY, YYYY-MM-DD, MM-DD-YYYY
  if (!raw) return null
  const cleaned = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned
  const parts = cleaned.split(/[\/\-]/)
  if (parts.length === 3) {
    if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`
    return `${parts[2]}-${parts[0].padStart(2,'0')}-${parts[1].padStart(2,'0')}`
  }
  return cleaned
}
