<template>
  <div class="flex flex-wrap items-center gap-3">
    <input :id="id" ref="input" type="file" :accept="accept" class="sr-only" @change="onChange">
    <label
      :for="id"
      class="state-layer inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-outline px-6 text-label-large text-primary has-[:focus-visible]:outline-3"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false" class="shrink-0">
        <path :d="iconPath('mdi-upload')" />
      </svg>
      {{ label }}
    </label>
    <span v-if="fileName" class="text-body-medium text-on-surface-variant">{{ fileName }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue'
import { iconPath } from '../lib/icons'

defineProps<{ label: string, accept?: string }>()
const emit = defineEmits<{ change: [File | null] }>()

const id = useId()
const input = ref<HTMLInputElement>()
const fileName = ref('')

function onChange() {
  const f = input.value?.files?.[0] ?? null
  fileName.value = f?.name ?? ''
  emit('change', f)
}

/** Forget the chosen file (used when the surrounding dialog resets). */
function reset() {
  if (input.value) input.value.value = ''
  fileName.value = ''
}
defineExpose({ reset })
</script>
