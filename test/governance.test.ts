import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Components style themselves with the semantic roles only (bg-primary, text-on-surface). Raw Tailwind palette
// classes and literal colours would bypass the theme, so they are rejected here.
const COMPONENTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/runtime/components')
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const PALETTE = 'red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|black|white'
const RAW_PALETTE_CLASS = new RegExp(
  `(?<![\\w-])(?:bg|text|border|ring|fill|stroke|outline|from|to|via|divide|shadow|accent|caret|decoration|placeholder)-(?:${PALETTE})(?:-\\d{2,3})?(?:/\\d+)?(?![\\w-])`,
  'g',
)
const HEX_COLOUR = /(?<![\w&#])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![\w-])/g

function vueFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return vueFiles(path)
    return path.endsWith('.vue') ? [path] : []
  })
}

function violations(pattern: RegExp, files: string[]): string[] {
  return files.flatMap((file) => {
    const source = readFileSync(file, 'utf8')
    return [...source.matchAll(pattern)].map(m => `${relative(ROOT, file)}: ${m[0]}`)
  })
}

describe('component governance', () => {
  const files = vueFiles(COMPONENTS_DIR)

  it('uses no raw Tailwind palette classes', () => {
    expect(violations(RAW_PALETTE_CLASS, files), 'raw palette classes').toEqual([])
  })

  it('uses no literal hex colours', () => {
    expect(violations(HEX_COLOUR, files), 'hex colours').toEqual([])
  })
})
