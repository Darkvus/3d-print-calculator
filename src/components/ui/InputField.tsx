import { useState, useEffect } from 'react'

interface InputFieldProps {
  label: string
  value: number
  unit?: string
  min?: number
  step?: number
  onChange: (value: number) => void
}

export function InputField({ label, value, unit, min = 0, step = 0.01, onChange }: InputFieldProps) {
  const [display, setDisplay] = useState(String(value))

  // Sync when value changes externally (e.g. unit toggle)
  useEffect(() => {
    setDisplay((prev) => {
      const parsed = parseFloat(prev)
      return isNaN(parsed) || parsed !== value ? String(value) : prev
    })
  }, [value])

  const handleChange = (raw: string) => {
    setDisplay(raw)
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) onChange(parsed)
  }

  const handleBlur = () => {
    const parsed = parseFloat(display)
    const clamped = isNaN(parsed) ? min : Math.max(min, parsed)
    setDisplay(String(clamped))
    onChange(clamped)
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-slate-700 focus-within:border-brand-500 transition-colors">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={display}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className="bg-transparent text-white w-full outline-none text-sm"
        />
        {unit && <span className="text-slate-500 text-xs shrink-0">{unit}</span>}
      </div>
    </div>
  )
}
