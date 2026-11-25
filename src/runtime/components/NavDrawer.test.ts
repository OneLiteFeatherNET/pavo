// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3NavDrawer from './NavDrawer.vue'
import type { NavEntry } from '../lib/types'

const items: NavEntry[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Players', to: '/players' },
  { label: 'Models', to: '/models' },
]

const drawer = (props: Record<string, unknown> = {}) =>
  mount(M3NavDrawer, { props: { items, activePath: '/', label: 'Main', ...props } })
const currentLabels = (w: ReturnType<typeof drawer>) => w.findAll('a[aria-current="page"]').map(a => a.text())

describe('M3NavDrawer', () => {
  it('marks the entry of the current path', () => {
    expect(currentLabels(drawer({ activePath: '/players' }))).toEqual(['Players'])
  })

  it('marks the entry for a nested route', () => {
    expect(currentLabels(drawer({ activePath: '/models/gbm/1.0' }))).toEqual(['Models'])
  })

  it('does not mark an entry whose path only shares a prefix', () => {
    expect(currentLabels(drawer({ activePath: '/playersX' }))).toEqual([])
  })

  it('marks the root entry only for the root path', () => {
    expect(currentLabels(drawer({ activePath: '/players' }))).not.toContain('Dashboard')
    expect(currentLabels(drawer({ activePath: '/' }))).toEqual(['Dashboard'])
  })

  it('names the navigation landmark with the label', () => {
    expect(drawer().get('nav').attributes('aria-label')).toBe('Main')
  })

  it('falls back to the built-in navigation name without a label', () => {
    expect(drawer({ label: '' }).get('nav').attributes('aria-label')).toBe('Navigation')
  })

  it('renders the standard variant without a dialog', () => {
    expect(drawer().find('dialog').exists()).toBe(false)
  })

  it('renders the modal variant as a dialog', () => {
    expect(drawer({ modal: true }).find('dialog').exists()).toBe(true)
  })

  it('opens the modal dialog when open is set', () => {
    expect(drawer({ modal: true, open: true }).get('dialog').element.open).toBe(true)
  })

  it('asks to close the modal on Escape', async () => {
    const w = drawer({ modal: true, open: true })
    await w.get('dialog').trigger('cancel')
    expect(w.emitted('update:open')).toEqual([[false]])
  })

  it('asks to close the modal on a click on the scrim', async () => {
    const w = drawer({ modal: true, open: true })
    await w.get('dialog').trigger('click')
    expect(w.emitted('update:open')).toEqual([[false]])
  })

  it('does not close the modal on a click inside the sheet', async () => {
    const w = drawer({ modal: true, open: true })
    await w.get('nav').trigger('click')
    expect(w.emitted('update:open')).toBeUndefined()
  })

  it('asks to close the modal from the close button', async () => {
    const w = drawer({ modal: true, open: true, closeLabel: 'Close' })
    await w.get('button[aria-label="Close"]').trigger('click')
    expect(w.emitted('update:open')).toEqual([[false]])
  })

  it('asks to close the modal when an entry is chosen', async () => {
    const w = drawer({ modal: true, open: true })
    await w.findAll('nav a')[1]!.trigger('click')
    expect(w.emitted('update:open')).toEqual([[false]])
  })
})
