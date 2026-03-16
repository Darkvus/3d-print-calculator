import type { CalculatorState } from '../types'

export function encodeStateToHash(state: CalculatorState & { currency: string; batchQuantity: number }): string {
  const { filaments, electricity, machine, profit, postProcessing, currency, batchQuantity } = state
  const payload = { filaments, electricity, machine, profit, postProcessing, currency, batchQuantity }
  return btoa(encodeURIComponent(JSON.stringify(payload)))
}

export function decodeHashToState(hash: string): Partial<CalculatorState & { currency: string; batchQuantity: number }> | null {
  try {
    return JSON.parse(decodeURIComponent(atob(hash)))
  } catch {
    return null
  }
}

export function buildShareURL(state: CalculatorState & { currency: string; batchQuantity: number }): string {
  const hash = encodeStateToHash(state)
  const url = new URL(window.location.href)
  url.hash = hash
  return url.toString()
}

export async function copyShareURL(state: CalculatorState & { currency: string; batchQuantity: number }): Promise<void> {
  const url = buildShareURL(state)
  await navigator.clipboard.writeText(url)
  window.location.hash = encodeStateToHash(state)
}

export async function copyTextSummary(
  breakdown: { material: number; electricity: number; machine: number; postProcessing: number; subtotal: number; riskBuffer: number; profit: number; total: number },
  currency: string,
  batchQuantity: number,
): Promise<void> {
  const fmt = (n: number) => `${currency} ${n.toFixed(2)}`
  const lines = [
    '📦 Resumen de costo de impresión 3D',
    '─────────────────────────────',
    `Material:       ${fmt(breakdown.material)}`,
    `Electricidad:   ${fmt(breakdown.electricity)}`,
    `Máquina:        ${fmt(breakdown.machine)}`,
    `Post-procesado: ${fmt(breakdown.postProcessing)}`,
    `Subtotal:       ${fmt(breakdown.subtotal)}`,
    `Buffer riesgo:  ${fmt(breakdown.riskBuffer)}`,
    `Margen:         ${fmt(breakdown.profit)}`,
    '─────────────────────────────',
    `TOTAL:          ${fmt(breakdown.total)}`,
  ]
  if (batchQuantity > 1) {
    lines.push(`Por unidad (÷${batchQuantity}): ${fmt(breakdown.total / batchQuantity)}`)
  }
  await navigator.clipboard.writeText(lines.join('\n'))
}
