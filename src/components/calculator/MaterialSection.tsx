import { Layers } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Card } from '../ui/Card'
import { InputField } from '../ui/InputField'

export function MaterialSection() {
  const { material, setMaterial } = useCalculatorStore()

  return (
    <Card title="Material (Filamento)" icon={<Layers size={16} className="text-brand-500" />} accent="border-brand-700">
      <InputField
        label="Peso a imprimir"
        value={material.filamentWeightGrams}
        unit="g"
        min={0.1}
        step={0.5}
        onChange={(v) => setMaterial({ filamentWeightGrams: v })}
      />
      <InputField
        label="Precio del filamento"
        value={material.pricePerKg}
        unit="/ kg"
        min={1}
        onChange={(v) => setMaterial({ pricePerKg: v })}
      />
      <InputField
        label="Factor de desperdicio"
        value={material.wasteFactor}
        unit="x"
        min={1}
        step={0.01}
        onChange={(v) => setMaterial({ wasteFactor: v })}
      />
    </Card>
  )
}
