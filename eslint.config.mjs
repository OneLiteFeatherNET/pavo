// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: { stylistic: false },
}).append({
  // Nuxt routes are named after their file (pages/index.vue), so the multi-word rule does not apply to pages.
  files: ['playground/app/pages/**/*.vue'],
  rules: { 'vue/multi-word-component-names': 'off' },
}).append({
  // Library components are registered with the M3 prefix (M3Button, M3Card), so one-word file names are the norm.
  files: ['src/runtime/components/**/*.vue'],
  rules: { 'vue/multi-word-component-names': 'off' },
})
