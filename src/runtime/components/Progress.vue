<template>
  <div
    v-if="circular"
    role="progressbar"
    :aria-label="accessibleLabel"
    :aria-valuenow="percent"
    :aria-valuemin="determinate ? 0 : undefined"
    :aria-valuemax="determinate ? 100 : undefined"
    :class="['inline-block size-10 text-primary', determinate ? '' : 'animate-spin']"
  >
    <svg viewBox="0 0 48 48" class="size-full" aria-hidden="true">
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="circleDash"
      />
    </svg>
  </div>
  <div
    v-else
    role="progressbar"
    :aria-label="accessibleLabel"
    :aria-valuenow="percent"
    :aria-valuemin="determinate ? 0 : undefined"
    :aria-valuemax="determinate ? 100 : undefined"
    class="relative block h-1 w-full overflow-hidden rounded-full bg-secondary-container"
  >
    <div
      v-if="determinate"
      class="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-200"
      :style="{ width: `${percent}%` }"
    />
    <div v-else class="m3-progress-bar absolute inset-y-0 w-2/5 rounded-full bg-primary" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePavoText } from '../composables/usePavoText'

/**
 * Progress indicator, linear (default) or circular. Indeterminate without `value`; with `value` (0 to 100) it is
 * determinate and exposes aria-valuenow. `label` names it for assistive technology; the default is the built-in
 * "loading" text.
 */
const props = withDefaults(defineProps<{ label?: string, circular?: boolean, value?: number }>(), {
  label: '',
  circular: false,
  value: undefined,
})

const t = usePavoText()
const determinate = computed(() => props.value !== undefined)
const percent = computed(() => (props.value === undefined ? undefined : Math.min(100, Math.max(0, props.value))))
const accessibleLabel = computed(() => props.label || t('loading'))
// Circumference of the r=18 ring is about 113.1; a determinate ring fills the given share of it.
const circleDash = computed(() =>
  percent.value === undefined ? '85 30' : `${(percent.value / 100) * 113.1} 113.1`,
)
</script>

<style scoped>
.m3-progress-bar {
  animation: m3-progress 1.4s var(--ease-emphasized) infinite;
}

@keyframes m3-progress {
  from { left: -40%; }
  to { left: 100%; }
}
</style>
