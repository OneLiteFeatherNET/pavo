// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Select from './Select.vue'

describe('M3Select', () => {
  it('associates the label with the select', () => {
    const w = mount(M3Select, { props: { modelValue: 1, items: [1, 2], label: 'Count' } })
    expect(w.get('label').attributes('for')).toBe(w.get('select').attributes('id'))
  })

  it('emits the typed option value, not the string from the DOM', async () => {
    const w = mount(M3Select, { props: { modelValue: 1, items: [1, 2, 3], label: 'Count' } })
    await w.get('select').setValue('3')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('emits the value of an object item', async () => {
    const w = mount(M3Select, {
      props: { modelValue: 'a', items: [{ value: 'a', title: 'Alpha' }, { value: 'b', title: 'Beta' }], label: 'Letter' },
    })
    await w.get('select').setValue('b')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('marks an error on the select and links the message', () => {
    const w = mount(M3Select, { props: { modelValue: 1, items: [1], label: 'Count', error: 'Pick one' } })
    const select = w.get('select')
    expect(select.attributes('aria-invalid')).toBe('true')
    expect(w.get(`#${CSS.escape(select.attributes('aria-describedby')!)}`).text()).toBe('Pick one')
  })
})
