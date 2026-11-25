// @vitest-environment happy-dom
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import M3ConfirmDialog from './ConfirmDialog.vue'

const mounted: VueWrapper[] = []

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount()
})

function open(props: Record<string, unknown> = {}): VueWrapper {
  const w = mount(M3ConfirmDialog, {
    props: { modelValue: true, title: 'Stop the server?', message: 'Players are disconnected.', ...props },
    attachTo: document.body,
  })
  mounted.push(w)
  return w
}

function buttonNamed(w: VueWrapper, text: string) {
  const button = w.findAll('button').find(b => b.text() === text)
  if (!button) throw new Error(`no button named "${text}"`)
  return button
}

describe('M3ConfirmDialog', () => {
  it('emits confirm and closes when confirmed', async () => {
    const w = open()
    await buttonNamed(w, 'Bestätigen').trigger('click')
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('closes without confirming when cancelled', async () => {
    const w = open()
    await buttonNamed(w, 'Abbrechen').trigger('click')
    expect(w.emitted('confirm')).toBeUndefined()
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('uses the built-in German labels by default', () => {
    const w = open()
    expect(w.findAll('button').map(b => b.text())).toEqual(['Abbrechen', 'Bestätigen'])
  })

  it('uses the given labels when they are set', () => {
    const w = open({ confirmLabel: 'Stop', cancelLabel: 'Keep running' })
    expect(w.findAll('button').map(b => b.text())).toEqual(['Keep running', 'Stop'])
  })

  it('announces a danger confirmation as an alert dialog', () => {
    const w = open({ danger: true })
    expect(w.get('dialog').attributes('role')).toBe('alertdialog')
  })

  it('colours the confirm button as error for a danger action', () => {
    const w = open({ danger: true })
    expect(buttonNamed(w, 'Bestätigen').classes()).toContain('bg-error')
  })
})
