<script setup lang="ts">
const { isDark, toggle, restore } = useColorTheme()

onMounted(restore)
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-12">
    <h1 class="text-display-small text-on-surface">
      {{ $t('playground.title') }}
    </h1>
    <p class="text-body-large text-on-surface-variant">
      {{ $t('playground.intro') }}
    </p>
    <div>
      <button
        type="button"
        class="rounded-full bg-primary px-6 py-3 text-label-large text-on-primary"
        @click="toggle"
      >
        {{ isDark ? $t('playground.toLight') : $t('playground.toDark') }}
      </button>
    </div>
  </main>
</template>
