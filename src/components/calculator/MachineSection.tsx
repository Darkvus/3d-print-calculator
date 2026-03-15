import { Cpu } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Card } from '../ui/Card'
import { InputField } from '../ui/InputField'

export function MachineSection() {
  const { machine, setMachine } = useCalculatorStore()

  return (
    <Card title="Máquina y Mantenimiento" icon={<Cpu size={16} className="text-purple-400" />} accent="border-purple-800">
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
    </Card>
  )
}
