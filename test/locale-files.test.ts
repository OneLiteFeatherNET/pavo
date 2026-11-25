import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { localeFile } from '../src/locale-files'

describe('localeFile', () => {
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'pavo-locale-'))
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('picks the .js file when only the built .js exists (published layout)', () => {
    writeFileSync(join(dir, 'de.js'), '')

    expect(localeFile(dir, 'de')).toBe('de.js')
  })

  it('picks the .ts file when the .ts source exists (source layout)', () => {
    writeFileSync(join(dir, 'en.ts'), '')

    expect(localeFile(dir, 'en')).toBe('en.ts')
  })

  it('throws naming the directory and the locale code when neither file exists', () => {
    expect(() => localeFile(dir, 'fr')).toThrowError(new RegExp(`${dir}.*"fr"|"fr".*${dir}`))
  })
})
