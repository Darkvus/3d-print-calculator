import type { FilamentEntry } from '../types'

export function calcFilamentCost(f: FilamentEntry): number {
  return (f.weightGrams / 1000) * f.pricePerKg * f.wasteFactor
}

export function calcMaterialCost(filaments: FilamentEntry[]): number {
  return filaments.reduce((sum, f) => sum + calcFilamentCost(f), 0)
}
