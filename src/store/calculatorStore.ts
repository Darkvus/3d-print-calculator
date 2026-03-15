import { create } from 'zustand'
import type { CalculatorState, FilamentEntry, PrintCostBreakdown } from '../types'
import { calcPrintCost } from '../services/printCostCalculator'

const LS_KEY = '3d-calc-state'

function newFilament(overrides?: Partial<FilamentEntry>): FilamentEntry {
  return {
    id: crypto.randomUUID(),
    name: 'Filamento 1',
    weightGrams: 50,
    pricePerKg: 20,
    wasteFactor: 1.05,
    ...overrides,
  }
}

const DEFAULT_STATE: CalculatorState = {
  filaments: [newFilament()],
  electricity: { printHours: 4, printerWatts: 200, kwhPrice: 0.12 },
  machine: { printerPrice: 300, lifeHours: 5000, maintenanceCostPerHour: 0.05 },
  profit: { marginPercent: 30, failureRiskPercent: 10 },
}

function loadFromStorage(): Partial<CalculatorState & { currency: string }> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(state: CalculatorState & { currency: string }) {
  try {
    const { filaments, electricity, machine, profit, currency } = state
    localStorage.setItem(LS_KEY, JSON.stringify({ filaments, electricity, machine, profit, currency }))
  } catch {}
}

const persisted = loadFromStorage()

interface CalculatorStore extends CalculatorState {
  breakdown: PrintCostBreakdown | null
  currency: string
  addFilament: () => void
  removeFilament: (id: string) => void
  updateFilament: (id: string, patch: Partial<Omit<FilamentEntry, 'id'>>) => void
  setElectricity: (patch: Partial<CalculatorState['electricity']>) => void
  setMachine: (patch: Partial<CalculatorState['machine']>) => void
  setProfit: (patch: Partial<CalculatorState['profit']>) => void
  setCurrency: (c: string) => void
  calculate: () => void
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  ...DEFAULT_STATE,
  ...persisted,
  breakdown: null,
  currency: persisted.currency ?? 'EUR',

  addFilament: () => {
    set((s) => {
      const idx = s.filaments.length + 1
      const next = { ...s, filaments: [...s.filaments, newFilament({ name: `Filamento ${idx}` })] }
      saveToStorage({ ...next, currency: s.currency })
      return { filaments: next.filaments }
    })
  },

  removeFilament: (id) => {
    set((s) => {
      if (s.filaments.length <= 1) return {}
      const filaments = s.filaments.filter((f) => f.id !== id)
      saveToStorage({ ...s, filaments, currency: s.currency })
      return { filaments }
    })
  },

  updateFilament: (id, patch) => {
    set((s) => {
      const filaments = s.filaments.map((f) => f.id === id ? { ...f, ...patch } : f)
      saveToStorage({ ...s, filaments, currency: s.currency })
      return { filaments }
    })
  },

  setElectricity: (patch) =>
    set((s) => {
      const electricity = { ...s.electricity, ...patch }
      saveToStorage({ ...s, electricity, currency: s.currency })
      return { electricity }
    }),

  setMachine: (patch) =>
    set((s) => {
      const machine = { ...s.machine, ...patch }
      saveToStorage({ ...s, machine, currency: s.currency })
      return { machine }
    }),

  setProfit: (patch) =>
    set((s) => {
      const profit = { ...s.profit, ...patch }
      saveToStorage({ ...s, profit, currency: s.currency })
      return { profit }
    }),

  setCurrency: (currency) =>
    set((s) => {
      saveToStorage({ ...s, currency })
      return { currency }
    }),

  calculate: () => {
    const { filaments, electricity, machine, profit } = get()
    const breakdown = calcPrintCost({ filaments, electricity, machine, profit })
    set({ breakdown })
  },
}))
