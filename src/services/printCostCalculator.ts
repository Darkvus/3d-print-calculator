import type { CalculatorState, PrintCostBreakdown } from '../types'
import { calcMaterialCost } from './materialCostService'
import { calcElectricityCost } from './electricityCostService'
import { calcMachineCost } from './machineCostService'
import { calcPostProcessingCost } from './postProcessingService'

export function calcPrintCost(state: CalculatorState): PrintCostBreakdown {
  const material = calcMaterialCost(state.filaments)
  const electricity = calcElectricityCost(state.electricity)
  const machine = calcMachineCost(state.machine, state.electricity.printHours)
  const postProcessing = calcPostProcessingCost(state.postProcessing, state.electricity.kwhPrice)

  const subtotal = material + electricity + machine + postProcessing
  const riskBuffer = subtotal * (state.profit.failureRiskPercent / 100)
  const profit = (subtotal + riskBuffer) * (state.profit.marginPercent / 100)
  const total = subtotal + riskBuffer + profit

  return { material, electricity, machine, postProcessing, subtotal, riskBuffer, profit, total }
}
