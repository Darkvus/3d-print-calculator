<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=26&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=680&lines=3D+Print+Cost+Calculator;Calcula+el+costo+real+de+tus+impresiones;Multi-filamento+%7C+Multicolor;100%25+frontend+%E2%80%94+sin+backend" alt="typing animation" />

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<p>
  Calculadora de costos de impresión 3D — 100 % frontend, sin backend ni cuenta.<br/>
  Soporta múltiples filamentos (multicolor), persiste datos en localStorage y es totalmente responsive.
</p>

</div>

---

## 🛠️ Tech Stack

<div align="center">

[![Tech Stack](https://skillicons.dev/icons?i=react,ts,vite,tailwind&theme=dark)](https://skillicons.dev)

</div>

<div align="center">

![Zustand](https://img.shields.io/badge/Zustand-State-FF6B35?style=flat-square)
![Lucide](https://img.shields.io/badge/Lucide-Icons-F97316?style=flat-square)
![localStorage](https://img.shields.io/badge/localStorage-Persistence-10B981?style=flat-square)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🎨 Multi-filamento**
Añade tantos filamentos como quieras para impresiones multicolor. Cada uno con nombre, peso, precio y factor de desperdicio.

</td>
<td width="50%">

**💾 Persistencia automática**
Todos los datos se guardan en `localStorage`. Al recargar la página todo sigue ahí.

</td>
</tr>
<tr>
<td>

**⚡ Electricidad flexible**
Ingresa el tiempo de impresión en **horas o minutos** con un toggle responsive.

</td>
<td>

**💱 Multi-moneda**
Selector de moneda en la navbar (USD, EUR, MXN, COP, ARS, BRL).

</td>
</tr>
<tr>
<td>

**🧮 Desglose completo**
Material · Electricidad · Máquina · Buffer de riesgo · Margen de ganancia → Precio final.

</td>
<td>

**📱 Responsive**
Diseño adaptado para mobile, tablet y desktop.

</td>
</tr>
</table>

---

## 🚀 Despliegue local

### Requisitos

- [Node.js](https://nodejs.org) 18+
- npm 9+ (incluido con Node.js)

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/Darkvus/3d-print-calculator.git
cd 3d-print-calculator

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción localmente |

---

## ☁️ Despliegue en Vercel

### Opción 1 — CLI (recomendado para la primera vez)

```bash
# Instala la CLI de Vercel globalmente
npm i -g vercel

# Despliega (te guiará paso a paso)
vercel

# Despliegue a producción
vercel --prod
```

### Opción 2 — GitHub + Vercel (despliegue continuo)

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) → **Add New Project**
3. Importa el repositorio — Vercel detecta Vite automáticamente
4. Cada `git push` a `main` despliega una nueva versión

> [!NOTE]
> No se requieren variables de entorno. La app es 100 % frontend.

---

## 🧮 Cómo funciona el cálculo

```
Costo material   = Σ (peso_g / 1000 × precio_kg × factor_desperdicio)  por filamento
Costo eléctrico  = (watts / 1000) × horas × precio_kWh
Costo máquina    = (precio_impresora / vida_útil_h + mantenimiento_h) × horas

Subtotal         = material + electricidad + máquina
Buffer de riesgo = subtotal × (% riesgo / 100)
Ganancia         = (subtotal + buffer) × (% margen / 100)
Precio final     = subtotal + buffer + ganancia
```

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── calculator/
│   │   ├── MaterialSection.tsx    # Filamentos múltiples
│   │   ├── ElectricitySection.tsx # Tiempo en h o min
│   │   ├── MachineSection.tsx
│   │   ├── ProfitSection.tsx
│   │   └── ResultPanel.tsx        # Desglose y precio final
│   └── ui/
│       ├── Card.tsx
│       └── InputField.tsx
├── services/
│   ├── materialCostService.ts     # Cálculo por filamento
│   ├── electricityCostService.ts
│   ├── machineCostService.ts
│   └── printCostCalculator.ts     # Orquestador
├── store/
│   └── calculatorStore.ts         # Zustand + localStorage
├── types/
│   └── index.ts
└── App.tsx
```

---

## 📋 License

[MIT](LICENSE) © [darkvus](https://github.com/Darkvus)
