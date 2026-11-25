import { mount } from '@vue/test-utils'
import { defineComponent, h, type Component } from 'vue'
import { describe, expect, it } from 'vitest'
import { useLinkComponent } from './link'

function linkInSetup(global?: Record<string, unknown>): Component | string {
  let link: Component | string = ''
  const probe = defineComponent({
    setup() {
      link = useLinkComponent()
      return () => h('div')
    },
  })
  mount(probe, { global: global as never })
  return link
}

describe('useLinkComponent', () => {
  it('returns the plain anchor when no router link is registered', () => {
    expect(linkInSetup()).toBe('a')
  })

  it('returns NuxtLink when it is registered', () => {
    const NuxtLink = defineComponent({ render: () => h('a') })
    expect(linkInSetup({ components: { NuxtLink } })).toBe(NuxtLink)
  })

  it('prefers NuxtLink over RouterLink', () => {
    const NuxtLink = defineComponent({ render: () => h('a') })
    const RouterLink = defineComponent({ render: () => h('a') })
    expect(linkInSetup({ components: { NuxtLink, RouterLink } })).toBe(NuxtLink)
  })

  it('falls back to RouterLink when only that is registered', () => {
    const RouterLink = defineComponent({ render: () => h('a') })
    expect(linkInSetup({ components: { RouterLink } })).toBe(RouterLink)
  })
})
