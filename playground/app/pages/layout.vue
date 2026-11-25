<script setup lang="ts">
const snackbar = useSnackbar()
const confirmOpen = ref(false)

const tones = ['neutral', 'primary', 'success', 'warning', 'error', 'info'] as const

const validationError = new ApiError({
  type: 'about:blank',
  title: 'Validation failed',
  status: 422,
  detail: 'Two fields are invalid.',
  errors: [
    { location: 'name', message: 'must not be empty' },
    { location: 'port', message: 'must be below 65536' },
  ],
})
const networkError = new NetworkError()

function retry() {
  snackbar.show('Retrying the request')
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <M3PageHeader title="Layout" subtitle="Page header, problems, confirmations and status chips.">
      <template #actions>
        <M3Button variant="tonal" @click="snackbar.show('Changes saved')">
          Show snackbar
        </M3Button>
      </template>
    </M3PageHeader>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Problem
      </h2>
      <M3Problem :error="validationError" />
      <M3Problem :error="networkError" retryable @retry="retry" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        ConfirmDialog
      </h2>
      <div>
        <M3Button tone="error" variant="outlined" @click="confirmOpen = true">
          Stop the server
        </M3Button>
      </div>
      <M3ConfirmDialog
        v-model="confirmOpen"
        title="Stop the server?"
        message="The players are disconnected at once."
        confirm-label="Stop"
        danger
        @confirm="snackbar.show('Server stopped')"
      />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        StatusChip
      </h2>
      <div class="flex flex-wrap items-center gap-2">
        <M3StatusChip v-for="tone in tones" :key="tone" :tone="tone" :label="tone" />
      </div>
    </section>
  </div>
</template>
