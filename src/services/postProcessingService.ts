import type { PostProcessing } from '../types'

export function calcPostProcessingCost(pp: PostProcessing, kwhPrice: number): number {
  const laborHours = pp.sandingHours + pp.supportRemovalHours + pp.assemblyHours
  const labor = laborHours * pp.laborHourlyRate
  const materials = pp.paintMaterialCost + pp.finishMaterialCost
  const energy = (pp.uvCuringWatts / 1000) * pp.uvCuringHours * kwhPrice
  return labor + materials + energy
}
