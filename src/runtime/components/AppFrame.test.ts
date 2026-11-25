// @vitest-environment happy-dom
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSnackbar } from '../composables/useSnackbar'
import type { NavEntry } from '../lib/types'
import M3AppFrame from './AppFrame.vue'

const ITEMS: NavEntry[] = [
  { label: 'Home', to: '/' },
  { label: 'Models', to: '/models' },
]

// The frame asks matchMedia for the desktop breakpoint and for the system colour scheme; only the first answer varies.
function stubViewport(desktop: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('min-width') ? desktop : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

const mounted: VueWrapper[] = []

function mountFrame(props: Record<string, unknown> = {}, slots: Record<string, string> = {}): VueWrapper {
  const wrapper = mount(M3AppFrame, {
    props: { items: ITEMS, activePath: '/', appName: 'Pavo', ...props },
    slots: { default: '<p>Page content</p>', ...slots },
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}

beforeEach(() => {
  // The theme is app-wide state: every test starts from an empty store and no data-theme.
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  stubViewport(false)
})

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount()
  useSnackbar().dismiss()
  vi.unstubAllGlobals()
})

describe('M3AppFrame', () => {
  it('skip link targets the main landmark', () => {
    const w = mountFrame()
    expect(w.get('a[href="#main"]').text()).toBe('Zum Inhalt springen')
    expect(w.get('main#main').attributes('tabindex')).toBe('-1')
  })

  it('renders the page content inside main', () => {
    const w = mountFrame()
    expect(w.get('main').text()).toContain('Page content')
  })

  it('shows the app name in the title by default', () => {
    const w = mountFrame()
    expect(w.get('header').text()).toContain('Pavo')
  })

  it('theme toggle writes the chosen theme to data-theme and back', async () => {
    const w = mountFrame()
    await flushPromises()
    await w.get('button[aria-label="Dunkles Design"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    await w.get('button[aria-label="Helles Design"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('shows no language button without showLanguage', () => {
    const w = mountFrame()
    expect(w.find('button[aria-label="Sprache wechseln"]').exists()).toBe(false)
  })

  it('language button emits toggle-language with showLanguage', async () => {
    const w = mountFrame({ showLanguage: true })
    await w.get('button[aria-label="Sprache wechseln"]').trigger('click')
    expect(w.emitted('toggle-language')).toHaveLength(1)
  })

  it('renders the actions slot before the built-in buttons', async () => {
    stubViewport(true)
    const w = mountFrame({}, { actions: '<button id="custom">Custom</button>' })
    await flushPromises()
    expect(w.findAll('header button').map(b => b.attributes('id') ?? b.attributes('aria-label'))[0]).toBe('custom')
  })

  it('shows the standard drawer and no menu button on desktop', async () => {
    stubViewport(true)
    const w = mountFrame()
    await flushPromises()
    expect(w.find('dialog').exists()).toBe(false)
    expect(w.find('nav[aria-label="Navigation"]').exists()).toBe(true)
    expect(w.find('button[aria-label="Menü"]').exists()).toBe(false)
  })

  it('shows the modal drawer behind a menu button below 1024px', async () => {
    const w = mountFrame()
    await flushPromises()
    expect(w.find('dialog').exists()).toBe(true)
    expect(w.find('button[aria-label="Menü"]').exists()).toBe(true)
  })

  it('menu button opens the modal drawer', async () => {
    const w = mountFrame()
    await flushPromises()
    await w.get('button[aria-label="Menü"]').trigger('click')
    await flushPromises()
    expect((w.get('dialog').element as HTMLDialogElement).open).toBe(true)
  })

  it('moves focus to main when the active path changes', async () => {
    const w = mountFrame()
    await w.setProps({ activePath: '/models' })
    await flushPromises()
    expect(document.activeElement).toBe(w.get('main').element)
  })

  it('shows the snackbar message of useSnackbar', async () => {
    const w = mountFrame()
    useSnackbar().show('Saved')
    await flushPromises()
    expect(w.get('[role="status"][aria-live="polite"]').text()).toContain('Saved')
  })
})
