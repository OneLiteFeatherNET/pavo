import { describe, expect, it } from 'vitest'
import { PAVO_TEXTS } from './texts'

function keysOf(tree: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'object' && value !== null ? keysOf(value as Record<string, unknown>, path) : [path]
  })
}

function leavesOf(tree: Record<string, unknown>): string[] {
  return Object.values(tree).flatMap(value =>
    typeof value === 'object' && value !== null ? leavesOf(value as Record<string, unknown>) : [value as string],
  )
}

describe('PAVO_TEXTS', () => {
  it('has the same keys in German and English', () => {
    expect(keysOf(PAVO_TEXTS.en.pavo).sort()).toEqual(keysOf(PAVO_TEXTS.de.pavo).sort())
  })

  it('has no empty text in German', () => {
    expect(leavesOf(PAVO_TEXTS.de.pavo).filter(text => text.trim() === '')).toEqual([])
  })

  it('has no empty text in English', () => {
    expect(leavesOf(PAVO_TEXTS.en.pavo).filter(text => text.trim() === '')).toEqual([])
  })
})
