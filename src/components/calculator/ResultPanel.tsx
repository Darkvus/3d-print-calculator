import { Calculator, ChevronRight } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'

const CURRENCIES = ['USD', 'EUR', 'MXN', 'COP', 'ARS', 'BRL']

function CostRow({ label, value, currency, muted = false }: { label: string; value: number; currency: string; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${muted ? 'text-slate-500' : 'text-slate-300'}`}>
      <div className="flex items-center gap-1.5 text-sm">
        <ChevronRight size={12} className="text-slate-600" />
        {label}
      </div>
      <span className={`font-mono text-sm ${muted ? 'text-slate-500' : 'text-white'}`}>
        {currency} {value.toFixed(2)}
      </span>
    </div>
  )
}

export function ResultPanel() {
  const { breakdown, currency, setCurrency, calculate } = useCalculatorStore()

  return (
    <div className="bg-surface-card rounded-2xl border border-brand-700 p-5 flex flex-col gap-5 lg:sticky lg:top-6">
      {/* Currency selector */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">Moneda</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-surface border border-slate-700 text-white text-xs rounded-lg px-2 py-1 outline-none focus:border-brand-500"
        >
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Calculate button */}
      <button
        onClick={calculate}
        className="w-full bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
      >
        <Calculator size={16} />
        Calcular costo
      </button>

      {/* Breakdown */}
      {breakdown && (
        <div className="flex flex-col">
          <div className="border-b border-slate-700 pb-3 mb-1">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">Desglose</p>
            <CostRow label="Material" value={breakdown.material} currency={currency} muted />
            <CostRow label="Electricidad" value={breakdown.electricity} currency={currency} muted />
            <CostRow label="Máquina" value={breakdown.machine} currency={currency} muted />
          </div>

          <CostRow label="Subtotal" value={breakdown.subtotal} currency={currency} />
          <CostRow label="Buffer de riesgo" value={breakdown.riskBuffer} currency={currency} muted />
          <CostRow label="Margen de ganancia" value={breakdown.profit} currency={currency} muted />

          <div className="mt-3 pt-3 border-t border-slate-600 flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Precio final</span>
            <span className="text-2xl font-bold text-brand-500 font-mono">
              {currency} {breakdown.total.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {!breakdown && (
        <p className="text-center text-slate-600 text-sm">
          Ingresa los datos y presiona calcular
        </p>
      )}
    </div>
  )
}
