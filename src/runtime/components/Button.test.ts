// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Button from './Button.vue'

describe('M3Button', () => {
  it('renders a button of type button by default', () => {
    const w = mount(M3Button, { slots: { default: 'Save' } })
    expect(w.element.tagName).toBe('BUTTON')
    expect(w.attributes('type')).toBe('button')
    w.unmount()
  })

  it('renders an anchor with href when href is given', () => {
    const w = mount(M3Button, { props: { href: 'https://example.org/docs' }, slots: { default: 'Docs' } })
    expect(w.element.tagName).toBe('A')
    expect(w.attributes('href')).toBe('https://example.org/docs')
    w.unmount()
  })

  it('renders an anchor with the string to as href when no router is present', () => {
    const w = mount(M3Button, { props: { to: '/settings' }, slots: { default: 'Settings' } })
    expect(w.element.tagName).toBe('A')
    expect(w.attributes('href')).toBe('/settings')
    w.unmount()
  })

  it('marks a loading button as busy and disabled', () => {
    const w = mount(M3Button, { props: { loading: true }, slots: { default: 'Save' } })
    expect(w.attributes('aria-busy')).toBe('true')
    expect((w.element as HTMLButtonElement).disabled).toBe(true)
    w.unmount()
  })

  it('shows a progress indicator named by loadingLabel while loading', () => {
    const w = mount(M3Button, { props: { loading: true, loadingLabel: 'Saving' }, slots: { default: 'Save' } })
    expect(w.get('[role="progressbar"]').attributes('aria-label')).toBe('Saving')
    w.unmount()
  })

  it('marks a disabled link with aria-disabled instead of the disabled attribute', () => {
    const w = mount(M3Button, { props: { href: '/x', disabled: true }, slots: { default: 'X' } })
    expect(w.attributes('aria-disabled')).toBe('true')
    expect(w.attributes('disabled')).toBeUndefined()
    w.unmount()
  })
})
