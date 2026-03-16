import { Cpu } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Card } from '../ui/Card'
import { InputField } from '../ui/InputField'
import { PRINTER_PRESETS } from '../../data/printerPresets'

export function MachineSection() {
  const { machine, electricity, setMachine, setElectricity } = useCalculatorStore()

  const applyPreset = (name: string) => {
    const preset = PRINTER_PRESETS.find((p) => p.name === name)
    if (!preset) return
    setMachine({ printerPrice: preset.printerPrice, lifeHours: preset.lifeHours, maintenanceCostPerHour: preset.maintenanceCostPerHour })
    setElectricity({ printerWatts: preset.printerWatts })
  }

  return (
    <Card title="Máquina y Mantenimiento" icon={<Cpu size={16} className="text-purple-400" />} accent="border-purple-800">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Preset de impresora</label>
        <select
          defaultValue=""
          onChange={(e) => applyPreset(e.target.value)}
          className="bg-surface border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-500 transition-colors"
        >
          <option value="" disabled>Seleccionar modelo...</option>
          {PRINTER_PRESETS.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <InputField
        label="Precio de la impresora"
        value={machine.printerPrice}
        unit="$"
        min={1}
        onChange={(v) => setMachine({ printerPrice: v })}
      />
      <InputField
        label="Vida útil estimada"
        value={machine.lifeHours}
        unit="horas"
        min={100}
        step={100}
        onChange={(v) => setMachine({ lifeHours: v })}
      />
      <InputField
        label="Mantenimiento por hora"
        value={machine.maintenanceCostPerHour}
        unit="/ h"
        min={0}
        step={0.01}
        onChange={(v) => setMachine({ maintenanceCostPerHour: v })}
      />
      <InputField
        label="Consumo de la impresora"
        tooltip="Vatios que consume la impresora durante la impresión. Se actualiza automáticamente al elegir un preset."
        value={electricity.printerWatts}
        unit="W"
        min={1}
        onChange={(v) => setElectricity({ printerWatts: v })}
      />
    </Card>
  )
}
