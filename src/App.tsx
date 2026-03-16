import { useEffect, useState } from 'react'
import { Heart, Sun, Moon, LayoutList, LayoutDashboard } from 'lucide-react'
import { AppIcon } from './components/ui/AppIcon'
import { useCalculatorStore } from './store/calculatorStore'
import { MaterialSection } from './components/calculator/MaterialSection'
import { ElectricitySection } from './components/calculator/ElectricitySection'
import { MachineSection } from './components/calculator/MachineSection'
import { PostProcessingSection } from './components/calculator/PostProcessingSection'
import { ProfitSection } from './components/calculator/ProfitSection'
import { ResultPanel } from './components/calculator/ResultPanel'
import { IOSInstallBanner } from './components/ui/IOSInstallBanner'
import { ShareView } from './components/ShareView'
import { decodeHashToState } from './services/shareService'

const CURRENCIES = ['USD', 'EUR', 'MXN', 'COP', 'ARS', 'BRL']

export default function App() {
  const { currency, setCurrency, theme, setTheme, compactMode, setCompactMode } = useCalculatorStore()

  // Detect share mode from URL hash
  const [shareState] = useState(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return null
    const decoded = decodeHashToState(hash)
    if (!decoded?.filaments || !decoded?.electricity || !decoded?.machine || !decoded?.profit) return null
    return decoded as ReturnType<typeof decodeHashToState> & { currency: string; batchQuantity: number }
  })
  const [viewMode, setViewMode] = useState<'share' | 'calculator'>(shareState ? 'share' : 'calculator')

  // Apply theme on mount and on change
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  if (viewMode === 'share' && shareState) {
    return (
      <ShareView
        state={{
          filaments: shareState.filaments!,
          electricity: shareState.electricity!,
          machine: shareState.machine!,
          profit: shareState.profit!,
          postProcessing: shareState.postProcessing ?? {
            laborHourlyRate: 0, sandingHours: 0, supportRemovalHours: 0,
            assemblyHours: 0, paintMaterialCost: 0, finishMaterialCost: 0,
            uvCuringHours: 0, uvCuringWatts: 0,
          },
          batchQuantity: shareState.batchQuantity ?? 1,
          currency: shareState.currency ?? 'EUR',
        }}
        onOpenCalculator={() => {
          window.location.hash = ''
          setViewMode('calculator')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-surface text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AppIcon size={36} />
            <div>
              <h1 className="font-bold text-lg leading-tight">Printimator</h1>
              <p className="text-slate-500 text-xs hidden sm:block">Calcula el costo real de tus impresiones</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <a
              href="https://paypal.me/alexcaraballo96"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <Heart size={13} />
              <span className="hidden sm:inline">Donar</span>
            </a>

            {/* Compact mode toggle */}
            <button
              title={compactMode ? 'Modo expandido' : 'Modo compacto'}
              onClick={() => setCompactMode(!compactMode)}
              className={`p-1.5 rounded-lg transition-colors border ${compactMode ? 'border-brand-600 text-brand-400 bg-brand-900/40' : 'border-slate-700 text-slate-400 hover:text-white'}`}
            >
              {compactMode ? <LayoutDashboard size={15} /> : <LayoutList size={15} />}
            </button>

            {/* Theme toggle */}
            <button
              title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <span className="text-slate-500 text-xs hidden sm:block">Moneda</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-2 py-1.5 outline-none focus:border-brand-500 transition-colors"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <MaterialSection />
            <ElectricitySection />
            <MachineSection />
            <PostProcessingSection />
            <ProfitSection />
          </div>
          <div className="lg:col-span-1">
            <ResultPanel />
          </div>
        </div>
      </main>

      <IOSInstallBanner />

      <footer className="text-center text-slate-600 text-xs py-6 flex flex-col items-center gap-2">
        <span>
          Desarrollado por{' '}
          <a
            href="https://github.com/darkvus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            darkvus
          </a>
          {' '}con ❤️
        </span>
        <a
          href="https://paypal.me/alexcaraballo96"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold text-xs px-4 py-1.5 rounded-lg transition-colors"
        >
          <Heart size={12} />
          Donar
        </a>
      </footer>
    </div>
  )
}
