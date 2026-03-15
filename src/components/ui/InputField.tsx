interface InputFieldProps {
  label: string
  value: number
  unit?: string
  min?: number
  step?: number
  onChange: (value: number) => void
}

export function InputField({ label, value, unit, min = 0, step = 0.01, onChange }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-slate-700 focus-within:border-brand-500 transition-colors">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="bg-transparent text-white w-full outline-none text-sm"
        />
        {unit && <span className="text-slate-500 text-xs shrink-0">{unit}</span>}
      </div>
    </div>
  )
}
