import { useMemo, useState } from 'react'
import { ExternalLink, FileDown, FileSpreadsheet, Copy, Check, Lock, Package } from 'lucide-react'
import { AppIcon } from './ui/AppIcon'
import type { CalculatorState, PrintCostBreakdown } from '../types'
import { calcPrintCost } from '../services/printCostCalculator'
import { exportToPDF } from '../services/pdfExportService'
import { exportToCSV } from '../services/csvExportService'
import { copyTextSummary } from '../services/shareService'
import { DonutChart } from './ui/DonutChart'

interface ShareViewProps {
  state: CalculatorState & { currency: string; batchQuantity: number }
  onOpenCalculator: () => void
}

function ReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-800 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs text-slate-300 font-mono">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-card rounded-2xl border border-slate-700 p-5 flex flex-col gap-3">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{title}</p>
      {children}
    </div>
  )
}

function CopyButton({ onClick, label, icon }: { onClick: () => Promise<void>; label: string; icon: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => { await onClick(); setCopied(true); setTimeout(() => setCopied(false), 2000) }
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

function ProfitabilityBadge({ marginPercent }: { marginPercent: number }) {
  let color: string, label: string, dot: string
  if (marginPercent < 15)       { color = 'text-red-400 bg-red-950/40 border-red-900';       dot = 'bg-red-400';    label = 'Margen bajo' }
  else if (marginPercent < 35)  { color = 'text-yellow-400 bg-yellow-950/40 border-yellow-900'; dot = 'bg-yellow-400'; label = 'Margen medio' }
  else                          { color = 'text-green-400 bg-green-950/40 border-green-900'; dot = 'bg-green-400';  label = 'Margen alto' }
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label} ({marginPercent}%)
    </div>
  )
}

function BreakdownRow({ label, value, currency, muted = false }: { label: string; value: number; currency: string; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${muted ? 'text-slate-500' : 'text-slate-300'}`}>
      <span className="text-sm">{label}</span>
      <span className={`font-mono text-sm ${muted ? '' : 'text-white'}`}>{currency} {value.toFixed(2)}</span>
    </div>
  )
}

export function ShareView({ state, onOpenCalculator }: ShareViewProps) {
  const breakdown: PrintCostBreakdown = useMemo(() => calcPrintCost(state), [state])
  const { filaments, electricity, machine, profit, postProcessing, currency, batchQuantity } = state
  const unitPrice = breakdown.total / batchQuantity

  const pp = postProcessing
  const hasPP = pp.sandingHours > 0 || pp.supportRemovalHours > 0 || pp.assemblyHours > 0
    || pp.paintMaterialCost > 0 || pp.finishMaterialCost > 0 || pp.uvCuringHours > 0

  const handlePDF = () => exportToPDF({
    filaments, breakdown, currency,
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

  const handleCSV = () => exportToCSV({
    filaments, breakdown, currency, batchQuantity,
    marginPercent: profit.marginPercent,
    failureRiskPercent: profit.failureRiskPercent,
  })

  return (
    <div className="min-h-screen bg-surface text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AppIcon size={36} />
            <div>
              <h1 className="font-bold text-lg leading-tight">Printimator</h1>
              <p className="text-slate-500 text-xs hidden sm:block">Presupuesto compartido</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-700 px-2.5 py-1 rounded-full">
              <Lock size={11} />
              Solo lectura
            </div>
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink size={13} />
              Abrir en calculadora
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: parameters */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Filaments */}
            <Section title="Material (Filamentos)">
              <div className="flex flex-col gap-3">
                {filaments.map((f) => {
                  const cost = (f.weightGrams / 1000) * f.pricePerKg * f.wasteFactor
                  return (
                    <div key={f.id} className="rounded-xl border border-slate-700 p-3 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{f.name}</span>
                        <span className="font-mono text-sm text-brand-400">{currency} {cost.toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <ReadRow label="Peso" value={`${f.weightGrams} g`} />
                        <ReadRow label="Precio" value={`${currency} ${f.pricePerKg}/kg`} />
                        <ReadRow label="Desperdicio" value={`${Math.round((f.wasteFactor - 1) * 100)}%`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Section>

            {/* Electricity + Machine */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Section title="Electricidad">
                <ReadRow label="Tiempo de impresión" value={`${electricity.printHours.toFixed(2)} h`} />
                <ReadRow label="Consumo" value={`${electricity.printerWatts} W`} />
                <ReadRow label="Precio kWh" value={`${currency} ${electricity.kwhPrice}`} />
              </Section>
              <Section title="Máquina y Mantenimiento">
                <ReadRow label="Precio impresora" value={`${currency} ${machine.printerPrice}`} />
                <ReadRow label="Vida útil" value={`${machine.lifeHours.toLocaleString()} h`} />
                <ReadRow label="Mantenimiento/h" value={`${currency} ${machine.maintenanceCostPerHour}`} />
              </Section>
            </div>

            {/* Post-processing (only if used) */}
            {hasPP && (
              <Section title="Post-procesado">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {pp.sandingHours > 0        && <ReadRow label="Lijado" value={`${pp.sandingHours} h`} />}
                  {pp.supportRemovalHours > 0 && <ReadRow label="Remoción soportes" value={`${pp.supportRemovalHours} h`} />}
                  {pp.assemblyHours > 0       && <ReadRow label="Ensamblaje" value={`${pp.assemblyHours} h`} />}
                  {pp.laborHourlyRate > 0     && <ReadRow label="Tarifa mano de obra" value={`${currency} ${pp.laborHourlyRate}/h`} />}
                  {pp.paintMaterialCost > 0   && <ReadRow label="Pintura / imprimación" value={`${currency} ${pp.paintMaterialCost}`} />}
                  {pp.finishMaterialCost > 0  && <ReadRow label="Acabados especiales" value={`${currency} ${pp.finishMaterialCost}`} />}
                  {pp.uvCuringHours > 0       && <ReadRow label="Curado UV" value={`${pp.uvCuringHours} h · ${pp.uvCuringWatts} W`} />}
                </div>
              </Section>
            )}

            {/* Profit */}
            <Section title="Margen y Riesgo">
              <ReadRow label="Margen de ganancia" value={`${profit.marginPercent}%`} />
              <ReadRow label="Buffer de riesgo" value={`${profit.failureRiskPercent}%`} />
            </Section>
          </div>

          {/* Right: price panel */}
          <div className="lg:col-span-1">
            <div className="bg-surface-card rounded-2xl border border-brand-700 p-5 flex flex-col gap-5 lg:sticky lg:top-6">
              {batchQuantity > 1 && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Package size={14} className="shrink-0" />
                  Lote de <span className="font-semibold text-white">{batchQuantity} unidades</span>
                </div>
              )}

              <div className="flex justify-center">
                <ProfitabilityBadge marginPercent={profit.marginPercent} />
              </div>

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
                  <BreakdownRow label="Material"       value={breakdown.material}       currency={currency} muted />
                  <BreakdownRow label="Electricidad"   value={breakdown.electricity}    currency={currency} muted />
                  <BreakdownRow label="Máquina"        value={breakdown.machine}        currency={currency} muted />
                  {breakdown.postProcessing > 0 && <BreakdownRow label="Post-procesado" value={breakdown.postProcessing} currency={currency} muted />}
                </div>
                <BreakdownRow label="Subtotal"         value={breakdown.subtotal}       currency={currency} />
                <BreakdownRow label="Buffer de riesgo" value={breakdown.riskBuffer}     currency={currency} muted />
                <BreakdownRow label="Margen de ganancia" value={breakdown.profit}       currency={currency} muted />

                <div className="mt-3 pt-3 border-t border-slate-600 flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">{batchQuantity > 1 ? `Total (x${batchQuantity})` : 'Precio final'}</span>
                  <span className="text-2xl font-bold text-brand-500 font-mono">
                    {currency} {breakdown.total.toFixed(2)}
                  </span>
                </div>
                {batchQuantity > 1 && (
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
                  onClick={handlePDF}
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

              <CopyButton
                icon={<Copy size={13} />}
                label="Copiar resumen"
                onClick={() => copyTextSummary(breakdown, currency, batchQuantity)}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-slate-600 text-xs py-6">
        Generado con{' '}
        <span className="text-brand-400">Printimator</span>
      </footer>
    </div>
  )
}
