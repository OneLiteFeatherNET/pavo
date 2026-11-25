import { ref, type Ref } from 'vue'

const DURATION_MS = 5000

// App-wide state, module scope: only the client mutates it (show, dismiss), so server requests never share it.
const message = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

/** App-wide transient message, one at a time. Shown by the Snackbar component, which AppFrame renders. */
export function useSnackbar(): { message: Ref<string>, show: (text: string) => void, dismiss: () => void } {
  function dismiss(): void {
    clearTimeout(timer)
    timer = undefined
    message.value = ''
  }
  function show(text: string): void {
    clearTimeout(timer)
    message.value = text
    timer = setTimeout(dismiss, DURATION_MS)
  }
  return { message, show, dismiss }
}
