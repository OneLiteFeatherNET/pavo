// The only runtime file that imports from Nuxt ('#app', '#components'). It provides NuxtLink for lib/link.ts;
// nothing else under runtime/ may import these virtual modules, so the plain-Vue entry keeps working.
import { defineNuxtPlugin } from '#app'
import { NuxtLink } from '#components'
import { PAVO_LINK } from '../lib/link'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(PAVO_LINK, NuxtLink)
})
