import { create } from 'zustand'
import type { CalculatorState, PrintCostBreakdown } from '../types'
import { calcPrintCost } from '../services/printCostCalculator'

interface CalculatorStore extends CalculatorState {
  breakdown: PrintCostBreakdown | null
  currency: string
  setMaterial: (patch: Partial<CalculatorState['material']>) => void
  setElectricity: (patch: Partial<CalculatorState['electricity']>) => void
  setMachine: (patch: Partial<CalculatorState['machine']>) => void
  setProfit: (patch: Partial<CalculatorState['profit']>) => void
  setCurrency: (c: string) => void
  calculate: () => void
}

const DEFAULT_STATE: CalculatorState = {
  material: { filamentWeightGrams: 50, pricePerKg: 20, wasteFactor: 1.05 },
  electricity: { printHours: 4, printerWatts: 200, kwhPrice: 0.12 },
  machine: { printerPrice: 300, lifeHours: 5000, maintenanceCostPerHour: 0.05 },
  profit: { marginPercent: 30, failureRiskPercent: 10 },
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  ...DEFAULT_STATE,
  breakdown: null,
  currency: 'USD',

  setMaterial: (patch) =>
    set((s) => ({ material: { ...s.material, ...patch } })),

  setElectricity: (patch) =>
    set((s) => ({ electricity: { ...s.electricity, ...patch } })),

  setMachine: (patch) =>
    set((s) => ({ machine: { ...s.machine, ...patch } })),

  setProfit: (patch) =>
    set((s) => ({ profit: { ...s.profit, ...patch } })),

  setCurrency: (currency) => set({ currency }),

  calculate: () => {
    const { material, electricity, machine, profit } = get()
    const breakdown = calcPrintCost({ material, electricity, machine, profit })
    set({ breakdown })
  },
}))
