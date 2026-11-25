// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ApiError, NetworkError } from '../lib/problem'
import M3Problem from './Problem.vue'

const validation = new ApiError({
  type: 'about:blank',
  title: 'Validation failed',
  status: 422,
  detail: 'Two fields are invalid.',
  errors: [
    { location: 'name', message: 'must not be empty' },
    { location: 'port', message: 'must be below 65536' },
  ],
})

describe('M3Problem', () => {
  it('lists the field errors of an API problem', () => {
    const w = mount(M3Problem, { props: { error: validation } })
    const items = w.findAll('[data-test="problem-errors"] li').map(li => li.text())
    expect(items).toEqual(['name: must not be empty', 'port: must be below 65536'])
    w.unmount()
  })

  it('shows the status and title of an API problem', () => {
    const w = mount(M3Problem, { props: { error: validation } })
    expect(w.get('[role="alert"]').text()).toContain('422 Validation failed')
    w.unmount()
  })

  it('shows the network text for a network error', () => {
    const w = mount(M3Problem, { props: { error: new NetworkError() } })
    expect(w.get('[role="alert"]').text()).toContain('Keine Verbindung zur API')
    w.unmount()
  })

  it('rebuilds the problem from the data of a Nuxt error', () => {
    const nuxtError = {
      data: { problem: { type: 'about:blank', title: 'Not Found', status: 404, detail: 'No such server' } },
    }
    const w = mount(M3Problem, { props: { error: nuxtError } })
    expect(w.get('[role="alert"]').text()).toContain('404 Not Found')
    w.unmount()
  })

  it('renders nothing without an error', () => {
    const w = mount(M3Problem, { props: { error: null } })
    expect(w.find('[role="alert"]').exists()).toBe(false)
    w.unmount()
  })

  it('shows no retry button unless retryable', () => {
    const w = mount(M3Problem, { props: { error: validation } })
    expect(w.find('button').exists()).toBe(false)
    w.unmount()
  })

  it('emits retry when the retry button is clicked', async () => {
    const w = mount(M3Problem, { props: { error: new NetworkError(), retryable: true } })
    expect(w.get('button').text()).toBe('Erneut versuchen')
    await w.get('button').trigger('click')
    expect(w.emitted('retry')).toHaveLength(1)
    w.unmount()
  })
})
