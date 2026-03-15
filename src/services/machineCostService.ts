// SRP: responsible only for machine depreciation cost
import type { MachineCost, ElectricityCost } from '../types'

export function calcMachineCost(m: MachineCost, printHours: ElectricityCost['printHours']): number {
  const depreciationPerHour = m.printerPrice / m.lifeHours
  return (depreciationPerHour + m.maintenanceCostPerHour) * printHours
}
