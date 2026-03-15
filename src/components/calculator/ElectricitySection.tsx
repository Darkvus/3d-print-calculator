import { Zap } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Card } from '../ui/Card'
import { InputField } from '../ui/InputField'

export function ElectricitySection() {
  const { electricity, setElectricity } = useCalculatorStore()

  return (
    <Card title="Electricidad" icon={<Zap size={16} className="text-yellow-400" />} accent="border-yellow-800">
      <InputField
        label="Tiempo de impresión"
        value={electricity.printHours}
        unit="horas"
        min={0.1}
        step={0.1}
        onChange={(v) => setElectricity({ printHours: v })}
      />
      <InputField
        label="Consumo de la impresora"
        value={electricity.printerWatts}
        unit="W"
        min={1}
        onChange={(v) => setElectricity({ printerWatts: v })}
      />
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
