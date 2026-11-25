// Guards the published package after `pnpm prepack`: the built module must not point at .ts locale sources,
// and the built locale files must ship in dist/runtime/locales. Run with `pnpm check:dist`.
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../dist/', import.meta.url))
const MODULE = `${ROOT}module.mjs`
const LOCALES = `${ROOT}runtime/locales`
const REQUIRED = ['de.js', 'en.js']
const FORBIDDEN = ['de.ts', 'en.ts']

const problems = []

if (!existsSync(MODULE)) {
  problems.push(`missing ${MODULE} (run pnpm prepack first)`)
} else {
  const source = readFileSync(MODULE, 'utf8')
  for (const name of FORBIDDEN) {
    if (source.includes(name)) problems.push(`dist/module.mjs references "${name}", which the package does not ship`)
  }
}

for (const name of REQUIRED) {
  if (!existsSync(`${LOCALES}/${name}`)) problems.push(`missing dist/runtime/locales/${name}`)
}

if (problems.length > 0) {
  console.error('check:dist failed: the published package would break in apps that use @nuxtjs/i18n.')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log('check:dist ok: dist/module.mjs has no .ts locale references and dist/runtime/locales has de.js and en.js')
