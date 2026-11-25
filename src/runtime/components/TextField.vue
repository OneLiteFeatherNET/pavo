<template>
  <M3FieldFrame
    :class="$attrs.class as string"
    :style="$attrs.style as string"
    :for-id="id"
    :label="label"
    :error="error"
    :hint="hint"
    :counter="counterText"
    :required="required"
    :disabled="disabled"
    :floated="alwaysFloated"
    :leading="!!leadingIcon"
  >
    <component
      :is="multiline ? 'textarea' : 'input'"
      :id="id"
      v-bind="inputAttrs()"
      :value="modelValue ?? ''"
      :type="multiline ? undefined : type"
      :rows="multiline ? rows : undefined"
      :required="required"
      :disabled="disabled"
      placeholder=" "
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error || hint || counterText ? `${id}-support` : undefined"
      :class="[
        'peer block w-full rounded-xs bg-transparent text-body-large text-on-surface outline-none',
        multiline ? 'min-h-14 resize-y px-4 py-4' : 'h-14 px-4',
        leadingIcon ? 'pl-12' : '',
        clearable ? 'pr-12' : '',
        disabled ? 'text-on-surface/38' : '',
        inputClass,
      ]"
      @input="onInput"
    />
    <svg
      v-if="leadingIcon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      class="pointer-events-none absolute top-4 left-3 size-6 text-on-surface-variant"
    >
      <path :d="iconPath(leadingIcon)" />
    </svg>
    <button
      v-if="clearable && modelValue !== '' && modelValue != null && !disabled"
      type="button"
      :aria-label="clearText"
      class="state-layer absolute top-2 right-2 inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant"
      @click="clear"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-[18px]">
        <path :d="iconPath('mdi-close')" />
      </svg>
    </button>
  </M3FieldFrame>
</template>

<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import { iconPath } from '../lib/icons'
import { usePavoText } from '../composables/usePavoText'
import M3FieldFrame from './FieldFrame.vue'

defineOptions({ inheritAttrs: false })

// class and style belong to the whole field; every other attribute (autocomplete, min, step, ...) to the control.
const attrs = useAttrs()
// A function, not a computed: the attrs object is not reactive.
function inputAttrs() {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
}

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  modelModifiers?: { number?: boolean, trim?: boolean }
  label: string
  type?: string
  multiline?: boolean
  rows?: number
  error?: string
  hint?: string
  /** Maximum length; shows a "n / max" counter. */
  counter?: number
  required?: boolean
  disabled?: boolean
  clearable?: boolean
  /** Accessible name of the clear button; empty falls back to the built-in "clear" text. */
  clearLabel?: string
  /** Icon name from the icon registry, shown at the start of the field. */
  leadingIcon?: string
  inputClass?: string
}>(), {
  modelValue: '', modelModifiers: () => ({}), type: 'text', rows: 3, error: '', hint: '', counter: undefined,
  clearLabel: '', leadingIcon: undefined, inputClass: '',
})
const emit = defineEmits<{ 'update:modelValue': [string | number] }>()

const t = usePavoText()
const clearText = computed(() => props.clearLabel || t('clear'))
const id = useId()
// Date and time inputs show a format placeholder, so their label never rests inside the box.
const alwaysFloated = computed(() => ['date', 'datetime-local', 'time', 'month', 'week'].includes(props.type))
const counterText = computed(() => (props.counter ? `${String(props.modelValue ?? '').length} / ${props.counter}` : ''))

function onInput(e: Event) {
  let v: string | number = (e.target as HTMLInputElement).value
  if (props.modelModifiers.trim) v = v.trim()
  if (props.modelModifiers.number) {
    const n = Number.parseFloat(v)
    if (!Number.isNaN(n)) v = n
  }
  emit('update:modelValue', v)
}

function clear(e: Event) {
  emit('update:modelValue', '')
  const input = (e.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>('input,textarea')
  input?.focus()
}
</script>
