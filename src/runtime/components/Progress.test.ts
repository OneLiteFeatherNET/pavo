// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Progress from './Progress.vue'

describe('M3Progress', () => {
  it('is a progressbar with aria-valuenow when determinate', () => {
    const w = mount(M3Progress, { props: { label: 'Upload', value: 40 } })
    expect(w.attributes('role')).toBe('progressbar')
    expect(w.attributes('aria-valuenow')).toBe('40')
    expect(w.attributes('aria-valuemin')).toBe('0')
    expect(w.attributes('aria-valuemax')).toBe('100')
    w.unmount()
  })

  it('has no aria-valuenow when indeterminate', () => {
    const w = mount(M3Progress, { props: { label: 'Upload' } })
    expect(w.attributes('role')).toBe('progressbar')
    expect(w.attributes('aria-valuenow')).toBeUndefined()
    w.unmount()
  })

  it('clamps a determinate value to 0 to 100', () => {
    const w = mount(M3Progress, { props: { label: 'Upload', value: 250 } })
    expect(w.attributes('aria-valuenow')).toBe('100')
    w.unmount()
  })

  it('is named by the built-in loading text when no label is given', () => {
    const w = mount(M3Progress)
    expect(w.attributes('aria-label')).toBe('Lädt')
    w.unmount()
  })
})
