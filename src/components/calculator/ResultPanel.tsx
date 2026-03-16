import { useState } from 'react'
import { Calculator, ChevronRight, ChevronDown, FileDown, FileSpreadsheet, Copy, Share2, Check, Package } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { exportToPDF } from '../../services/pdfExportService'
import { exportToCSV } from '../../services/csvExportService'
import { copyShareURL, copyTextSummary } from '../../services/shareService'
import { DonutChart } from '../ui/DonutChart'
import { InputField } from '../ui/InputField'
import type { FilamentEntry } from '../../types'

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

function MaterialRow({ filaments, total, currency }: { filaments: FilamentEntry[]; total: number; currency: string }) {
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

function ProfitabilityBadge({ marginPercent }: { marginPercent: number }) {
  let color: string
  let label: string
  let dot: string

  if (marginPercent < 15) {
    color = 'text-red-400 bg-red-950/40 border-red-900'
    dot = 'bg-red-400'
    label = 'Margen bajo'
  } else if (marginPercent < 35) {
    color = 'text-yellow-400 bg-yellow-950/40 border-yellow-900'
    dot = 'bg-yellow-400'
    label = 'Margen medio'
  } else {
    color = 'text-green-400 bg-green-950/40 border-green-900'
    dot = 'bg-green-400'
    label = 'Margen alto'
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label} ({marginPercent}%)
    </div>
  )
}

function CopyButton({ onClick, label, icon }: { onClick: () => Promise<void>; label: string; icon: React.ReactNode }) {
  const [copied, setCopied] = useState(false)

  const handle = async () => {
    await onClick()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handle}
      className="flex-1 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-300 font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs"
    >
      {copied ? <Check size={13} className="text-green-400" /> : icon}
      {copied ? 'Copiado' : label}
    </button>
  )
}

export function ResultPanel() {
  const { breakdown, currency, calculate, filaments, electricity, machine, profit, postProcessing, batchQuantity, setBatchQuantity } = useCalculatorStore()

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
      postProcessing,
    })
  }

  const handleCSV = () => {
    if (!breakdown) return
    exportToCSV({ filaments, breakdown, currency, batchQuantity, marginPercent: profit.marginPercent, failureRiskPercent: profit.failureRiskPercent })
  }

  const getState = () => useCalculatorStore.getState()

  const unitPrice = breakdown ? breakdown.total / batchQuantity : null

  return (
    <div className="bg-surface-card rounded-2xl border border-brand-700 p-5 flex flex-col gap-5 lg:sticky lg:top-6">
      {/* Batch quantity */}
      <div className="flex items-center gap-3">
        <Package size={14} className="text-slate-500 shrink-0" />
        <InputField
          label="Cantidad de piezas"
          value={batchQuantity}
          unit="uds"
          min={1}
          step={1}
          tooltip="Multiplica el costo total para un lote. El precio unitario se calcula dividiendo el total entre este número."
          onChange={(v) => setBatchQuantity(Math.max(1, Math.round(v)))}
        />
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
        <>
          {/* Profitability badge */}
          <div className="flex justify-center">
            <ProfitabilityBadge marginPercent={profit.marginPercent} />
          </div>

          {/* Donut chart */}
          <DonutChart
            slices={[
              { label: 'Material',       value: breakdown.material,       color: '#0ea5e9' },
              { label: 'Electricidad',   value: breakdown.electricity,    color: '#eab308' },
              { label: 'Máquina',        value: breakdown.machine,        color: '#a855f7' },
              { label: 'Post-procesado', value: breakdown.postProcessing, color: '#14b8a6' },
            ]}
          />

          <div className="flex flex-col">
            <div className="border-b border-slate-700 pb-3 mb-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">Desglose</p>
              <MaterialRow filaments={filaments} total={breakdown.material} currency={currency} />
              <CostRow label="Electricidad" value={breakdown.electricity} currency={currency} muted />
              <CostRow label="Máquina" value={breakdown.machine} currency={currency} muted />
              <CostRow label="Post-procesado" value={breakdown.postProcessing} currency={currency} muted />
            </div>

            <CostRow label="Subtotal" value={breakdown.subtotal} currency={currency} />
            <CostRow label="Buffer de riesgo" value={breakdown.riskBuffer} currency={currency} muted />
            <CostRow label="Margen de ganancia" value={breakdown.profit} currency={currency} muted />

            <div className="mt-3 pt-3 border-t border-slate-600 flex items-center justify-between">
              <span className="text-slate-300 font-semibold">{batchQuantity > 1 ? `Total (x${batchQuantity})` : 'Precio final'}</span>
              <span className="text-2xl font-bold text-brand-500 font-mono">
                {currency} {breakdown.total.toFixed(2)}
              </span>
            </div>

            {batchQuantity > 1 && unitPrice !== null && (
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-500 text-sm">Por unidad</span>
                <span className="text-lg font-semibold text-slate-300 font-mono">
                  {currency} {unitPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Export actions */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 border border-brand-700 hover:bg-brand-900/40 text-brand-400 hover:text-brand-300 font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <FileDown size={13} />
              PDF
            </button>
            <button
              onClick={handleCSV}
              className="flex-1 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-300 font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs"
            >
              <FileSpreadsheet size={13} />
              CSV
            </button>
          </div>

          <div className="flex gap-2">
            <CopyButton
              icon={<Copy size={13} />}
              label="Copiar resumen"
              onClick={() => copyTextSummary(breakdown, currency, batchQuantity)}
            />
            <CopyButton
              icon={<Share2 size={13} />}
              label="Compartir URL"
              onClick={() => copyShareURL({ ...getState(), batchQuantity })}
            />
          </div>
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
