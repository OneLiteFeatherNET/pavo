import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Vue renders an unknown component tag as nothing, and neither lint nor typecheck notices. This test compares every
// PascalCase tag in the playground templates with the components Nuxt registered (playground/.nuxt/components.d.ts,
// written by `nuxi prepare playground`, which `pnpm dev:prepare` runs).
const PLAYGROUND_APP = resolve(dirname(fileURLToPath(import.meta.url)), '../playground/app')
const COMPONENTS_D_TS = resolve(dirname(fileURLToPath(import.meta.url)), '../playground/.nuxt/components.d.ts')
const BUILT_IN = new Set(['NuxtLayout', 'NuxtPage', 'NuxtLink', 'ClientOnly', 'Teleport', 'Transition', 'TransitionGroup', 'KeepAlive'])

function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return vueFiles(path)
    return path.endsWith('.vue') ? [path] : []
  })
}

describe('playground component tags', () => {
  it('finds the generated component declarations (run pnpm dev:prepare when this fails)', () => {
    expect(existsSync(COMPONENTS_D_TS), 'playground/.nuxt/components.d.ts is missing: run pnpm dev:prepare').toBe(true)
  })

  it('only uses components that Nuxt registered', () => {
    const declared = readFileSync(COMPONENTS_D_TS, 'utf8')
    const known = new Set([...declared.matchAll(/^export const ([A-Za-z0-9]+)/gm)].map(m => m[1]!))
    const unknown = vueFiles(PLAYGROUND_APP).flatMap((file) => {
      const template = readFileSync(file, 'utf8').split('<script')[0] ?? ''
      return [...new Set([...template.matchAll(/<([A-Z][A-Za-z0-9]+)/g)].map(m => m[1]!))]
        .filter(tag => !known.has(tag) && !BUILT_IN.has(tag))
        .map(tag => `${file.slice(PLAYGROUND_APP.length + 1)}: <${tag}>`)
    })
    expect(unknown, 'unresolved component tags').toEqual([])
  })
})
