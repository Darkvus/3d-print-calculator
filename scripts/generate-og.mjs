import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const svg = readFileSync(resolve(__dirname, 'og-image.svg'))

await sharp(svg)
  .resize(1200, 630)
  .png({ quality: 95 })
  .toFile(resolve(__dirname, '../public/og-image.png'))

console.log('✓ og-image.png generado en public/')
