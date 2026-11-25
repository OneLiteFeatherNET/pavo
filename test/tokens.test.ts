import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildTokensCss } from '../src/runtime/tokens/generate'

const TOKENS_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../src/runtime/css/tokens.css')
const css = buildTokensCss()

type Scheme = Record<string, string>

// Vars of one selector block, for example the explicit dark theme.
function varsOf(selector: string): Scheme {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`selector ${selector} not found`)
  const body = css.slice(start, css.indexOf('}', start))
  const vars: Scheme = {}
  for (const m of body.matchAll(/--md-sys-color-([a-z0-9-]+): (#[0-9a-f]{6});/g)) vars[m[1]!] = m[2]!
  return vars
}

const SCHEMES: Record<string, Scheme> = {
  light: varsOf(':root'),
  'dark (system)': varsOf(':root:not([data-theme="light"])'),
  'dark (explicit)': varsOf(':root[data-theme="dark"]'),
}

function luminance(hex: string): number {
  const channel = (offset: number): number => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}

describe('tokens stylesheet', () => {
  it('matches the committed file (run pnpm tokens after changing the generator)', () => {
    expect(readFileSync(TOKENS_PATH, 'utf8')).toBe(css)
  })

  it('uses the given seed in the header', () => {
    expect(buildTokensCss({ seed: '#ff6600' })).toContain('from seed #ff6600')
    expect(buildTokensCss({ seed: '#ff6600' })).not.toBe(css)
  })

  it.each(['primary', 'on-primary', 'primary-container', 'surface', 'surface-container-high', 'on-surface', 'outline-variant', 'error', 'inverse-surface', 'success', 'warning-container'])(
    'defines the %s role in light, system dark and explicit dark',
    (role) => {
      const matches = css.match(new RegExp(`--md-sys-color-${role}:`, 'g')) ?? []
      expect(matches.length).toBe(3)
    },
  )

  it('maps every role into the Tailwind theme', () => {
    expect(css).toContain('--color-primary-container: var(--md-sys-color-primary-container);')
  })

  it.each(Object.keys(SCHEMES))('keeps every on-role at least 4.5:1 on its role in the %s scheme', (scheme) => {
    const vars = SCHEMES[scheme]!
    const pairs = Object.keys(vars).filter(key => key.startsWith('on-') && vars[key.slice(3)] !== undefined)
    expect(pairs.length).toBeGreaterThan(0)
    const failing = pairs
      .map(on => ({ pair: `${on} on ${on.slice(3)}`, ratio: contrast(vars[on]!, vars[on.slice(3)]!) }))
      .filter(({ ratio }) => ratio < 4.5)
      .map(({ pair, ratio }) => `${pair}: ${ratio.toFixed(2)}`)
    expect(failing, 'pairs below WCAG AA 4.5:1').toEqual([])
  })
})
