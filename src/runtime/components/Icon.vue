<template>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    class="inline-block shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
  >
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconPath } from '../lib/icons'

/** An icon from the registry (or a raw SVG path). Decorative unless `label` names it for assistive technology. */
const props = withDefaults(defineProps<{ name: string, size?: number, label?: string }>(), { size: 24, label: '' })

const path = computed(() => iconPath(props.name))
</script>
