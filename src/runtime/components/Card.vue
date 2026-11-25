<template>
  <component
    :is="tag"
    v-bind="$attrs"
    :to="linkTo"
    :href="linkHref"
    :class="[
      'block min-w-0 rounded-md p-4 text-on-surface no-underline',
      VARIANTS[variant],
      isLink ? 'state-layer' : '',
    ]"
  >
    <h2 v-if="title" class="mb-3 text-title-large">{{ title }}</h2>
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLinkComponent } from '../lib/link'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: 'filled' | 'elevated' | 'outlined'
  title?: string
  /** Router target: the whole card becomes a link. */
  to?: string | Record<string, unknown>
  /** Plain URL: the whole card becomes an anchor when no router is present. */
  href?: string
}>(), { variant: 'filled', title: '', to: undefined, href: undefined })

const routerLink = useLinkComponent()
const isLink = computed(() => Boolean(props.to || props.href))
const tag = computed(() => (isLink.value ? routerLink : 'section'))
const isAnchor = computed(() => isLink.value && routerLink === 'a')
const linkTo = computed(() => (isLink.value && !isAnchor.value ? (props.to ?? props.href) : undefined))
const linkHref = computed(() => {
  if (!isAnchor.value) return undefined
  return props.href ?? (typeof props.to === 'string' ? props.to : undefined)
})

const VARIANTS = {
  filled: 'bg-surface-container',
  elevated: 'bg-surface-container-low shadow-elevation-1',
  outlined: 'border border-outline-variant bg-surface',
}
</script>
