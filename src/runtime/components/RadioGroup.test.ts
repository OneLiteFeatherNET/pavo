// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3RadioGroup from './RadioGroup.vue'

const options = [
  { value: 'sm', label: 'Small' },
  { value: 'lg', label: 'Large' },
]

describe('M3RadioGroup', () => {
  it('groups the options in a fieldset with the legend', () => {
    const w = mount(M3RadioGroup, { props: { modelValue: 'sm', legend: 'Size', options } })
    expect(w.get('fieldset').get('legend').text()).toBe('Size')
  })

  it('checks the radio of the model value', () => {
    const w = mount(M3RadioGroup, { props: { modelValue: 'lg', legend: 'Size', options } })
    const radios = w.findAll('input[type="radio"]')
    expect(radios.map(r => (r.element as HTMLInputElement).checked)).toEqual([false, true])
  })

  it('emits the value of the chosen option', async () => {
    const w = mount(M3RadioGroup, { props: { modelValue: 'sm', legend: 'Size', options } })
    await w.findAll('input[type="radio"]')[1]!.setValue(true)
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['lg'])
  })

  it('puts all radios of one group under the same name', () => {
    const w = mount(M3RadioGroup, { props: { modelValue: 'sm', legend: 'Size', options } })
    const names = new Set(w.findAll('input[type="radio"]').map(r => r.attributes('name')))
    expect(names.size).toBe(1)
  })
})
