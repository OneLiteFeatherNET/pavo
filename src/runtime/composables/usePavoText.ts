import { getCurrentInstance, unref, type MaybeRef } from 'vue'
import de from '../locales/de.json'
import en from '../locales/en.json'

type Params = Record<string, string | number>
type Dictionary = Record<string, string>

// Nested locale files ({ "pavo": { "close": "..." } }) flattened to dotted keys without the "pavo." prefix.
function flatten(tree: Record<string, unknown>, prefix = ''): Dictionary {
  const out: Dictionary = {}
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') out[path] = value
    else if (typeof value === 'object' && value !== null) Object.assign(out, flatten(value as Record<string, unknown>, path))
  }
  return out
}

const DICTIONARIES: Record<string, Dictionary> = {
  de: flatten((de as { pavo: Record<string, unknown> }).pavo),
  en: flatten((en as { pavo: Record<string, unknown> }).pavo),
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match))
}

interface VueI18nLike {
  te?: (key: string) => boolean
  t?: (key: string, params?: Params) => string
  locale?: MaybeRef<string>
}

/**
 * Translator for Pavo's built-in texts. Keys are written without the `pavo.` prefix (`t('close')`). Lookup order:
 * the app's vue-i18n when it has the `pavo.*` key, then the built-in dictionary for the current locale, then German.
 * Call it during setup; outside a component only the built-in dictionary is used.
 */
export function usePavoText(): (key: string, params?: Params) => string {
  // Captured during setup, so the translator also works in render functions and event handlers.
  const instance = getCurrentInstance()
  return (key: string, params?: Params): string => {
    const short = key.startsWith('pavo.') ? key.slice(5) : key
    const i18n = instance?.appContext.config.globalProperties.$i18n as VueI18nLike | undefined
    if (i18n && typeof i18n.te === 'function' && typeof i18n.t === 'function' && i18n.te(`pavo.${short}`)) {
      return i18n.t(`pavo.${short}`, params)
    }
    const locale = i18n?.locale !== undefined ? unref(i18n.locale) : 'de'
    const dictionary = DICTIONARIES[locale] ?? DICTIONARIES.de!
    const template = dictionary[short] ?? DICTIONARIES.de![short] ?? short
    return interpolate(template, params)
  }
}
