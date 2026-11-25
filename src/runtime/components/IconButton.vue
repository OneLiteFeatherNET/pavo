<template>
  <component
    :is="tag"
    v-bind="$attrs"
    :to="linkTo"
    :href="linkHref"
    :type="isLink ? undefined : 'button'"
    :disabled="!isLink && disabled ? true : undefined"
    :aria-label="label"
    :aria-pressed="pressed === undefined ? undefined : String(pressed)"
    :class="[
      'state-layer inline-flex size-10 shrink-0 items-center justify-center rounded-full no-underline',
      disabled ? 'text-on-surface/38' : VARIANTS[variant],
    ]"
  >
    <M3Icon :name="icon" :size="size" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLinkComponent } from '../lib/link'
import M3Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  icon: string
  /** Accessible name; an icon button has no visible text. */
  label: string
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined'
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  pressed?: boolean
  size?: number
}>(), { variant: 'standard', to: undefined, href: undefined, pressed: undefined, size: 24 })

const routerLink = useLinkComponent()
const isLink = computed(() => Boolean(props.to || props.href))
const tag = computed(() => (isLink.value ? routerLink : 'button'))
const isAnchor = computed(() => isLink.value && routerLink === 'a')
const linkTo = computed(() => (isLink.value && !isAnchor.value ? (props.to ?? props.href) : undefined))
const linkHref = computed(() => {
  if (!isAnchor.value) return undefined
  return props.href ?? (typeof props.to === 'string' ? props.to : undefined)
})

const VARIANTS = {
  standard: 'text-on-surface-variant',
  filled: 'bg-primary text-on-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  outlined: 'border border-outline text-on-surface-variant',
}
</script>
