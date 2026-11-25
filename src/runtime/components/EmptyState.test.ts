// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3EmptyState from './EmptyState.vue'

describe('M3EmptyState', () => {
  it('is a status region carrying its title', () => {
    const w = mount(M3EmptyState, { props: { title: 'Nothing here yet' } })
    expect(w.attributes('role')).toBe('status')
    expect(w.text()).toContain('Nothing here yet')
    w.unmount()
  })

  it('renders the description slot when given', () => {
    const w = mount(M3EmptyState, { props: { title: 'Empty' }, slots: { default: 'Add the first item' } })
    expect(w.text()).toContain('Add the first item')
    w.unmount()
  })
})
