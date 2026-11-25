// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Alert from './Alert.vue'

describe('M3Alert', () => {
  it('announces an error as an alert', () => {
    const w = mount(M3Alert, { props: { tone: 'error' }, slots: { default: 'Save failed' } })
    expect(w.attributes('role')).toBe('alert')
    w.unmount()
  })

  it('announces a success as a status message', () => {
    const w = mount(M3Alert, { props: { tone: 'success' }, slots: { default: 'Saved' } })
    expect(w.attributes('role')).toBe('status')
    w.unmount()
  })

  it('announces a warning as a status message', () => {
    const w = mount(M3Alert, { props: { tone: 'warning' }, slots: { default: 'Quota almost full' } })
    expect(w.attributes('role')).toBe('status')
    w.unmount()
  })

  it('lets an explicit role override the tone default', () => {
    const w = mount(M3Alert, { props: { tone: 'error', role: 'status' }, slots: { default: 'Retrying' } })
    expect(w.attributes('role')).toBe('status')
    w.unmount()
  })
})
