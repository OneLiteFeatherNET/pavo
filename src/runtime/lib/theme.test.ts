import { describe, expect, it } from 'vitest'
import { parseTheme, resolveTheme, THEME_KEY } from './theme'

describe('theme', () => {
  it('stores the choice under the pavo key', () => {
    expect(THEME_KEY).toBe('pavo.theme')
  })

  it('prefers the stored choice over the system preference', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('follows the system preference without a choice', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(undefined, false)).toBe('light')
  })

  it('ignores unknown stored values', () => {
    expect(parseTheme('purple')).toBeNull()
    expect(resolveTheme('purple', true)).toBe('dark')
  })
})
