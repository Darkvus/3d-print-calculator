import { create } from 'zustand'
import type { CalculatorState, FilamentEntry, PostProcessing, PrintCostBreakdown } from '../types'
import { calcPrintCost } from '../services/printCostCalculator'
import { decodeHashToState } from '../services/shareService'

const LS_KEY = '3d-calc-state'

function newFilament(overrides?: Partial<FilamentEntry>): FilamentEntry {
  return {
    id: crypto.randomUUID(),
    name: 'Filamento 1',
    weightGrams: 50,
    pricePerKg: 20,
    wasteFactor: 1,
    ...overrides,
  }
}

const DEFAULT_STATE: CalculatorState = {
  filaments: [newFilament()],
  electricity: { printHours: 4, printerWatts: 200, kwhPrice: 0.12 },
  machine: { printerPrice: 300, lifeHours: 5000, maintenanceCostPerHour: 0.05 },
  profit: { marginPercent: 30, failureRiskPercent: 10 },
  postProcessing: {
    laborHourlyRate: 0,
    sandingHours: 0,
    supportRemovalHours: 0,
    assemblyHours: 0,
    paintMaterialCost: 0,
    finishMaterialCost: 0,
    uvCuringHours: 0,
    uvCuringWatts: 0,
  },
  batchQuantity: 1,
}

function loadFromStorage(): Partial<CalculatorState & { currency: string; theme: string; compactMode: boolean }> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(state: CalculatorState & { currency: string; theme: string; compactMode: boolean }) {
  try {
    const { filaments, electricity, machine, profit, postProcessing, batchQuantity, currency, theme, compactMode } = state
    localStorage.setItem(LS_KEY, JSON.stringify({ filaments, electricity, machine, profit, postProcessing, batchQuantity, currency, theme, compactMode }))
  } catch {}
}

// Load from URL hash if present, otherwise fall back to localStorage
function loadInitialState(): Partial<CalculatorState & { currency: string; batchQuantity: number }> {
  const hash = window.location.hash.slice(1)
  if (hash) {
    const decoded = decodeHashToState(hash)
    if (decoded) return decoded
  }
  return loadFromStorage()
}

const persisted = loadInitialState()

interface CalculatorStore extends CalculatorState {
  breakdown: PrintCostBreakdown | null
  currency: string
  theme: string
  compactMode: boolean
  addFilament: () => void
  removeFilament: (id: string) => void
  updateFilament: (id: string, patch: Partial<Omit<FilamentEntry, 'id'>>) => void
  setElectricity: (patch: Partial<CalculatorState['electricity']>) => void
  setMachine: (patch: Partial<CalculatorState['machine']>) => void
  setProfit: (patch: Partial<CalculatorState['profit']>) => void
  setPostProcessing: (patch: Partial<PostProcessing>) => void
  setBatchQuantity: (n: number) => void
  setCurrency: (c: string) => void
  setTheme: (t: string) => void
  setCompactMode: (v: boolean) => void
  calculate: () => void
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  ...DEFAULT_STATE,
  ...persisted,
  breakdown: null,
  currency: persisted.currency ?? 'EUR',
  theme: (persisted as any).theme ?? 'dark',
  compactMode: (persisted as any).compactMode ?? false,

  addFilament: () => {
    set((s) => {
      const idx = s.filaments.length + 1
      const next = { ...s, filaments: [...s.filaments, newFilament({ name: `Filamento ${idx}` })] }
      saveToStorage({ ...next, currency: s.currency, theme: s.theme, compactMode: s.compactMode })
      return { filaments: next.filaments }
    })
  },

  removeFilament: (id) => {
    set((s) => {
      if (s.filaments.length <= 1) return {}
      const filaments = s.filaments.filter((f) => f.id !== id)
      saveToStorage({ ...s, filaments, currency: s.currency, theme: s.theme, compactMode: s.compactMode })
      return { filaments }
    })
  },

  updateFilament: (id, patch) => {
    set((s) => {
      const filaments = s.filaments.map((f) => f.id === id ? { ...f, ...patch } : f)
      saveToStorage({ ...s, filaments, currency: s.currency, theme: s.theme, compactMode: s.compactMode })
      return { filaments }
    })
  },

  setElectricity: (patch) =>
    set((s) => {
      const electricity = { ...s.electricity, ...patch }
      saveToStorage({ ...s, electricity, currency: s.currency, theme: s.theme, compactMode: s.compactMode })
      return { electricity }
    }),

  setMachine: (patch) =>
    set((s) => {
      const machine = { ...s.machine, ...patch }
      saveToStorage({ ...s, machine, currency: s.currency, theme: s.theme, compactMode: s.compactMode })
      return { machine }
    }),

  setProfit: (patch) =>
    set((s) => {
      const profit = { ...s.profit, ...patch }
      saveToStorage({ ...s, profit, currency: s.currency, theme: s.theme, compactMode: s.compactMode })
      return { profit }
    }),

  setPostProcessing: (patch) =>
    set((s) => {
      const postProcessing = { ...s.postProcessing, ...patch }
      saveToStorage({ ...s, postProcessing, currency: s.currency, theme: s.theme, compactMode: s.compactMode })
      return { postProcessing }
    }),

  setBatchQuantity: (batchQuantity) =>
    set((s) => {
      saveToStorage({ ...s, batchQuantity, currency: s.currency, theme: s.theme, compactMode: s.compactMode })
      return { batchQuantity }
    }),

  setCurrency: (currency) =>
    set((s) => {
      saveToStorage({ ...s, currency, theme: s.theme, compactMode: s.compactMode })
      return { currency }
    }),

  setTheme: (theme) =>
    set((s) => {
      saveToStorage({ ...s, theme, currency: s.currency, compactMode: s.compactMode })
      document.documentElement.classList.toggle('light', theme === 'light')
      return { theme }
    }),

  setCompactMode: (compactMode) =>
    set((s) => {
      saveToStorage({ ...s, compactMode, currency: s.currency, theme: s.theme })
      return { compactMode }
    }),

  calculate: () => {
    const { filaments, electricity, machine, profit, postProcessing, batchQuantity } = get()
    const breakdown = calcPrintCost({ filaments, electricity, machine, profit, postProcessing, batchQuantity })
    set({ breakdown })
  },
}))
