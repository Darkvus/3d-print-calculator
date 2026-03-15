import { Layers, Plus, Trash2 } from 'lucide-react'
import { useCalculatorStore } from '../../store/calculatorStore'
import { Card } from '../ui/Card'
import { InputField } from '../ui/InputField'

export function MaterialSection() {
  const { filaments, addFilament, removeFilament, updateFilament } = useCalculatorStore()

  return (
    <Card
      title="Material (Filamentos)"
      icon={<Layers size={16} className="text-brand-500" />}
      accent="border-brand-700"
    >
      <div className="flex flex-col gap-4">
        {filaments.map((f, i) => (
          <div key={f.id} className="flex flex-col gap-3 rounded-xl border border-slate-700 p-3">
            {/* Header filament */}
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={f.name}
                onChange={(e) => updateFilament(f.id, { name: e.target.value })}
                className="bg-transparent text-white text-sm font-medium outline-none border-b border-transparent focus:border-brand-500 transition-colors flex-1 min-w-0"
                placeholder={`Filamento ${i + 1}`}
              />
              {filaments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFilament(f.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
                  title="Eliminar filamento"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputField
                label="Peso a imprimir"
                value={f.weightGrams}
                unit="g"
                min={0.1}
                step={0.5}
                onChange={(v) => updateFilament(f.id, { weightGrams: v })}
              />
              <InputField
                label="Precio"
                value={f.pricePerKg}
                unit="/ kg"
                min={1}
                onChange={(v) => updateFilament(f.id, { pricePerKg: v })}
              />
              <InputField
                label="Desperdicio"
                value={Math.round((f.wasteFactor - 1) * 100)}
                unit="%"
                min={0}
                step={1}
                tooltip="Porcentaje de filamento extra que se pierde por purgas, soportes o fallos. Ej: 10 = 10% más de material del estimado."
                onChange={(v) => updateFilament(f.id, { wasteFactor: 1 + v / 100 })}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addFilament}
          className="flex items-center justify-center gap-2 border border-dashed border-slate-600 hover:border-brand-500 text-slate-500 hover:text-brand-400 rounded-xl py-2 text-sm transition-colors"
        >
          <Plus size={14} />
          Añadir filamento
        </button>
      </div>
    </Card>
  )
}
