<script setup lang="ts">
interface Player {
  id: string
  name: string
  rank: string
  points: number
  joined: string
}

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Navigation', to: '/navigation', icon: 'mdi-menu' },
  { label: 'Repository', to: 'https://github.com/OneLiteFeatherNET/pavo', icon: 'mdi-information-outline' },
]

const route = useRoute()
const modalOpen = ref(false)

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'rank', title: 'Rank' },
  { key: 'points', title: 'Points', align: 'end' as const },
  { key: 'joined', title: 'Joined' },
]

const ranks = ['Owner', 'Admin', 'Moderator', 'Member']
const players: Player[] = Array.from({ length: 25 }, (_, i) => ({
  id: `player-${i + 1}`,
  name: `Player ${String(i + 1).padStart(2, '0')}`,
  rank: ranks[i % ranks.length]!,
  points: (i * 137) % 900,
  joined: `2026-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, '0')}`,
}))
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface text-on-surface">
    <div class="flex flex-1 gap-6">
      <div class="hidden md:block">
        <M3NavDrawer :items="navItems" :active-path="route.path" label="Main" />
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-6 px-4 py-8">
        <h1 class="text-display-small">Navigation and data</h1>
        <p class="text-body-large text-on-surface-variant">
          The drawer above is the standard variant (from 768 px up). Below that, the button opens the modal variant.
        </p>

        <div>
          <button
            type="button"
            class="rounded-full bg-primary px-6 py-3 text-label-large text-on-primary"
            @click="modalOpen = true"
          >
            Open modal drawer
          </button>
        </div>

        <M3DataTable :columns="columns" :items="players" row-key="id" />
      </div>
    </div>

    <M3NavDrawer
      v-model:open="modalOpen"
      :items="navItems"
      :active-path="route.path"
      label="Main"
      modal
    />
  </div>
</template>
