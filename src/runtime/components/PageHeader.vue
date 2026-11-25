<template>
  <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div class="min-w-0">
      <h1 class="text-headline-medium text-on-surface">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1 text-body-large text-on-surface-variant">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
/** Title, optional subtitle and actions at the top of a page. One h1 per page. */
defineProps<{ title: string, subtitle?: string }>()
</script>
