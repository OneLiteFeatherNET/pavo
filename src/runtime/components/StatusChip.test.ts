// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { iconPath } from '../lib/icons'
import type { Tone } from '../lib/types'
import M3StatusChip from './StatusChip.vue'

describe('M3StatusChip', () => {
  it.each<[Tone, string]>([
    ['success', 'mdi-check-circle-outline'],
    ['warning', 'mdi-alert-outline'],
    ['error', 'mdi-alert-circle-outline'],
    ['info', 'mdi-information-outline'],
  ])('shows the default icon of the %s tone', (tone, icon) => {
    const w = mount(M3StatusChip, { props: { tone, label: 'Status' } })
    expect(w.get('path').attributes('d')).toBe(iconPath(icon))
    w.unmount()
  })

  it('shows no icon for the neutral tone', () => {
    const w = mount(M3StatusChip, { props: { tone: 'neutral', label: 'Idle' } })
    expect(w.find('svg').exists()).toBe(false)
    w.unmount()
  })

  it('an explicit icon replaces the default icon of the tone', () => {
    const w = mount(M3StatusChip, { props: { tone: 'error', label: 'Failed', icon: 'mdi-check' } })
    expect(w.get('path').attributes('d')).toBe(iconPath('mdi-check'))
    w.unmount()
  })

  it('renders the label as text', () => {
    const w = mount(M3StatusChip, { props: { tone: 'primary', label: 'Running' } })
    expect(w.text()).toBe('Running')
    w.unmount()
  })
})
