<template>
  <component
    :is="link"
    v-bind="target"
    :aria-current="active ? 'page' : undefined"
    :class="[
      'state-layer flex h-14 items-center gap-3 rounded-full px-4 text-label-large no-underline',
      active ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant',
    ]"
    @click="emit('click')"
  >
    <svg
      v-if="iconData"
      viewBox="0 0 24 24"
      aria-hidden="true"
      class="size-6 shrink-0 fill-current"
    >
      <path :d="iconData" />
    </svg>
    {{ item.label }}
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconPath } from '../lib/icons'
import { useLinkComponent } from '../lib/link'
import type { NavEntry } from '../lib/types'

const props = defineProps<{ item: NavEntry, active: boolean }>()
const emit = defineEmits<{ click: [] }>()

// Components with a router link get `to`; a plain anchor gets `href`.
const link = useLinkComponent()
const target = computed(() => (link === 'a' ? { href: props.item.to } : { to: props.item.to }))
const iconData = computed(() => (props.item.icon ? iconPath(props.item.icon) : ''))
</script>
