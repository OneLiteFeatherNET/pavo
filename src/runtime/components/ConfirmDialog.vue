<template>
  <M3Dialog
    :model-value="modelValue"
    :title="title"
    width="sm"
    :alert="danger"
    :describedby="messageId"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p :id="messageId" class="text-body-large text-on-surface-variant">{{ message }}</p>
    <template #actions>
      <M3Button variant="text" @click="cancel">{{ cancelText }}</M3Button>
      <M3Button :tone="danger ? 'error' : 'primary'" :loading="loading" @click="confirm">
        {{ confirmText }}
      </M3Button>
    </template>
  </M3Dialog>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { usePavoText } from '../composables/usePavoText'
import M3Button from './Button.vue'
import M3Dialog from './Dialog.vue'

/**
 * Asks before a mutating action. The parent owns the open state: `confirm` is emitted when the user accepts, and the
 * dialog closes itself by emitting update:modelValue. `danger` marks a destructive action: error-coloured button and
 * an alert dialog. Empty labels fall back to the built-in texts.
 */
const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
}>(), { confirmLabel: '', cancelLabel: '', danger: false, loading: false })

const emit = defineEmits<{ 'update:modelValue': [boolean], 'confirm': [] }>()

const t = usePavoText()
const confirmText = computed(() => props.confirmLabel || t('confirm'))
const cancelText = computed(() => props.cancelLabel || t('cancel'))
const messageId = `${useId()}-message`

function cancel() {
  emit('update:modelValue', false)
}
function confirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>
