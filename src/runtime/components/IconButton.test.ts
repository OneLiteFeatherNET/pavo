// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3IconButton from './IconButton.vue'

describe('M3IconButton', () => {
  it('names the button by its label', () => {
    const w = mount(M3IconButton, { props: { icon: 'mdi-close', label: 'Close dialog' } })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.attributes('aria-label')).toBe('Close dialog')
    w.unmount()
  })

  it('exposes the pressed state when pressed is given', () => {
    const w = mount(M3IconButton, { props: { icon: 'mdi-menu', label: 'Menu', pressed: true } })
    expect(w.attributes('aria-pressed')).toBe('true')
    w.unmount()
  })
})
