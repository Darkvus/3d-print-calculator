interface AppIconProps {
  size?: number
  className?: string
}

export function AppIcon({ size = 40, className = '' }: AppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="ai-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="ai-top" x1="13" y1="14" x2="27" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="ai-right" x1="20" y1="18" x2="27" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="ai-left" x1="13" y1="18" x2="20" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#3730a3" stopOpacity="0.7" />
        </linearGradient>
        <filter id="ai-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background rounded square */}
      <rect width="40" height="40" rx="9" fill="url(#ai-bg)" />

      {/* Subtle inner glow on background */}
      <rect width="40" height="40" rx="9" fill="white" fillOpacity="0.04" />

      {/* ── Printer rail ── */}
      <rect x="7" y="7.5" width="26" height="2" rx="1" fill="white" fillOpacity="0.55" />

      {/* ── Extruder carriage body ── */}
      <rect x="16.5" y="6" width="7" height="5.5" rx="1.5" fill="white" fillOpacity="0.9" />
      {/* carriage detail line */}
      <line x1="18" y1="7.5" x2="23" y2="7.5" stroke="#93c5fd" strokeWidth="0.8" strokeLinecap="round" />

      {/* ── Nozzle tip (trapezoid) ── */}
      <path d="M17.5 11.5 L22.5 11.5 L21.2 13.8 L18.8 13.8 Z" fill="white" fillOpacity="0.95" filter="url(#ai-glow)" />

      {/* ── Extrusion filament drop ── */}
      <line x1="20" y1="13.8" x2="20" y2="15" stroke="#7dd3fc" strokeWidth="1.4" strokeLinecap="round" />

      {/* ── Isometric cube ── */}

      {/* Top face */}
      <polygon points="20,15 27,18.8 20,22.5 13,18.8" fill="url(#ai-top)" />

      {/* Right face */}
      <polygon points="20,22.5 27,18.8 27,27 20,30.8" fill="url(#ai-right)" />

      {/* Left face */}
      <polygon points="13,18.8 20,22.5 20,30.8 13,27" fill="url(#ai-left)" />

      {/* ── Layer lines — right face ── */}
      <line x1="20" y1="25.4" x2="27" y2="21.7" stroke="white" strokeWidth="0.6" strokeOpacity="0.35" />
      <line x1="20" y1="28.2" x2="27" y2="24.5" stroke="white" strokeWidth="0.6" strokeOpacity="0.35" />

      {/* ── Layer lines — left face ── */}
      <line x1="13" y1="21.7" x2="20" y2="25.4" stroke="white" strokeWidth="0.6" strokeOpacity="0.25" />
      <line x1="13" y1="24.5" x2="20" y2="28.2" stroke="white" strokeWidth="0.6" strokeOpacity="0.25" />

      {/* ── Edge highlights ── */}
      {/* top face edges */}
      <line x1="20" y1="15"   x2="27" y2="18.8" stroke="white" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="20" y1="15"   x2="13" y2="18.8" stroke="white" strokeWidth="0.6" strokeOpacity="0.5" />
      {/* vertical edges */}
      <line x1="27" y1="18.8" x2="27" y2="27"   stroke="white" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="13" y1="18.8" x2="13" y2="27"   stroke="white" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="20" y1="22.5" x2="20" y2="30.8" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" />
      {/* bottom edges */}
      <line x1="20" y1="30.8" x2="27" y2="27"   stroke="white" strokeWidth="0.5" strokeOpacity="0.35" />
      <line x1="20" y1="30.8" x2="13" y2="27"   stroke="white" strokeWidth="0.5" strokeOpacity="0.35" />

      {/* ── Small price tag dot (top-right accent) ── */}
      <circle cx="33" cy="7" r="4.5" fill="#0ea5e9" />
      <text x="33" y="10" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="white" fontFamily="system-ui, sans-serif">$</text>
    </svg>
  )
}
