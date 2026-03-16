import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = (f) => resolve(__dirname, '../public', f)

const svg = readFileSync(resolve(__dirname, '../public/printimator.svg'))

const sizes = [
  { file: 'icon-72.png',          size: 72  },
  { file: 'icon-96.png',          size: 96  },
  { file: 'icon-128.png',         size: 128 },
  { file: 'icon-144.png',         size: 144 },
  { file: 'icon-152.png',         size: 152 },
  { file: 'icon-192.png',         size: 192 },
  { file: 'icon-384.png',         size: 384 },
  { file: 'icon-512.png',         size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const { file, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(pub(file))
  console.log(`✓ ${file} (${size}x${size})`)
}

// Maskable: icon centrado al 80% sobre fondo sólido
const maskableSize = 512
const iconSize = Math.round(maskableSize * 0.8)
const offset = Math.round((maskableSize - iconSize) / 2)

const maskableSvg = `<svg width="${maskableSize}" height="${maskableSize}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${maskableSize}" height="${maskableSize}" fill="#0f172a"/>
  <image href="data:image/png;base64,${(await sharp(svg).resize(iconSize, iconSize).png().toBuffer()).toString('base64')}"
    x="${offset}" y="${offset}" width="${iconSize}" height="${iconSize}"/>
</svg>`

await sharp(Buffer.from(maskableSvg)).resize(maskableSize, maskableSize).png().toFile(pub('icon-512-maskable.png'))
console.log(`✓ icon-512-maskable.png (${maskableSize}x${maskableSize})`)
