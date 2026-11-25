<template>
  <button
    type="button"
    :role="selected === undefined ? 'menuitem' : 'menuitemradio'"
    :aria-checked="selected"
    :class="[
      'state-layer flex h-12 w-full items-center gap-3 px-3 text-start text-label-large',
      selected ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface',
    ]"
  >
    <svg
      v-if="icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      class="shrink-0"
    >
      <path :d="iconPath(icon)" />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { iconPath } from '../lib/icons'

// `selected` has no default: an absent value keeps undefined (a plain menu item), and Vue's Boolean casting would
// otherwise turn it into false.
withDefaults(defineProps<{ icon?: string, selected?: boolean }>(), { icon: undefined, selected: undefined })
</script>
