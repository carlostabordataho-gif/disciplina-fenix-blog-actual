#!/usr/bin/env node
// TABORDA SYSTEM — Health check de variables de entorno (pre-build).
//
// Se ejecuta automáticamente antes de `vite build` (hook "prebuild" de npm),
// tanto en local como en Vercel. Verifica las 4 variables críticas del
// sistema y lanza un aviso limpio en consola si falta alguna o si quedó
// con un valor placeholder del .env.example.
//
// Por diseño NO rompe el build (el sitio degrada con elegancia: sin
// Supabase el formulario avisa, sin checkout los CTA caen a WhatsApp).
// Para CI estricto: `node scripts/check-env.js --strict` => exit 1 si
// falta alguna variable marcada como requerida.

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const strict = process.argv.includes('--strict')

// ── Las 4 variables críticas ──────────────────────────────────────────
const VARS = [
  {
    name: 'VITE_SUPABASE_URL',
    required: true,
    why: 'Sin ella los leads NO se guardan en la tabla `leads` de Supabase.',
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    why: 'Sin ella el cliente de Supabase no se inicializa (captura caída).',
  },
  {
    name: 'VITE_LEAD_WEBHOOK_URL',
    required: false,
    why: 'Sin ella no se dispara la secuencia de emails en n8n (los leads solo quedan en Supabase).',
  },
  {
    name: 'VITE_COHORTE_CHECKOUT_URL',
    required: false,
    why: 'Sin ella los botones de compra abren WhatsApp (modo cierre 1:1) en vez de la pasarela.',
  },
]

// Valores de ejemplo del .env.example que NO cuentan como configuración real.
const PLACEHOLDER = /TU[-_]?(PROYECTO|INSTANCIA|LINK|ID)|REEMPLAZAR|^eyJ\.\.\.$/i

// ── Cargar .env local (en Vercel las vars ya vienen en process.env) ───
function parseDotEnv(file) {
  const out = {}
  if (!existsSync(file)) return out
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m || line.trim().startsWith('#')) continue
    out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

const dotEnv = parseDotEnv(resolve(root, '.env'))
// Misma prioridad que Vite: process.env gana sobre el archivo .env.
const valueOf = (name) => process.env[name] ?? dotEnv[name] ?? ''

// ── Verificación ──────────────────────────────────────────────────────
const line = '─'.repeat(64)
console.log(`\n${line}`)
console.log('  TABORDA SYSTEM :: health check de entorno (pre-build)')
console.log(line)

let missingRequired = 0
let warnings = 0

for (const v of VARS) {
  const raw = valueOf(v.name).trim()
  let status
  if (!raw) {
    status = v.required ? 'FALTA' : 'NO CONFIGURADA'
  } else if (PLACEHOLDER.test(raw)) {
    status = 'PLACEHOLDER'
  } else {
    status = 'OK'
  }

  if (status === 'OK') {
    console.log(`  [OK]    ${v.name}`)
  } else {
    warnings++
    if (v.required) missingRequired++
    const tag = v.required ? 'AVISO!' : 'aviso '
    console.log(`  [${tag}] ${v.name} → ${status}`)
    console.log(`          ${v.why}`)
  }
}

console.log(line)
if (warnings === 0) {
  console.log('  ✓ Entorno completo. Las 4 variables críticas están definidas.')
} else {
  console.log(`  ⚠ ${warnings} variable(s) sin configurar. El build continúa,`)
  console.log('    pero revisa Vercel → Settings → Environment Variables')
  console.log('    y haz Redeploy. Detalle: docs/OPERACIONES.md')
}
console.log(`${line}\n`)

if (strict && missingRequired > 0) {
  console.error(`check-env: ${missingRequired} variable(s) requerida(s) ausente(s) (modo --strict).`)
  process.exit(1)
}
