<template>
  <M3Chip :tone="tone" :icon="resolvedIcon" small>{{ label }}</M3Chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TONE_ICONS } from '../lib/tones'
import type { Tone } from '../lib/types'
import M3Chip from './Chip.vue'

/**
 * Status as a small coloured chip. The icon defaults to the one of the tone (none for neutral and primary); an
 * explicit `icon` replaces it.
 */
const props = withDefaults(defineProps<{
  tone: Tone
  label: string
  icon?: string
}>(), { icon: '' })

const resolvedIcon = computed(() => props.icon || TONE_ICONS[props.tone] || undefined)
</script>
