import { existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addComponentsDir, addImports, createResolver, defineNuxtModule, resolvePath } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

export interface ModuleOptions {
  /** Prefix of every component: `M3` gives M3Button, M3AppFrame, ... */
  prefix: string
  /** Adds the Roboto weights (400, 500, 700) from @fontsource to the app styles. */
  fonts: boolean
}

const moduleDir = dirname(fileURLToPath(import.meta.url))

const pavoModule: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@onelitefeathernet/pavo',
    configKey: 'pavo',
    compatibility: { nuxt: '>=4.0.0' },
  },
  defaults: {
    prefix: 'M3',
    fonts: true,
  },
  async setup(options, nuxt) {
    const { resolve: resolveRuntime } = createResolver(import.meta.url)
    const runtime = (path: string) => resolveRuntime('./runtime', path)

    // Components: one file per component, the file name without the prefix (Button.vue becomes M3Button).
    const componentsDir = resolveRuntime('./runtime/components')
    if (existsSync(componentsDir)) {
      addComponentsDir({
        path: componentsDir,
        prefix: options.prefix,
        pathPrefix: false,
        ignore: ['**/*.test.ts'],
      })
    }

    addImports([
      { name: 'useColorTheme', from: runtime('composables/useColorTheme') },
      { name: 'useSnackbar', from: runtime('composables/useSnackbar') },
      { name: 'useMediaQuery', from: runtime('composables/useMediaQuery') },
      { name: 'usePavoText', from: runtime('composables/usePavoText') },
      { name: 'registerIcons', from: runtime('lib/icons') },
      { name: 'toClientError', from: runtime('lib/problem') },
      { name: 'toTransportError', from: runtime('lib/problem') },
      { name: 'problemFromBody', from: runtime('lib/problem') },
      { name: 'ApiError', from: runtime('lib/problem') },
      { name: 'NetworkError', from: runtime('lib/problem') },
    ])

    // Built-in texts go to vue-i18n when the app uses @nuxtjs/i18n; without it usePavoText falls back to them.
    // The hook is emitted by @nuxtjs/i18n only; its types are not loaded here, so the hook is typed locally.
    type RegisterModule = (options: { langDir: string, locales: { code: string, file: string }[] }) => void
    const hookI18n = nuxt.hook.bind(nuxt) as unknown as (name: string, fn: (register: RegisterModule) => void) => void
    hookI18n('i18n:registerModule', (register) => {
      register({
        langDir: runtime('locales'),
        locales: [
          { code: 'de', file: 'de.json' },
          { code: 'en', file: 'en.json' },
        ],
      })
    })

    if (options.fonts) {
      const weights = ['400', '500', '700'].map(weight => `@fontsource/roboto/${weight}.css`)
      for (const id of weights) {
        nuxt.options.css.push(await resolvePath(id, { cwd: moduleDir }))
      }
    }

    nuxt.options.build.transpile.push('@onelitefeathernet/pavo')
  },
})

export default pavoModule
