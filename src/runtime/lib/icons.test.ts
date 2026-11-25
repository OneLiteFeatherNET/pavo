import { mdiClose } from '@mdi/js'
import { describe, expect, it } from 'vitest'
import { iconPath, registerIcons } from './icons'

describe('iconPath', () => {
  it('returns the path of a built-in icon', () => {
    expect(iconPath('mdi-close')).toBe(mdiClose)
  })

  it('returns an SVG path that is passed in as it is', () => {
    const path = 'M12 2L2 22h20Z'
    expect(iconPath(path)).toBe(path)
  })

  it('returns an empty string for an unknown icon name', () => {
    expect(iconPath('mdi-does-not-exist')).toBe('')
  })
})

describe('registerIcons', () => {
  it('adds an icon the consumer registered', () => {
    registerIcons({ 'custom-star': 'M1 1h2v2z' })
    expect(iconPath('custom-star')).toBe('M1 1h2v2z')
  })

  it('replaces a built-in icon when the consumer registers the same name', () => {
    registerIcons({ 'mdi-menu': 'M0 0h1v1z' })
    expect(iconPath('mdi-menu')).toBe('M0 0h1v1z')
  })
})
