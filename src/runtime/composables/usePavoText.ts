import { getCurrentInstance, unref, type MaybeRef } from 'vue'
import { PAVO_TEXTS } from '../texts'

type Params = Record<string, string | number>
type Dictionary = Record<string, string>

// Nested texts ({ pavo: { close: "..." } }) flattened to dotted keys without the "pavo." prefix.
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
  de: flatten(PAVO_TEXTS.de.pavo),
  en: flatten(PAVO_TEXTS.en.pavo),
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match))
}

interface VueI18nLike {
  t?: (key: string, params?: Params) => string
  locale?: MaybeRef<string>
}

/**
 * Translator for Pavo's built-in texts. Keys are written without the `pavo.` prefix (`t('close')`). Lookup order:
 * the app's vue-i18n translation of `pavo.*` when it returns a real text, then the built-in dictionary for the
 * current locale, then German, then the key itself. `te` is not used: it reports false for precompiled messages.
 * Call it during setup; outside a component only the built-in dictionary is used.
 */
export function usePavoText(): (key: string, params?: Params) => string {
  // Captured during setup, so the translator also works in render functions and event handlers.
  const instance = getCurrentInstance()
  return (key: string, params?: Params): string => {
    const short = key.startsWith('pavo.') ? key.slice(5) : key
    const i18n = instance?.appContext.config.globalProperties.$i18n as VueI18nLike | undefined
    if (i18n && typeof i18n.t === 'function') {
      const translated = i18n.t(`pavo.${short}`, params)
      if (typeof translated === 'string' && translated !== '' && translated !== `pavo.${short}`) return translated
    }
    const locale = i18n?.locale !== undefined ? unref(i18n.locale) : 'de'
    const dictionary = DICTIONARIES[locale] ?? DICTIONARIES.de!
    const template = dictionary[short] ?? DICTIONARIES.de![short] ?? short
    return interpolate(template, params)
  }
}
