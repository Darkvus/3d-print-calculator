interface Slice {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  slices: Slice[]
  size?: number
  thickness?: number
}

export function DonutChart({ slices, size = 120, thickness = 22 }: DonutChartProps) {
  const total = slices.reduce((s, sl) => s + sl.value, 0)
  if (total <= 0) return null

  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness) / 2

  let cumAngle = -Math.PI / 2 // start at top

  const paths = slices
    .filter((sl) => sl.value > 0)
    .map((sl) => {
      const angle = (sl.value / total) * 2 * Math.PI
      const startAngle = cumAngle
      const endAngle = cumAngle + angle
      cumAngle = endAngle

      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)
      const largeArc = angle > Math.PI ? 1 : 0

      return {
        ...sl,
        d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        pct: Math.round((sl.value / total) * 100),
      }
    })

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {paths.map((p) => (
          <path
            key={p.label}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={thickness}
            strokeLinecap="butt"
          />
        ))}
      </svg>

      <div className="flex flex-col gap-1.5 min-w-0">
        {slices.filter((sl) => sl.value > 0).map((sl) => (
          <div key={sl.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sl.color }} />
            <span className="text-slate-400 truncate">{sl.label}</span>
            <span className="font-mono text-slate-300 ml-auto pl-2 shrink-0">
              {Math.round((sl.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
