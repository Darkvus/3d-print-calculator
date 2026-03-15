import { TrendingUp } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Card } from '../ui/Card'
import { InputField } from '../ui/InputField'

export function ProfitSection() {
  const { profit, setProfit } = useCalculatorStore()

  return (
    <Card title="Margen y Riesgo" icon={<TrendingUp size={16} className="text-green-400" />} accent="border-green-800">
      <InputField
        label="Margen de ganancia"
        value={profit.marginPercent}
        unit="%"
        min={0}
        step={1}
        onChange={(v) => setProfit({ marginPercent: v })}
      />
      <InputField
        label="Riesgo de fallo de impresión"
        value={profit.failureRiskPercent}
        unit="%"
        min={0}
        step={1}
        onChange={(v) => setProfit({ failureRiskPercent: v })}
      />
    </Card>
  )
}
