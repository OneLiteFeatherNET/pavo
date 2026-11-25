<script setup lang="ts">
const pages = [
  { to: '/actions', title: 'Actions and feedback', text: 'Buttons, icon buttons, chips, alerts, progress, dialogs and the snackbar.' },
  { to: '/forms', title: 'Forms', text: 'Text fields, selects, checkboxes, switches, radio groups and file input.' },
  { to: '/navigation', title: 'Navigation and data', text: 'The navigation drawer in both variants and the data table.' },
  { to: '/layout', title: 'Layout', text: 'Page header, problems, confirmation dialogs and status chips.' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <M3PageHeader
      title="Pavo playground"
      subtitle="Every component of Pavo, one page per group. The bar above holds the theme and language toggles."
    />
    <div class="grid gap-4 sm:grid-cols-2">
      <M3Card v-for="page in pages" :key="page.to" variant="outlined" :title="page.title" :to="page.to">
        <p class="text-body-medium text-on-surface-variant">
          {{ page.text }}
        </p>
      </M3Card>
    </div>
  </div>
</template>
