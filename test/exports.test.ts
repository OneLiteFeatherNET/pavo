import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const COMPONENTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/runtime/components')
const INDEX = resolve(dirname(fileURLToPath(import.meta.url)), '../src/runtime/index.ts')

function componentNames(): string[] {
  if (!existsSync(COMPONENTS_DIR)) return []
  return readdirSync(COMPONENTS_DIR)
    .filter(name => name.endsWith('.vue'))
    .map(name => name.slice(0, -'.vue'.length))
}

describe('plain-Vue entry exports', () => {
  const index = readFileSync(INDEX, 'utf8')

  it.each(componentNames())('exports %s as M3%s', (name) => {
    expect(index, `missing: export { default as M3${name} } from './components/${name}.vue'`)
      .toContain(`export { default as M3${name} } from './components/${name}.vue'`)
  })

  it('exports every component file (no component is left out)', () => {
    const exported = [...index.matchAll(/default as M3([A-Za-z0-9]+) \} from '\.\/components\//g)].map(m => m[1])
    expect(exported.sort()).toEqual(componentNames().sort())
  })
})
