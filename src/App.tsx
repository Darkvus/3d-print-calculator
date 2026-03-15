import { Heart, Printer } from 'lucide-react'
import { useCalculatorStore } from './store/calculatorStore'
import { MaterialSection } from './components/calculator/MaterialSection'
import { ElectricitySection } from './components/calculator/ElectricitySection'
import { MachineSection } from './components/calculator/MachineSection'
import { ProfitSection } from './components/calculator/ProfitSection'
import { ResultPanel } from './components/calculator/ResultPanel'

const CURRENCIES = ['USD', 'EUR', 'MXN', 'COP', 'ARS', 'BRL']

export default function App() {
  const { currency, setCurrency } = useCalculatorStore()

  return (
    <div className="min-h-screen bg-surface text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-brand-700 p-2 rounded-xl">
              <Printer size={20} className="text-brand-100" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">3D Print Cost Calculator</h1>
              <p className="text-slate-500 text-xs hidden sm:block">Calcula el costo real de tus impresiones</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://paypal.me/alexcaraballo96"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <Heart size={13} />
              <span className="hidden sm:inline">Donar</span>
            </a>
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
            <ProfitSection />
          </div>
          <div className="lg:col-span-1">
            <ResultPanel />
          </div>
        </div>
      </main>

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
