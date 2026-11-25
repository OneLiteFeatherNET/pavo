<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <M3FieldFrame :for-id="id" :label="label" :hint="hint" floated>
    <div
      class="peer flex min-h-14 flex-wrap items-center gap-1.5 rounded-xs px-3 pt-4 pb-2"
      @click="focusInput"
    >
      <span
        v-for="(v, i) in modelValue"
        :key="`${v}-${i}`"
        class="inline-flex h-6 max-w-full items-center gap-1.5 rounded-sm bg-secondary-container px-2 text-label-medium whitespace-nowrap text-on-secondary-container"
      >
        <span class="min-w-0 truncate">{{ v }}</span>
        <button
          type="button"
          class="state-layer -mr-1 inline-flex size-5 items-center justify-center rounded-full"
          :aria-label="`${removeText} ${v}`"
          @click.stop.prevent="removeAt(i)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" focusable="false">
            <path :d="iconPath('mdi-close')" />
          </svg>
        </button>
      </span>
      <input
        :id="id"
        ref="input"
        v-model="draft"
        type="text"
        autocomplete="off"
        :aria-describedby="hint ? `${id}-support` : undefined"
        class="min-w-24 flex-1 bg-transparent py-1 text-body-large text-on-surface outline-none"
        @keydown="onKey"
        @blur="commit"
      >
    </div>
  </M3FieldFrame>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { iconPath } from '../lib/icons'
import { usePavoText } from '../composables/usePavoText'
import M3FieldFrame from './FieldFrame.vue'

const props = withDefaults(defineProps<{
  modelValue: readonly string[]
  label: string
  hint?: string
  /** Accessible name prefix of the chip remove buttons; empty falls back to the built-in "close" text. */
  removeLabel?: string
}>(), { hint: '', removeLabel: '' })
const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

const t = usePavoText()
const removeText = computed(() => props.removeLabel || t('close'))
const id = useId()
const input = ref<HTMLInputElement>()
const draft = ref('')

function commit() {
  const v = draft.value.trim()
  draft.value = ''
  if (v && !props.modelValue.includes(v)) emit('update:modelValue', [...props.modelValue, v])
}
function removeAt(i: number) {
  emit('update:modelValue', props.modelValue.filter((_, n) => n !== i))
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    commit()
  }
  else if (e.key === 'Backspace' && !draft.value && props.modelValue.length) {
    removeAt(props.modelValue.length - 1)
  }
}
function focusInput() {
  input.value?.focus()
}
</script>
