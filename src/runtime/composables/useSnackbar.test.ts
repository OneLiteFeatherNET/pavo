import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type SnackbarModule = typeof import('./useSnackbar')

async function freshSnackbar(): Promise<ReturnType<SnackbarModule['useSnackbar']>> {
  vi.resetModules()
  return (await import('./useSnackbar')).useSnackbar()
}

describe('useSnackbar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a message', async () => {
    const { show, message } = await freshSnackbar()
    show('Gespeichert')
    expect(message.value).toBe('Gespeichert')
  })

  it('hides the message after five seconds', async () => {
    const { show, message } = await freshSnackbar()
    show('Gespeichert')
    vi.advanceTimersByTime(4999)
    expect(message.value).toBe('Gespeichert')
    vi.advanceTimersByTime(1)
    expect(message.value).toBe('')
  })

  it('restarts the timer when a new message replaces the old one', async () => {
    const { show, message } = await freshSnackbar()
    show('first')
    vi.advanceTimersByTime(4000)
    show('second')
    vi.advanceTimersByTime(4000)
    expect(message.value).toBe('second')
    vi.advanceTimersByTime(1000)
    expect(message.value).toBe('')
  })

  it('dismiss clears the message and its timer', async () => {
    const { show, dismiss, message } = await freshSnackbar()
    show('Gespeichert')
    dismiss()
    expect(message.value).toBe('')
    show('next')
    vi.advanceTimersByTime(5000)
    expect(message.value).toBe('')
  })
})
