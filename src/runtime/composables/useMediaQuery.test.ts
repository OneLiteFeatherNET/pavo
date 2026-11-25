import { mount } from '@vue/test-utils'
import { defineComponent, h, type Ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useMediaQuery } from './useMediaQuery'

interface FakeMedia {
  matches: boolean
  listeners: Set<() => void>
  addEventListener: (type: string, fn: () => void) => void
  removeEventListener: (type: string, fn: () => void) => void
}

function fakeMedia(matches: boolean): FakeMedia {
  const listeners = new Set<() => void>()
  return {
    matches,
    listeners,
    addEventListener: (_type, fn) => listeners.add(fn),
    removeEventListener: (_type, fn) => listeners.delete(fn),
  }
}

function mountWithQuery(query: string): { matches: Ref<boolean>, unmount: () => void } {
  let matches!: Ref<boolean>
  const wrapper = mount(defineComponent({
    setup() {
      matches = useMediaQuery(query)
      return () => h('div')
    },
  }))
  return { matches, unmount: () => wrapper.unmount() }
}

describe('useMediaQuery', () => {
  it('reports the browser answer once mounted', () => {
    const media = fakeMedia(true)
    vi.spyOn(window, 'matchMedia').mockReturnValue(media as unknown as MediaQueryList)
    const { matches } = mountWithQuery('(min-width: 1024px)')
    expect(matches.value).toBe(true)
  })

  it('updates when the media query changes', () => {
    const media = fakeMedia(false)
    vi.spyOn(window, 'matchMedia').mockReturnValue(media as unknown as MediaQueryList)
    const { matches } = mountWithQuery('(min-width: 1024px)')
    expect(matches.value).toBe(false)
    media.matches = true
    media.listeners.forEach(fn => fn())
    expect(matches.value).toBe(true)
  })

  it('removes its listener on unmount', () => {
    const media = fakeMedia(false)
    vi.spyOn(window, 'matchMedia').mockReturnValue(media as unknown as MediaQueryList)
    const { unmount } = mountWithQuery('(min-width: 1024px)')
    expect(media.listeners.size).toBe(1)
    unmount()
    expect(media.listeners.size).toBe(0)
  })
})
