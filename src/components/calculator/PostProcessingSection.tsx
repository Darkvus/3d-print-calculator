import { Sparkles } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Card } from '../ui/Card'
import { InputField } from '../ui/InputField'

export function PostProcessingSection() {
  const { postProcessing, setPostProcessing } = useCalculatorStore()

  return (
    <Card title="Post-procesado" icon={<Sparkles size={16} className="text-teal-400" />} accent="border-teal-800">
      {/* Mano de obra */}
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2 mt-1">Mano de obra</p>
      <InputField
        label="Tarifa por hora"
        tooltip="Coste de tu tiempo o el de un operario por hora de trabajo"
        value={postProcessing.laborHourlyRate}
        unit="/ h"
        min={0}
        step={0.5}
        onChange={(v) => setPostProcessing({ laborHourlyRate: v })}
      />
      <InputField
        label="Lijado / desbaste"
        tooltip="Horas dedicadas a lijar o desbastar la pieza"
        value={postProcessing.sandingHours}
        unit="h"
        min={0}
        step={0.25}
        onChange={(v) => setPostProcessing({ sandingHours: v })}
      />
      <InputField
        label="Remoción de soportes"
        tooltip="Horas dedicadas a retirar soportes de impresión"
        value={postProcessing.supportRemovalHours}
        unit="h"
        min={0}
        step={0.25}
        onChange={(v) => setPostProcessing({ supportRemovalHours: v })}
      />
      <InputField
        label="Ensamblaje"
        tooltip="Horas dedicadas a montar piezas entre sí"
        value={postProcessing.assemblyHours}
        unit="h"
        min={0}
        step={0.25}
        onChange={(v) => setPostProcessing({ assemblyHours: v })}
      />

      {/* Materiales de acabado */}
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2 mt-4">Materiales de acabado</p>
      <InputField
        label="Pintura / imprimación"
        tooltip="Coste total de pinturas, sprays o imprimaciones usadas"
        value={postProcessing.paintMaterialCost}
        unit="$"
        min={0}
        step={0.01}
        onChange={(v) => setPostProcessing({ paintMaterialCost: v })}
      />
      <InputField
        label="Acabados especiales"
        tooltip="Coste de barniz, resina epoxy, relleno u otros acabados"
        value={postProcessing.finishMaterialCost}
        unit="$"
        min={0}
        step={0.01}
        onChange={(v) => setPostProcessing({ finishMaterialCost: v })}
      />

      {/* Curado UV */}
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2 mt-4">Curado UV (resina)</p>
      <InputField
        label="Tiempo de curado"
        tooltip="Horas de exposición a la lámpara UV"
        value={postProcessing.uvCuringHours}
        unit="h"
        min={0}
        step={0.25}
        onChange={(v) => setPostProcessing({ uvCuringHours: v })}
      />
      <InputField
        label="Potencia de la lámpara"
        tooltip="Vatios consumidos por la lámpara o cámara UV"
        value={postProcessing.uvCuringWatts}
        unit="W"
        min={0}
        step={1}
        onChange={(v) => setPostProcessing({ uvCuringWatts: v })}
      />
    </Card>
  )
}
