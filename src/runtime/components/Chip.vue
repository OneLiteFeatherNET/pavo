<template>
  <component
    :is="tag"
    v-bind="$attrs"
    :to="linkTo"
    :href="linkHref"
    :class="[
      'state-layer inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-sm no-underline',
      small ? 'h-6 px-2 text-label-medium' : 'h-8 px-3 text-label-large',
      TONES[tone],
    ]"
  >
    <M3Icon v-if="icon" :name="icon" :size="small ? 14 : 18" />
    <span class="min-w-0 truncate"><slot /></span>
    <button
      v-if="removable"
      type="button"
      class="state-layer -mr-1 inline-flex size-5 items-center justify-center rounded-full"
      :aria-label="removeLabel || t('close')"
      @click.stop.prevent="emit('remove')"
    >
      <M3Icon name="mdi-close" :size="14" />
    </button>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePavoText } from '../composables/usePavoText'
import { useLinkComponent } from '../lib/link'
import type { Tone } from '../lib/types'
import M3Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  icon?: string
  small?: boolean
  to?: string | Record<string, unknown>
  href?: string
  removable?: boolean
  /** Accessible name of the remove button. Empty falls back to the built-in close text. */
  removeLabel?: string
}>(), { tone: 'neutral', icon: undefined, to: undefined, href: undefined, removeLabel: '' })
const emit = defineEmits<{ remove: [] }>()

const t = usePavoText()
const routerLink = useLinkComponent()
const isLink = computed(() => Boolean(props.to || props.href))
const tag = computed(() => (isLink.value ? routerLink : 'span'))
const isAnchor = computed(() => isLink.value && routerLink === 'a')
const linkTo = computed(() => (isLink.value && !isAnchor.value ? (props.to ?? props.href) : undefined))
const linkHref = computed(() => {
  if (!isAnchor.value) return undefined
  return props.href ?? (typeof props.to === 'string' ? props.to : undefined)
})

const TONES: Record<Tone, string> = {
  neutral: 'border border-outline-variant text-on-surface-variant',
  primary: 'bg-primary-container text-on-primary-container',
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-tertiary-container text-on-tertiary-container',
}
</script>
