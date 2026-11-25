import { getCurrentInstance, inject, type Component, type InjectionKey } from 'vue'

/**
 * Router link provided by the app. The Nuxt plugin (runtime/plugins/link.ts) provides NuxtLink under this key,
 * because Nuxt does not register NuxtLink globally.
 */
export const PAVO_LINK: InjectionKey<Component> = Symbol('pavo-link')

/**
 * The router link component of the running app: the one provided under PAVO_LINK, else the registered NuxtLink,
 * else RouterLink, otherwise the string 'a'. Looks at the registered components instead of calling resolveComponent,
 * so no warning is logged when neither is registered. Call it during setup.
 */
export function useLinkComponent(): Component | string {
  const provided = inject(PAVO_LINK, null)
  if (provided) return provided
  const components = getCurrentInstance()?.appContext.components ?? {}
  return (components.NuxtLink ?? components.RouterLink ?? 'a') as Component | string
}
