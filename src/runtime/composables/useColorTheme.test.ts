import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type ColorThemeModule = typeof import('./useColorTheme')

// Each test loads a fresh copy of the module, because the theme state is module scope.
async function freshTheme(): Promise<ColorThemeModule['useColorTheme']> {
  vi.resetModules()
  return (await import('./useColorTheme')).useColorTheme
}

function systemPrefers(dark: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: dark && query.includes('dark'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList)
}

describe('useColorTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    systemPrefers(false)
  })

  afterEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('toggle switches to the dark theme and remembers the choice', async () => {
    const { toggle, isDark } = (await freshTheme())()
    toggle()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('pavo.theme')).toBe('dark')
  })

  it('toggle back returns to the light theme', async () => {
    const { toggle, isDark } = (await freshTheme())()
    toggle()
    toggle()
    expect(isDark.value).toBe(false)
    expect(localStorage.getItem('pavo.theme')).toBe('light')
  })

  it('set applies the given theme and remembers it', async () => {
    const { set, theme } = (await freshTheme())()
    set('dark')
    expect(theme.value).toBe('dark')
    expect(localStorage.getItem('pavo.theme')).toBe('dark')
  })

  it('restore applies an earlier explicit choice', async () => {
    localStorage.setItem('pavo.theme', 'dark')
    const { restore, isDark } = (await freshTheme())()
    restore()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('restore follows the system preference without a choice and writes no data-theme', async () => {
    systemPrefers(true)
    const { restore, isDark } = (await freshTheme())()
    restore()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('still toggles when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    const { toggle, isDark } = (await freshTheme())()
    expect(() => toggle()).not.toThrow()
    expect(isDark.value).toBe(true)
  })
})
