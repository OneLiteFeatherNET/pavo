import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { parseTheme, resolveTheme, THEME_KEY, type ThemeName } from '../lib/theme'

export interface ColorTheme {
  theme: Ref<ThemeName>
  isDark: ComputedRef<boolean>
  /** Switches to the other theme and remembers the choice. */
  toggle: () => void
  /** Sets the theme and remembers the choice. */
  set: (next: ThemeName) => void
  /** Applies an earlier explicit choice, or follows the system preference. Call once in onMounted. */
  restore: () => void
}

// App-wide state, module scope: only the client mutates it (toggle, set, restore), so server requests never share it.
const theme = ref<ThemeName>('light')
const isDark = computed(() => theme.value === 'dark')

function readStored(): string | null {
  try {
    return localStorage.getItem(THEME_KEY)
  }
  catch {
    return null
  }
}

function writeStored(value: ThemeName): void {
  try {
    localStorage.setItem(THEME_KEY, value)
  }
  catch {
    // Storage unavailable: the choice applies for this page view only.
  }
}

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function apply(next: ThemeName): void {
  theme.value = next
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = next
}

/**
 * Light and dark theme. Without an explicit choice the CSS follows the system preference (tokens.css); the choice
 * is written to the html element as data-theme and to localStorage under `pavo.theme`.
 */
export function useColorTheme(): ColorTheme {
  function set(next: ThemeName): void {
    apply(next)
    writeStored(next)
  }
  function toggle(): void {
    set(isDark.value ? 'light' : 'dark')
  }
  function restore(): void {
    const choice = parseTheme(readStored())
    if (choice) apply(choice)
    else theme.value = resolveTheme(null, systemPrefersDark())
  }
  return { theme, isDark, toggle, set, restore }
}
