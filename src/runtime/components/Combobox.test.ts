// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Combobox from './Combobox.vue'

describe('M3Combobox', () => {
  it('associates the label with the text input', () => {
    const w = mount(M3Combobox, { props: { modelValue: [], label: 'Tags' } })
    expect(w.get('label').attributes('for')).toBe(w.get('input').attributes('id'))
  })

  it('adds the typed text as a value on Enter', async () => {
    const w = mount(M3Combobox, { props: { modelValue: [], label: 'Tags' } })
    await w.get('input').setValue('berlin')
    await w.get('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')?.[0]).toEqual([['berlin']])
  })

  it('does not add a value that is already present', async () => {
    const w = mount(M3Combobox, { props: { modelValue: ['berlin'], label: 'Tags' } })
    await w.get('input').setValue('berlin')
    await w.get('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('removes a value with its chip remove button', async () => {
    const w = mount(M3Combobox, { props: { modelValue: ['berlin', 'paris'], label: 'Tags', removeLabel: 'Remove' } })
    await w.get('button[aria-label="Remove paris"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([['berlin']])
  })

  it('gives each remove button an accessible name with the value', () => {
    const w = mount(M3Combobox, { props: { modelValue: ['berlin'], label: 'Tags', removeLabel: 'Remove' } })
    expect(w.get('button').attributes('aria-label')).toBe('Remove berlin')
  })
})
