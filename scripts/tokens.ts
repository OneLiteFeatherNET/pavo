// Writes the default tokens stylesheet (src/runtime/css/tokens.css). Run with `pnpm tokens` after changing
// src/runtime/tokens/generate.ts; test/tokens.test.ts fails while the committed file is stale.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildTokensCss } from '../src/runtime/tokens/generate.ts'

export const TOKENS_PATH = fileURLToPath(new URL('../src/runtime/css/tokens.css', import.meta.url))

writeFileSync(TOKENS_PATH, buildTokensCss())
console.log(`wrote ${TOKENS_PATH}`)
