// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { iconPath } from '../lib/icons'
import M3Icon from './Icon.vue'

describe('M3Icon', () => {
  it('is hidden from assistive technology without a label', () => {
    const w = mount(M3Icon, { props: { name: 'mdi-close' } })
    expect(w.attributes('aria-hidden')).toBe('true')
    expect(w.attributes('role')).toBeUndefined()
    w.unmount()
  })

  it('is an image named by its label', () => {
    const w = mount(M3Icon, { props: { name: 'mdi-close', label: 'Close' } })
    expect(w.attributes('role')).toBe('img')
    expect(w.attributes('aria-label')).toBe('Close')
    expect(w.attributes('aria-hidden')).toBeUndefined()
    w.unmount()
  })

  it('draws the registered path of a known name', () => {
    const w = mount(M3Icon, { props: { name: 'mdi-close' } })
    expect(w.get('path').attributes('d')).toBe(iconPath('mdi-close'))
    w.unmount()
  })

  it('renders an empty path for an unknown name', () => {
    const w = mount(M3Icon, { props: { name: 'mdi-does-not-exist' } })
    expect(w.get('path').attributes('d')).toBe('')
    w.unmount()
  })
})
