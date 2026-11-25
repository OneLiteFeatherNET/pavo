// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Checkbox from './Checkbox.vue'

describe('M3Checkbox', () => {
  it('emits true when the box is checked', async () => {
    const w = mount(M3Checkbox, { props: { modelValue: false } })
    await w.get('input').setValue(true)
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits false when the box is unchecked', async () => {
    const w = mount(M3Checkbox, { props: { modelValue: true } })
    await w.get('input').setValue(false)
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('names the control with the aria-label prop', () => {
    const w = mount(M3Checkbox, { props: { modelValue: false, ariaLabel: 'Accept terms' } })
    expect(w.get('input').attributes('aria-label')).toBe('Accept terms')
  })

  it('disables the control', () => {
    const w = mount(M3Checkbox, { props: { modelValue: false, disabled: true } })
    expect(w.get('input').attributes('disabled')).toBeDefined()
  })
})
