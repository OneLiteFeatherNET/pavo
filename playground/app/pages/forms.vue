<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const count = ref<number>(2)
const city = ref('berlin')
const tags = ref<string[]>(['vue'])
const terms = ref(false)
const notify = ref(true)
const size = ref('sm')
const upload = ref<File | null>(null)
const lastMenuAction = ref('none')

const cities = [
  { value: 'berlin', title: 'Berlin' },
  { value: 'paris', title: 'Paris' },
]
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-12">
    <h1 class="text-display-small text-on-surface">Form fields and menus</h1>

    <section class="flex flex-col gap-4">
      <M3TextField v-model="name" label="Name" hint="Shown below the field" clearable clear-label="Clear name" />
      <M3TextField v-model="name" label="Name with error" error="This field is required" />
      <M3TextField label="Disabled" model-value="Read only" disabled />
      <M3TextField v-model="count" type="number" label="Count" :counter="10" />
    </section>

    <section class="flex flex-col gap-4">
      <M3Select v-model="count" :items="[1, 2, 3]" label="Count (select)" hint="Numeric values stay numeric" />
      <M3Select v-model="city" :items="cities" label="City" error="Choose a city" />
      <M3Select v-model="city" :items="cities" label="City (disabled)" disabled />
      <M3Combobox v-model="tags" label="Tags" hint="Press Enter to add" remove-label="Remove tag" />
    </section>

    <section class="flex flex-col gap-3">
      <M3Checkbox v-model="terms" aria-label="Accept the terms">
        Accept the terms
      </M3Checkbox>
      <M3Switch v-model="notify">
        Notify me
      </M3Switch>
      <M3Switch :model-value="true" disabled>
        Disabled switch
      </M3Switch>
      <M3RadioGroup
        v-model="size"
        legend="Size"
        :options="[{ value: 'sm', label: 'Small' }, { value: 'lg', label: 'Large' }]"
      />
    </section>

    <section class="flex flex-col gap-4">
      <M3FileInput label="Choose a file" accept=".csv,.png" @change="(f: File | null) => (upload = f)" />
      <p class="text-body-medium text-on-surface-variant">Chosen: {{ upload?.name ?? 'nothing' }}</p>
    </section>

    <section class="flex flex-col gap-4">
      <M3Menu label="Actions">
        <template #activator="{ props, toggle }">
          <button
            type="button"
            v-bind="props"
            class="rounded-full border border-outline px-6 py-2 text-label-large text-primary"
            @click="toggle"
          >
            Open actions
          </button>
        </template>
        <template #default="{ close }">
          <M3MenuItem icon="mdi-check" @click="() => { lastMenuAction = 'approve'; close() }">
            Approve
          </M3MenuItem>
          <M3MenuItem icon="mdi-delete-outline" @click="() => { lastMenuAction = 'delete'; close() }">
            Delete
          </M3MenuItem>
          <M3MenuItem :selected="true">
            Selected item
          </M3MenuItem>
        </template>
      </M3Menu>
      <p class="text-body-medium text-on-surface-variant">Last action: {{ lastMenuAction }}</p>
    </section>
  </main>
</template>
