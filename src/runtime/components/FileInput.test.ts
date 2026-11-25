// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3FileInput from './FileInput.vue'

describe('M3FileInput', () => {
  it('emits the chosen file', async () => {
    const w = mount(M3FileInput, { props: { label: 'Choose file' } })
    const file = new File(['abc'], 'data.csv', { type: 'text/csv' })
    const input = w.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')
    expect(w.emitted('change')?.[0]).toEqual([file])
  })

  it('emits null when no file is chosen', async () => {
    const w = mount(M3FileInput, { props: { label: 'Choose file' } })
    const input = w.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [] })
    await input.trigger('change')
    expect(w.emitted('change')?.[0]).toEqual([null])
  })

  it('labels the file input with the label text', () => {
    const w = mount(M3FileInput, { props: { label: 'Choose file' } })
    expect(w.get('label').text()).toBe('Choose file')
    expect(w.get('label').attributes('for')).toBe(w.get('input').attributes('id'))
  })

  it('shows the name of the chosen file', async () => {
    const w = mount(M3FileInput, { props: { label: 'Choose file' } })
    const input = w.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [new File(['x'], 'map.png')] })
    await input.trigger('change')
    expect(w.text()).toContain('map.png')
  })
})
