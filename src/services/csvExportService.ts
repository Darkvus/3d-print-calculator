import type { FilamentEntry, PrintCostBreakdown } from '../types'

interface CsvParams {
  filaments: FilamentEntry[]
  breakdown: PrintCostBreakdown
  currency: string
  batchQuantity: number
  marginPercent: number
  failureRiskPercent: number
}

function escape(v: string | number): string {
  const s = String(v)
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportToCSV(p: CsvParams) {
  const rows: string[][] = []

  rows.push(['Sección', 'Concepto', 'Valor', 'Moneda'])

  p.filaments.forEach((f) => {
    const cost = (f.weightGrams / 1000) * f.pricePerKg * f.wasteFactor
    rows.push(['Material', f.name, cost.toFixed(4), p.currency])
  })

  rows.push(['Electricidad',   'Costo eléctrico',        p.breakdown.electricity.toFixed(4),     p.currency])
  rows.push(['Máquina',        'Costo máquina',          p.breakdown.machine.toFixed(4),          p.currency])
  rows.push(['Post-procesado', 'Costo post-procesado',   p.breakdown.postProcessing.toFixed(4),   p.currency])
  rows.push(['',               'Subtotal',                p.breakdown.subtotal.toFixed(4),         p.currency])
  rows.push(['',               `Buffer riesgo (${p.failureRiskPercent}%)`, p.breakdown.riskBuffer.toFixed(4), p.currency])
  rows.push(['',               `Margen ganancia (${p.marginPercent}%)`,    p.breakdown.profit.toFixed(4),     p.currency])
  rows.push(['',               'Precio total (lote)',     p.breakdown.total.toFixed(4),            p.currency])

  if (p.batchQuantity > 1) {
    const unit = p.breakdown.total / p.batchQuantity
    rows.push(['',             `Precio unitario (÷${p.batchQuantity})`, unit.toFixed(4), p.currency])
  }

  const csv = rows.map((r) => r.map(escape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `coste-impresion-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
