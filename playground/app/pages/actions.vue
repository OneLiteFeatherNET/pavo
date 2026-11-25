<script setup lang="ts">
const dialogOpen = ref(false)
const alertDialogOpen = ref(false)
const snackbarMessage = ref('Changes saved')
const chips = ref(['rust', 'nuxt', 'vue'])
const progress = ref(40)
</script>

<template>
  <main class="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12">
    <h1 class="text-display-small text-on-surface">
      Actions and feedback
    </h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Button
      </h2>
      <div class="flex flex-wrap items-center gap-3">
        <M3Button>Filled</M3Button>
        <M3Button variant="tonal">
          Tonal
        </M3Button>
        <M3Button variant="outlined">
          Outlined
        </M3Button>
        <M3Button variant="text">
          Text
        </M3Button>
        <M3Button variant="elevated">
          Elevated
        </M3Button>
        <M3Button tone="error">
          Error
        </M3Button>
        <M3Button icon="mdi-upload">
          With icon
        </M3Button>
        <M3Button disabled>
          Disabled
        </M3Button>
        <M3Button loading loading-label="Saving">
          Loading
        </M3Button>
        <M3Button href="https://onelitefeather.net">
          Link
        </M3Button>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        IconButton
      </h2>
      <div class="flex flex-wrap items-center gap-3">
        <M3IconButton icon="mdi-menu" label="Menu" />
        <M3IconButton icon="mdi-magnify" label="Search" variant="filled" />
        <M3IconButton icon="mdi-translate" label="Language" variant="tonal" />
        <M3IconButton icon="mdi-delete-outline" label="Delete" variant="outlined" />
        <M3IconButton icon="mdi-weather-sunny" label="Pressed" :pressed="true" />
        <M3IconButton icon="mdi-close" label="Disabled" disabled />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Icon
      </h2>
      <div class="flex flex-wrap items-center gap-4 text-on-surface">
        <M3Icon name="mdi-check" />
        <M3Icon name="mdi-alert-outline" :size="32" label="Warning" />
        <M3Icon name="mdi-information-outline" :size="40" />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Card
      </h2>
      <M3Card title="Filled">
        <p class="text-body-medium text-on-surface-variant">
          A filled card with a title.
        </p>
      </M3Card>
      <M3Card variant="elevated">
        <p class="text-body-medium text-on-surface-variant">
          An elevated card without a title.
        </p>
      </M3Card>
      <M3Card variant="outlined" title="Outlined" href="https://onelitefeather.net">
        <p class="text-body-medium text-on-surface-variant">
          A card that is a link.
        </p>
      </M3Card>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Chip
      </h2>
      <div class="flex flex-wrap items-center gap-2">
        <M3Chip>Neutral</M3Chip>
        <M3Chip tone="primary">
          Primary
        </M3Chip>
        <M3Chip tone="success" icon="mdi-check-circle-outline">
          Success
        </M3Chip>
        <M3Chip tone="warning">
          Warning
        </M3Chip>
        <M3Chip tone="error" small>
          Error small
        </M3Chip>
        <M3Chip tone="info">
          Info
        </M3Chip>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <M3Chip
          v-for="chip in chips"
          :key="chip"
          tone="primary"
          removable
          :remove-label="`Remove ${chip}`"
          @remove="chips = chips.filter(c => c !== chip)"
        >
          {{ chip }}
        </M3Chip>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Alert
      </h2>
      <M3Alert tone="info" title="Information">
        A neutral note for the reader.
      </M3Alert>
      <M3Alert tone="success" title="Saved">
        The change is stored.
      </M3Alert>
      <M3Alert tone="warning" title="Almost full">
        The quota is at 90 percent.
      </M3Alert>
      <M3Alert tone="error" title="Failed">
        The request could not be completed.
      </M3Alert>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Progress
      </h2>
      <div class="flex flex-col gap-4">
        <M3Progress label="Indeterminate" />
        <M3Progress label="Determinate" :value="progress" />
        <div class="flex items-center gap-4">
          <M3Progress circular label="Circular indeterminate" />
          <M3Progress circular label="Circular determinate" :value="progress" />
        </div>
        <div class="flex gap-2">
          <M3Button variant="tonal" @click="progress = Math.max(0, progress - 10)">
            Less
          </M3Button>
          <M3Button variant="tonal" @click="progress = Math.min(100, progress + 10)">
            More
          </M3Button>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        EmptyState
      </h2>
      <M3EmptyState title="No projects yet">
        Create the first project to see it here.
      </M3EmptyState>
      <M3EmptyState title="Nothing matches" icon="mdi-magnify" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Snackbar
      </h2>
      <p class="text-body-medium text-on-surface-variant">
        The snackbar is fixed at the bottom of the page while a message is set.
      </p>
      <div class="flex gap-2">
        <M3Button variant="tonal" @click="snackbarMessage = 'Changes saved'">
          Show message
        </M3Button>
        <M3Button variant="tonal" @click="snackbarMessage = ''">
          Clear message
        </M3Button>
      </div>
      <M3Snackbar :message="snackbarMessage" close-label="Dismiss" @dismiss="snackbarMessage = ''" />
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-title-large text-on-surface">
        Dialog
      </h2>
      <div class="flex flex-wrap gap-2">
        <M3Button @click="dialogOpen = true">
          Open dialog
        </M3Button>
        <M3Button tone="error" variant="outlined" @click="alertDialogOpen = true">
          Open alert dialog
        </M3Button>
      </div>
      <M3Dialog v-model="dialogOpen" title="Add an entry" describedby="dialog-hint">
        <p id="dialog-hint" class="text-body-medium text-on-surface-variant">
          A plain modal dialog. Esc or a click on the scrim closes it.
        </p>
        <template #actions>
          <M3Button variant="text" @click="dialogOpen = false">
            Cancel
          </M3Button>
          <M3Button @click="dialogOpen = false">
            Save
          </M3Button>
        </template>
      </M3Dialog>
      <M3Dialog v-model="alertDialogOpen" title="Delete this entry?" width="sm" alert persistent>
        <p class="text-body-medium text-on-surface-variant">
          This cannot be undone. The dialog stays open on Esc.
        </p>
        <template #actions>
          <M3Button variant="text" @click="alertDialogOpen = false">
            Cancel
          </M3Button>
          <M3Button tone="error" @click="alertDialogOpen = false">
            Delete
          </M3Button>
        </template>
      </M3Dialog>
    </section>
  </main>
</template>
