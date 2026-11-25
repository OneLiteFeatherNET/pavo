import { getCurrentInstance, type Component } from 'vue'

/**
 * The router link component of the running app: NuxtLink under Nuxt, RouterLink under plain vue-router, otherwise
 * the string 'a'. Looks at the registered components instead of calling resolveComponent, so no warning is logged
 * when neither is registered. Call it during setup.
 */
export function useLinkComponent(): Component | string {
  const components = getCurrentInstance()?.appContext.components ?? {}
  return (components.NuxtLink ?? components.RouterLink ?? 'a') as Component | string
}
