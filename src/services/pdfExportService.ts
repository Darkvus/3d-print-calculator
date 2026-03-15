import jsPDF from 'jspdf'
import type { FilamentEntry, PrintCostBreakdown } from '../types'

interface ExportParams {
  filaments: FilamentEntry[]
  breakdown: PrintCostBreakdown
  currency: string
  printHours: number
  printerWatts: number
  kwhPrice: number
  printerPrice: number
  lifeHours: number
  maintenanceCostPerHour: number
  marginPercent: number
  failureRiskPercent: number
}

const BRAND = '#6366f1'
const MUTED = '#94a3b8'
const TEXT = '#1e293b'
const LINE = '#e2e8f0'

function fmt(value: number, currency: string) {
  return `${currency} ${value.toFixed(2)}`
}

export function exportToPDF(p: ExportParams) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const pad = 20
  let y = 0

  // ── Header bar ────────────────────────────────────────────────
  doc.setFillColor(BRAND)
  doc.rect(0, 0, W, 28, 'F')

  doc.setTextColor('#ffffff')
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('3D Print Cost Calculator', pad, 12)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('github.com/Darkvus', pad, 20)

  const date = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.text(date, W - pad, 20, { align: 'right' })

  y = 38

  // ── Helper: section title ──────────────────────────────────────
  function sectionTitle(title: string) {
    doc.setFillColor('#f1f5f9')
    doc.rect(pad, y - 5, W - pad * 2, 8, 'F')
    doc.setTextColor(BRAND)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(title.toUpperCase(), pad + 2, y)
    y += 8
    doc.setTextColor(TEXT)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
  }

  // ── Helper: row ────────────────────────────────────────────────
  function row(label: string, value: string, bold = false) {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(bold ? TEXT : MUTED)
    doc.setFontSize(9)
    doc.text(label, pad + 3, y)
    doc.setTextColor(TEXT)
    doc.text(value, W - pad - 3, y, { align: 'right' })
    y += 6
  }

  function divider() {
    doc.setDrawColor(LINE)
    doc.line(pad, y, W - pad, y)
    y += 4
  }

  // ── Filaments ─────────────────────────────────────────────────
  sectionTitle('Filamentos')
  p.filaments.forEach((f) => {
    const cost = (f.weightGrams / 1000) * f.pricePerKg * f.wasteFactor
    row(`${f.name}  (${f.weightGrams}g · ${p.currency}${f.pricePerKg}/kg · x${f.wasteFactor})`, fmt(cost, p.currency))
  })
  y += 2

  // ── Electricity ───────────────────────────────────────────────
  sectionTitle('Electricidad')
  row(`Tiempo de impresión`, `${p.printHours.toFixed(2)} h`)
  row(`Consumo`, `${p.printerWatts} W`)
  row(`Precio kWh`, fmt(p.kwhPrice, p.currency))
  row(`Costo eléctrico`, fmt(p.breakdown.electricity, p.currency))
  y += 2

  // ── Machine ───────────────────────────────────────────────────
  sectionTitle('Máquina y Mantenimiento')
  row(`Precio impresora`, fmt(p.printerPrice, p.currency))
  row(`Vida útil estimada`, `${p.lifeHours.toLocaleString()} h`)
  row(`Mantenimiento / h`, fmt(p.maintenanceCostPerHour, p.currency))
  row(`Costo de máquina`, fmt(p.breakdown.machine, p.currency))
  y += 2

  // ── Breakdown ─────────────────────────────────────────────────
  sectionTitle('Desglose de costos')
  row('Material', fmt(p.breakdown.material, p.currency))
  row('Electricidad', fmt(p.breakdown.electricity, p.currency))
  row('Máquina', fmt(p.breakdown.machine, p.currency))
  divider()
  row('Subtotal', fmt(p.breakdown.subtotal, p.currency), true)
  row(`Buffer de riesgo (${p.failureRiskPercent}%)`, fmt(p.breakdown.riskBuffer, p.currency))
  row(`Margen de ganancia (${p.marginPercent}%)`, fmt(p.breakdown.profit, p.currency))
  y += 2

  // ── Total box ─────────────────────────────────────────────────
  doc.setFillColor(BRAND)
  doc.roundedRect(pad, y, W - pad * 2, 16, 3, 3, 'F')
  doc.setTextColor('#ffffff')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Precio final', pad + 6, y + 10)
  doc.setFontSize(14)
  doc.text(fmt(p.breakdown.total, p.currency), W - pad - 6, y + 10, { align: 'right' })

  y += 26

  // ── Footer ────────────────────────────────────────────────────
  doc.setTextColor(MUTED)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text('Generado con 3D Print Cost Calculator · github.com/Darkvus', W / 2, 287, { align: 'center' })

  doc.save(`coste-impresion-${Date.now()}.pdf`)
}
