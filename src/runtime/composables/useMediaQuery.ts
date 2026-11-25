import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Reactive `matchMedia` result. The value is false during SSR and until the component is mounted, when the
 * browser's answer is read and the listener is attached; it is removed again on unmount.
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(false)
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return matches

  const media = window.matchMedia(query)
  const update = () => { matches.value = media.matches }
  onMounted(() => {
    update()
    media.addEventListener('change', update)
  })
  onBeforeUnmount(() => media.removeEventListener('change', update))
  return matches
}
