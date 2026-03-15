import { Printer } from 'lucide-react'
import { MaterialSection } from './components/calculator/MaterialSection'
import { ElectricitySection } from './components/calculator/ElectricitySection'
import { MachineSection } from './components/calculator/MachineSection'
import { ProfitSection } from './components/calculator/ProfitSection'
import { ResultPanel } from './components/calculator/ResultPanel'

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="bg-brand-700 p-2 rounded-xl">
            <Printer size={20} className="text-brand-100" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">3D Print Cost Calculator</h1>
            <p className="text-slate-500 text-xs">Calcula el costo real de tus impresiones</p>
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

      <footer className="text-center text-slate-700 text-xs py-6">
        3D Print Cost Calculator — frontend only
      </footer>
    </div>
  )
}
