// SRP: responsible only for material cost calculation
import type { MaterialCost } from '../types'

export function calcMaterialCost(m: MaterialCost): number {
  const costPerGram = m.pricePerKg / 1000
  return m.filamentWeightGrams * costPerGram * m.wasteFactor
}
