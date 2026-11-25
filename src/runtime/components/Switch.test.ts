// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Switch from './Switch.vue'

describe('M3Switch', () => {
  it('renders a control with role switch', () => {
    const w = mount(M3Switch, { props: { modelValue: false } })
    expect(w.get('button').attributes('role')).toBe('switch')
  })

  it('reports aria-checked false when off', () => {
    const w = mount(M3Switch, { props: { modelValue: false } })
    expect(w.get('[role="switch"]').attributes('aria-checked')).toBe('false')
  })

  it('reports aria-checked true when on', () => {
    const w = mount(M3Switch, { props: { modelValue: true } })
    expect(w.get('[role="switch"]').attributes('aria-checked')).toBe('true')
  })

  it('emits the inverted value on click', async () => {
    const w = mount(M3Switch, { props: { modelValue: false } })
    await w.get('[role="switch"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('does not emit when disabled', async () => {
    const w = mount(M3Switch, { props: { modelValue: false, disabled: true } })
    await w.get('[role="switch"]').trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })
})
