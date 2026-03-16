import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Card } from '../ui/Card'
import { InputField } from '../ui/InputField'

export function ElectricitySection() {
  const { electricity, setElectricity } = useCalculatorStore()
  const [useMinutes, setUseMinutes] = useState(false)

  const numericDisplay = useMinutes
    ? Math.round(electricity.printHours * 60 * 100) / 100
    : electricity.printHours

  const [display, setDisplay] = useState(String(numericDisplay))

  useEffect(() => {
    setDisplay(String(numericDisplay))
  }, [useMinutes]) // only reset display string on unit toggle

  const handleTimeChange = (raw: string) => {
    setDisplay(raw)
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) setElectricity({ printHours: useMinutes ? parsed / 60 : parsed })
  }

  const handleTimeBlur = () => {
    const min = useMinutes ? 1 : 0.1
    const parsed = parseFloat(display)
    const clamped = isNaN(parsed) ? min : Math.max(min, parsed)
    setDisplay(String(clamped))
    setElectricity({ printHours: useMinutes ? clamped / 60 : clamped })
  }

  const handleToggle = (toMinutes: boolean) => {
    setUseMinutes(toMinutes)
  }

  return (
    <Card title="Electricidad" icon={<Zap size={16} className="text-yellow-400" />} accent="border-yellow-800">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Tiempo de impresión</label>
          <div className="flex rounded-md overflow-hidden border border-slate-700 text-xs shrink-0">
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`px-2 py-1 transition-colors ${!useMinutes ? 'bg-yellow-700 text-white' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              h
            </button>
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`px-2 py-1 transition-colors ${useMinutes ? 'bg-yellow-700 text-white' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              min
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-slate-700 focus-within:border-brand-500 transition-colors">
          <input
            type="number"
            inputMode="decimal"
            min={useMinutes ? 1 : 0.1}
            step={useMinutes ? 1 : 0.1}
            value={display}
            onChange={(e) => handleTimeChange(e.target.value)}
            onBlur={handleTimeBlur}
            className="bg-transparent text-white w-full outline-none text-sm"
          />
          <span className="text-slate-500 text-xs shrink-0">{useMinutes ? 'min' : 'horas'}</span>
        </div>
      </div>
      <InputField
        label="Precio del kWh"
        value={electricity.kwhPrice}
        unit="/ kWh"
        min={0.01}
        step={0.001}
        onChange={(v) => setElectricity({ kwhPrice: v })}
      />
    </Card>
  )
}
