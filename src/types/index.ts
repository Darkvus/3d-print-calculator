// Domain types for 3D print cost calculator

export interface FilamentEntry {
  id: string
  name: string
  weightGrams: number
  pricePerKg: number
  wasteFactor: number
}

export interface ElectricityCost {
  printHours: number
  printerWatts: number
  kwhPrice: number
}

export interface MachineCost {
  printerPrice: number
  lifeHours: number
  maintenanceCostPerHour: number
}

export interface ProfitConfig {
  marginPercent: number
  failureRiskPercent: number
}

export interface PrintCostBreakdown {
  material: number
  electricity: number
  machine: number
  subtotal: number
  riskBuffer: number
  profit: number
  total: number
}

export interface CalculatorState {
  filaments: FilamentEntry[]
  electricity: ElectricityCost
  machine: MachineCost
  profit: ProfitConfig
}
