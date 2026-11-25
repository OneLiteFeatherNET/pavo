// @vitest-environment happy-dom
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import M3Menu from './Menu.vue'
import M3MenuItem from './MenuItem.vue'

// Each test mounts its own menu and attaches it to the document, so focus moves really happen.
const mounted: VueWrapper[] = []
afterEach(() => {
  for (const w of mounted.splice(0)) w.unmount()
  document.body.innerHTML = ''
})

function menu(): VueWrapper {
  const w = mount(M3Menu, {
    props: { label: 'Actions' },
    attachTo: document.body,
    slots: {
      activator: ({ props, toggle }: { props: Record<string, unknown>, toggle: () => void }) =>
        h('button', { ...props, type: 'button', onClick: () => toggle() }, 'Open'),
      default: () => [
        h(M3MenuItem, null, () => 'Rename'),
        h(M3MenuItem, null, () => 'Delete'),
        h(M3MenuItem, null, () => 'Share'),
      ],
    },
  })
  mounted.push(w)
  return w
}

async function open(w: VueWrapper) {
  await w.get('button').trigger('click')
  await w.vm.$nextTick()
}

describe('M3Menu', () => {
  it('marks the activator as a menu button that is closed at first', () => {
    const w = menu()
    expect(w.get('button').attributes('aria-haspopup')).toBe('menu')
    expect(w.get('button').attributes('aria-expanded')).toBe('false')
    expect(w.find('[role="menu"]').exists()).toBe(false)
  })

  it('opens on activator click and exposes a menu with menu items', async () => {
    const w = menu()
    await open(w)
    expect(w.get('button').attributes('aria-expanded')).toBe('true')
    expect(w.get('[role="menu"]').attributes('aria-label')).toBe('Actions')
    expect(w.findAll('[role="menuitem"]')).toHaveLength(3)
  })

  it('moves focus to the first item when it opens', async () => {
    const w = menu()
    await open(w)
    expect(document.activeElement?.textContent?.trim()).toBe('Rename')
  })

  it('closes on Escape', async () => {
    const w = menu()
    await open(w)
    await w.get('[role="menu"]').trigger('keydown', { key: 'Escape' })
    expect(w.find('[role="menu"]').exists()).toBe(false)
  })

  it('returns focus to the activator on Escape', async () => {
    const w = menu()
    await open(w)
    await w.get('[role="menu"]').trigger('keydown', { key: 'Escape' })
    expect(document.activeElement).toBe(w.get('button').element)
  })

  it('moves focus to the next item on ArrowDown', async () => {
    const w = menu()
    await open(w)
    await w.findAll('[role="menuitem"]')[0]!.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement?.textContent?.trim()).toBe('Delete')
  })

  it('wraps focus to the last item on ArrowUp from the first', async () => {
    const w = menu()
    await open(w)
    await w.findAll('[role="menuitem"]')[0]!.trigger('keydown', { key: 'ArrowUp' })
    expect(document.activeElement?.textContent?.trim()).toBe('Share')
  })
})

describe('M3MenuItem', () => {
  it('renders role menuitem when it is not a selectable item', () => {
    const w = mount(M3MenuItem, { slots: { default: 'Rename' } })
    expect(w.attributes('role')).toBe('menuitem')
  })

  it('renders role menuitemradio with aria-checked when a selection state is given', () => {
    const w = mount(M3MenuItem, { props: { selected: true }, slots: { default: 'Large' } })
    expect(w.attributes('role')).toBe('menuitemradio')
    expect(w.attributes('aria-checked')).toBe('true')
  })
})
