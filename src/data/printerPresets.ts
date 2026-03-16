export interface PrinterPreset {
  name: string
  printerPrice: number
  lifeHours: number
  maintenanceCostPerHour: number
  printerWatts: number
}

export const PRINTER_PRESETS: PrinterPreset[] = [
  { name: 'Otros / personalizado',     printerPrice: 0,    lifeHours: 5000,  maintenanceCostPerHour: 0,    printerWatts: 0   },
  { name: 'Bambu Lab X1 Carbon',        printerPrice: 1449, lifeHours: 10000, maintenanceCostPerHour: 0.08, printerWatts: 350 },
  { name: 'Bambu Lab P1S',              printerPrice: 699,  lifeHours: 8000,  maintenanceCostPerHour: 0.06, printerWatts: 280 },
  { name: 'Bambu Lab P1P',              printerPrice: 599,  lifeHours: 8000,  maintenanceCostPerHour: 0.05, printerWatts: 250 },
  { name: 'Bambu Lab A1 Mini',          printerPrice: 299,  lifeHours: 5000,  maintenanceCostPerHour: 0.04, printerWatts: 180 },
  { name: 'Creality Ender 3 V3',        printerPrice: 220,  lifeHours: 5000,  maintenanceCostPerHour: 0.04, printerWatts: 200 },
  { name: 'Creality Ender 3 Pro',       printerPrice: 150,  lifeHours: 5000,  maintenanceCostPerHour: 0.03, printerWatts: 200 },
  { name: 'Creality K1C',               printerPrice: 399,  lifeHours: 6000,  maintenanceCostPerHour: 0.05, printerWatts: 350 },
  { name: 'Prusa MK4',                  printerPrice: 1099, lifeHours: 15000, maintenanceCostPerHour: 0.05, printerWatts: 240 },
  { name: 'Prusa Mini+',                printerPrice: 429,  lifeHours: 10000, maintenanceCostPerHour: 0.04, printerWatts: 90  },
  { name: 'Voron 2.4 (350 mm)',         printerPrice: 900,  lifeHours: 12000, maintenanceCostPerHour: 0.07, printerWatts: 600 },
  { name: 'Anycubic Kobra 2 Pro',       printerPrice: 250,  lifeHours: 5000,  maintenanceCostPerHour: 0.04, printerWatts: 350 },
  { name: 'Elegoo Saturn 4 Ultra (resina)', printerPrice: 599, lifeHours: 4000, maintenanceCostPerHour: 0.10, printerWatts: 260 },
  { name: 'Elegoo Mars 4 (resina)',     printerPrice: 180,  lifeHours: 3000,  maintenanceCostPerHour: 0.08, printerWatts: 50  },
]
