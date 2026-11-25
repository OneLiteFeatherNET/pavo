#!/usr/bin/env node
// pavo-tokens --seed '#ff6600' --out app/assets/css/pavo-tokens.css
// Writes the Material 3 colour tokens for a custom seed colour (stdout when --out is omitted).
import { writeFileSync } from 'node:fs'
import { buildTokensCss } from '../dist/runtime/tokens/generate.js'

const args = process.argv.slice(2)
const option = name => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}

const seed = option('--seed')
const out = option('--out')
if (args.includes('--help') || args.includes('-h')) {
  console.log('usage: pavo-tokens [--seed #rrggbb] [--out file.css]')
  process.exit(0)
}
if (seed !== undefined && !/^#[0-9a-fA-F]{6}$/.test(seed)) {
  console.error(`pavo-tokens: --seed must look like #rrggbb, got ${seed}`)
  process.exit(1)
}

const css = buildTokensCss({ seed })
if (out) {
  writeFileSync(out, css)
  console.log(`wrote ${out}`)
}
else {
  process.stdout.write(css)
}
