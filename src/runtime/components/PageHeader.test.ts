// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3PageHeader from './PageHeader.vue'

describe('M3PageHeader', () => {
  it('renders the title as the only h1', () => {
    const w = mount(M3PageHeader, { props: { title: 'Servers' } })
    expect(w.findAll('h1')).toHaveLength(1)
    expect(w.get('h1').text()).toBe('Servers')
    w.unmount()
  })

  it('renders the subtitle below the title', () => {
    const w = mount(M3PageHeader, { props: { title: 'Servers', subtitle: 'Running now' } })
    expect(w.get('p').text()).toBe('Running now')
    w.unmount()
  })

  it('renders the actions slot', () => {
    const w = mount(M3PageHeader, {
      props: { title: 'Servers' },
      slots: { actions: '<button>Create</button>' },
    })
    expect(w.get('button').text()).toBe('Create')
    w.unmount()
  })
})
