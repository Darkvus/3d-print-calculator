interface CardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  accent?: string
}

export function Card({ title, icon, children, accent = 'border-slate-700' }: CardProps) {
  return (
    <div className={`bg-surface-card rounded-2xl border ${accent} p-5 flex flex-col gap-4`}>
      <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  )
}
