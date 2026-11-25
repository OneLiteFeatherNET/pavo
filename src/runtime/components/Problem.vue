<template>
  <M3Alert v-if="normalized" tone="error" role="alert" :title="title" class="mb-4">
    <p v-if="detail">{{ detail }}</p>
    <ul v-if="apiError && apiError.errors.length" class="mt-2 list-disc pl-5" data-test="problem-errors">
      <li v-for="(e, i) in apiError.errors" :key="i">
        <span v-if="e.location" class="font-mono">{{ e.location }}: </span>{{ e.message }}
      </li>
    </ul>
    <div v-if="retryable" class="mt-3">
      <M3Button variant="tonal" tone="error" @click="emit('retry')">
        {{ retryText }}
      </M3Button>
    </div>
  </M3Alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePavoText } from '../composables/usePavoText'
import { ApiError, NetworkError, toClientError } from '../lib/problem'
import M3Alert from './Alert.vue'
import M3Button from './Button.vue'

/**
 * Shows an error of an API call. An RFC 9457 problem shows its title, detail and field errors; a network failure
 * gets its own text; anything else shows its message. Renders nothing without an error. `retryable` adds a button
 * that emits `retry`.
 */
const props = withDefaults(defineProps<{
  error: unknown
  retryable?: boolean
  /** Text of the retry button. Empty falls back to the built-in text. */
  retryLabel?: string
}>(), { retryable: false, retryLabel: '' })
const emit = defineEmits<{ retry: [] }>()

const t = usePavoText()
const retryText = computed(() => props.retryLabel || t('retry'))

// Errors from useAsyncData arrive wrapped as Nuxt errors (and from the SSR payload as plain data), so rebuild first.
const normalized = computed(() => (props.error == null ? null : toClientError(props.error)))
const apiError = computed(() => (normalized.value instanceof ApiError ? normalized.value : null))
const title = computed(() => {
  if (normalized.value instanceof NetworkError) return t('problem.network')
  if (apiError.value) return `${apiError.value.status} ${apiError.value.problem.title}`
  return t('problem.title')
})
const detail = computed(() => {
  if (apiError.value) return apiError.value.problem.detail ?? ''
  if (normalized.value instanceof NetworkError) return ''
  return normalized.value?.message ?? ''
})
</script>
