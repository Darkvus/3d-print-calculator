export interface FilamentPreset {
  name: string
  pricePerKg: number
  wasteFactor: number
}

export const FILAMENT_PRESETS: FilamentPreset[] = [
  { name: 'PLA estándar',          pricePerKg: 20,  wasteFactor: 1.05 },
  { name: 'PLA+',                  pricePerKg: 25,  wasteFactor: 1.05 },
  { name: 'PETG',                  pricePerKg: 25,  wasteFactor: 1.08 },
  { name: 'ABS',                   pricePerKg: 22,  wasteFactor: 1.10 },
  { name: 'ASA',                   pricePerKg: 30,  wasteFactor: 1.10 },
  { name: 'TPU 95A',               pricePerKg: 35,  wasteFactor: 1.08 },
  { name: 'Nylon (PA12)',          pricePerKg: 45,  wasteFactor: 1.12 },
  { name: 'PC (Policarbonato)',    pricePerKg: 50,  wasteFactor: 1.15 },
  { name: 'PLA Madera',            pricePerKg: 30,  wasteFactor: 1.08 },
  { name: 'PLA-CF (fibra carbono)',pricePerKg: 60,  wasteFactor: 1.06 },
  { name: 'Resina estándar',       pricePerKg: 40,  wasteFactor: 1.15 },
  { name: 'Resina ABS-like',       pricePerKg: 45,  wasteFactor: 1.15 },
  { name: 'Resina flexible',       pricePerKg: 50,  wasteFactor: 1.20 },
]
