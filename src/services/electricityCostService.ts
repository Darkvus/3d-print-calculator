// SRP: responsible only for electricity cost calculation
import type { ElectricityCost } from '../types'

export function calcElectricityCost(e: ElectricityCost): number {
  const kwhUsed = (e.printerWatts / 1000) * e.printHours
  return kwhUsed * e.kwhPrice
}
