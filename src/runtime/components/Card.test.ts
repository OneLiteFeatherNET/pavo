// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Card from './Card.vue'

describe('M3Card', () => {
  it('renders a section with its title as heading', () => {
    const w = mount(M3Card, { props: { title: 'Members' }, slots: { default: '<p>12 online</p>' } })
    expect(w.element.tagName).toBe('SECTION')
    expect(w.get('h2').text()).toBe('Members')
    expect(w.text()).toContain('12 online')
    w.unmount()
  })

  it('becomes an anchor when href is given', () => {
    const w = mount(M3Card, { props: { href: '/members' }, slots: { default: 'Open' } })
    expect(w.element.tagName).toBe('A')
    expect(w.attributes('href')).toBe('/members')
    w.unmount()
  })
})
