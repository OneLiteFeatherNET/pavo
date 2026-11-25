import { existsSync, readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// A typo in the exports map only shows up for consumers after publishing. Every export that points into the built
// runtime must have its source file, so the map is checked against src/runtime here.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8')) as { exports: Record<string, unknown> }

function targetsOf(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (value && typeof value === 'object') return Object.values(value).flatMap(targetsOf)
  return []
}

function runtimeTargets(): string[] {
  const all = Object.values(pkg.exports).flatMap(targetsOf)
  return [...new Set(all)].filter(target => target.startsWith('./dist/runtime/'))
}

// dist/runtime/x.js and dist/runtime/x.d.ts map to src/runtime/x.ts, dist/runtime/x.css to src/runtime/x.css.
function sourceOf(target: string): string {
  const rel = target.slice('./dist/'.length)
  if (rel.endsWith('.css')) return resolve(ROOT, 'src', rel)
  const stem = rel.replace(/\.d\.ts$/, '').replace(/\.js$/, '')
  return resolve(ROOT, 'src', `${stem}.ts`)
}

describe('package exports map', () => {
  const targets = runtimeTargets()

  it('points at least one export into dist/runtime', () => {
    expect(targets.length, 'no ./dist/runtime/... export found in package.json').toBeGreaterThan(0)
  })

  it.each(targets)('%s has a matching source file under src/runtime', (target) => {
    const source = sourceOf(target)
    expect(existsSync(source), `missing source ${relative(ROOT, source)} for export target ${target}`).toBe(true)
  })
})
