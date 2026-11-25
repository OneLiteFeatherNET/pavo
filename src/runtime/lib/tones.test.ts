import { describe, expect, it } from 'vitest'
import { iconPath } from './icons'
import { TONE_CLASSES, TONE_ICONS, TONE_SOLID_CLASSES } from './tones'
import type { Tone } from './types'

const TONES: Tone[] = ['neutral', 'primary', 'success', 'warning', 'error', 'info']

describe('tones', () => {
  it.each(TONES)('defines container and solid classes for %s', (tone) => {
    expect(TONE_CLASSES[tone]).toMatch(/^bg-\S+ text-\S+$/)
    expect(TONE_SOLID_CLASSES[tone]).toMatch(/^bg-\S+$/)
  })

  it.each(TONES)('gives %s a default icon that resolves or none', (tone) => {
    const icon = TONE_ICONS[tone]
    if (icon === '') return
    expect(iconPath(icon), `icon ${icon} of ${tone}`).not.toBe('')
  })

  it('uses no icon for the neutral and primary tones', () => {
    expect(TONE_ICONS.neutral).toBe('')
    expect(TONE_ICONS.primary).toBe('')
  })
})
