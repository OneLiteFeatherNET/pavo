// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Chip from './Chip.vue'

describe('M3Chip', () => {
  it('names the remove button by removeLabel', () => {
    const w = mount(M3Chip, { props: { removable: true, removeLabel: 'Remove tag rust' }, slots: { default: 'rust' } })
    expect(w.get('button').attributes('aria-label')).toBe('Remove tag rust')
    w.unmount()
  })

  it('names the remove button by the built-in German remove text when removeLabel is empty', () => {
    const w = mount(M3Chip, { props: { removable: true }, slots: { default: 'rust' } })
    expect(w.get('button').attributes('aria-label')).toBe('Entfernen')
    w.unmount()
  })

  it('renders the secondary tone with the secondary container colours', () => {
    const w = mount(M3Chip, { props: { tone: 'secondary' }, slots: { default: 'rust' } })
    expect(w.classes()).toContain('bg-secondary-container')
    expect(w.classes()).toContain('text-on-secondary-container')
    w.unmount()
  })

  it('emits remove when the remove button is clicked', async () => {
    const w = mount(M3Chip, { props: { removable: true, removeLabel: 'Remove' }, slots: { default: 'rust' } })
    await w.get('button').trigger('click')
    expect(w.emitted('remove')).toHaveLength(1)
    w.unmount()
  })

  it('renders no remove button when not removable', () => {
    const w = mount(M3Chip, { slots: { default: 'rust' } })
    expect(w.find('button').exists()).toBe(false)
    w.unmount()
  })
})
