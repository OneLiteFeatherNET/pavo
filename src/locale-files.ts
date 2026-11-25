import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Picks the file name of a built-in locale inside `dir`: the `.ts` source when the module runs from src,
 * the `.js` build output when it runs from the published dist. Throws when neither exists.
 */
export function localeFile(dir: string, code: string): string {
  for (const ext of ['ts', 'js']) {
    const name = `${code}.${ext}`
    if (existsSync(join(dir, name))) return name
  }
  throw new Error(`pavo: no locale file for "${code}" in ${dir} (expected ${code}.ts or ${code}.js)`)
}
