import { useState } from 'react'
import { X, Share, Plus } from 'lucide-react'

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone() {
  return ('standalone' in navigator) && (navigator as Navigator & { standalone: boolean }).standalone
}

export function IOSInstallBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('ios-banner-dismissed') === '1'
  )

  if (!isIOS() || isStandalone() || dismissed) return null

  const dismiss = () => {
    localStorage.setItem('ios-banner-dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-md mx-auto bg-slate-800 border border-brand-700 rounded-2xl shadow-2xl p-4">
        {/* Arrow pointing down (toward home bar) */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-slate-800 border-r border-b border-brand-700 rotate-45" />

        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-white font-semibold text-sm">Instala la app en tu iPhone</p>
          <button onClick={dismiss} className="text-slate-500 hover:text-white shrink-0 transition-colors">
            <X size={16} />
          </button>
        </div>

        <ol className="flex flex-col gap-2.5">
          <li className="flex items-center gap-3 text-slate-300 text-sm">
            <span className="bg-brand-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <span>Toca el botón <strong className="text-white">Compartir</strong></span>
            <Share size={16} className="text-brand-400 shrink-0" />
          </li>
          <li className="flex items-center gap-3 text-slate-300 text-sm">
            <span className="bg-brand-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <span>Selecciona <strong className="text-white">"Añadir a pantalla de inicio"</strong></span>
            <Plus size={16} className="text-brand-400 shrink-0" />
          </li>
          <li className="flex items-center gap-3 text-slate-300 text-sm">
            <span className="bg-brand-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <span>Pulsa <strong className="text-white">Añadir</strong> y listo</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
