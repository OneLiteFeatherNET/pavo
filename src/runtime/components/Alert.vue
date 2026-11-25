<template>
  <div :role="effectiveRole" :class="['flex gap-3 rounded-md p-4', TONES[tone]]">
    <M3Icon :name="TONE_ICONS[tone]" class="mt-0.5" />
    <div class="min-w-0 flex-1 text-body-medium">
      <p v-if="title" class="text-title-small">{{ title }}</p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TONE_ICONS } from '../lib/tones'
import M3Icon from './Icon.vue'

/**
 * Inline message. An error is announced at once (role alert); the other tones are status messages. `role` overrides
 * that default.
 */
const props = withDefaults(defineProps<{
  tone?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  role?: 'alert' | 'status'
}>(), { tone: 'info', title: '', role: undefined })

const effectiveRole = computed(() => props.role ?? (props.tone === 'error' ? 'alert' : 'status'))

const TONES = {
  info: 'bg-secondary-container text-on-secondary-container',
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
  error: 'bg-error-container text-on-error-container',
}
</script>
