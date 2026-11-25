import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { usePavoText } from './usePavoText'

type Translate = (key: string, params?: Record<string, string | number>) => string

function translatorIn(global?: Record<string, unknown>): Translate {
  let t!: Translate
  mount(defineComponent({
    setup() {
      t = usePavoText()
      return () => h('div')
    },
  }), { global: global as never })
  return t
}

describe('usePavoText', () => {
  it('returns the German built-in text by default', () => {
    expect(translatorIn()('close')).toBe('Schließen')
  })

  it('accepts keys with the pavo prefix', () => {
    expect(translatorIn()('pavo.menu')).toBe('Menü')
  })

  it('interpolates named placeholders', () => {
    expect(translatorIn()('table.range', { from: 1, to: 10, total: 42 })).toBe('1–10 von 42')
  })

  it('leaves unknown placeholders in place', () => {
    expect(translatorIn()('table.range', { from: 1 })).toBe('1–{to} von {total}')
  })

  it('uses the English dictionary for the English locale of the app', () => {
    const t = translatorIn({
      config: {
        globalProperties: { $i18n: { te: () => false, locale: 'en' } },
      },
    })
    expect(t('close')).toBe('Close')
  })

  it('prefers the app translation when vue-i18n has the pavo key', () => {
    const t = translatorIn({
      config: {
        globalProperties: {
          $i18n: {
            te: (key: string) => key === 'pavo.close',
            t: (key: string) => `app:${key}`,
            locale: 'de',
          },
        },
      },
    })
    expect(t('close')).toBe('app:pavo.close')
  })

  it('falls back to the built-in text when vue-i18n lacks the key', () => {
    const t = translatorIn({
      config: {
        globalProperties: { $i18n: { te: () => false, locale: 'en' } },
      },
    })
    expect(t('noData')).toBe('Nothing here yet')
  })
})
