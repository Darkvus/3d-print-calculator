import { useState } from 'react'
import { Calculator, ChevronRight, ChevronDown, FileDown } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { exportToPDF } from '../../services/pdfExportService'

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

function MaterialRow({ filaments, total, currency }: { filaments: ReturnType<typeof useCalculatorStore>['filaments']; total: number; currency: string }) {
  const [open, setOpen] = useState(false)
  const multi = filaments.length > 1

  return (
    <div>
      <button
        type="button"
        onClick={() => multi && setOpen((v) => !v)}
        className={`w-full flex items-center justify-between py-2 text-slate-500 ${multi ? 'hover:text-slate-300 transition-colors cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-1.5 text-sm">
          {multi
            ? (open ? <ChevronDown size={12} className="text-slate-500" /> : <ChevronRight size={12} className="text-slate-500" />)
            : <ChevronRight size={12} className="text-slate-600" />
          }
          Material{multi ? ' total' : ''}
        </div>
        <span className="font-mono text-sm">{currency} {total.toFixed(2)}</span>
      </button>

      {open && multi && (
        <div className="pl-4 border-l border-slate-700 ml-1 mb-1">
          {filaments.map((f) => {
            const cost = (f.weightGrams / 1000) * f.pricePerKg * f.wasteFactor
            return (
              <div key={f.id} className="flex items-center justify-between py-1 text-slate-600">
                <span className="text-xs truncate max-w-[55%]">{f.name}</span>
                <span className="font-mono text-xs">{currency} {cost.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ResultPanel() {
  const { breakdown, currency, calculate, filaments, electricity, machine, profit } = useCalculatorStore()

  const handleExport = () => {
    if (!breakdown) return
    exportToPDF({
      filaments,
      breakdown,
      currency,
      printHours: electricity.printHours,
      printerWatts: electricity.printerWatts,
      kwhPrice: electricity.kwhPrice,
      printerPrice: machine.printerPrice,
      lifeHours: machine.lifeHours,
      maintenanceCostPerHour: machine.maintenanceCostPerHour,
      marginPercent: profit.marginPercent,
      failureRiskPercent: profit.failureRiskPercent,
    })
  }

  return (
    <div className="bg-surface-card rounded-2xl border border-brand-700 p-5 flex flex-col gap-5 lg:sticky lg:top-6">
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
        <>
          <div className="flex flex-col">
            <div className="border-b border-slate-700 pb-3 mb-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">Desglose</p>
              <MaterialRow filaments={filaments} total={breakdown.material} currency={currency} />
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

          {/* Export PDF button */}
          <button
            onClick={handleExport}
            className="w-full border border-brand-700 hover:bg-brand-900/40 text-brand-400 hover:text-brand-300 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <FileDown size={15} />
            Exportar PDF
          </button>
        </>
      )}

      {!breakdown && (
        <p className="text-center text-slate-600 text-sm">
          Ingresa los datos y presiona calcular
        </p>
      )}
    </div>
  )
}
