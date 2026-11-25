// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3Snackbar from './Snackbar.vue'

describe('M3Snackbar', () => {
  it('is a polite status region', () => {
    const w = mount(M3Snackbar, { props: { message: 'Saved' } })
    expect(w.attributes('role')).toBe('status')
    expect(w.attributes('aria-live')).toBe('polite')
    w.unmount()
  })

  it('names the dismiss button by the built-in close text by default', () => {
    const w = mount(M3Snackbar, { props: { message: 'Saved' } })
    expect(w.get('button').text()).toBe('Schließen')
    w.unmount()
  })

  it('emits dismiss when the dismiss button is clicked', async () => {
    const w = mount(M3Snackbar, { props: { message: 'Saved', closeLabel: 'Dismiss' } })
    expect(w.get('button').text()).toBe('Dismiss')
    await w.get('button').trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
    w.unmount()
  })
})
