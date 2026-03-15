// Domain types for 3D print cost calculator

export interface MaterialCost {
  filamentWeightGrams: number
  pricePerKg: number
  wasteFactor: number // e.g. 1.05 for 5% waste
}

export interface ElectricityCost {
  printHours: number
  printerWatts: number
  kwhPrice: number // price per kWh in local currency
}

export interface MachineCost {
  printerPrice: number
  lifeHours: number // estimated total life in hours
  maintenanceCostPerHour: number
}

export interface ProfitConfig {
  marginPercent: number
  failureRiskPercent: number // probability of failed print
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
  material: MaterialCost
  electricity: ElectricityCost
  machine: MachineCost
  profit: ProfitConfig
}
