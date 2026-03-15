import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  accent?: string
  defaultOpen?: boolean
}

export function Card({ title, icon, children, accent = 'border-slate-700', defaultOpen = true }: CardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`bg-surface-card rounded-2xl border ${accent} flex flex-col`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 px-5 py-4 text-slate-300 font-semibold text-sm w-full hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronDown
          size={15}
          className={`text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-4">
          {children}
        </div>
      )}
    </div>
  )
}
