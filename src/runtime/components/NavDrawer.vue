<template>
  <nav v-if="!modal" :aria-label="navLabel" class="w-72 shrink-0 px-3 py-3">
    <ul class="flex flex-col gap-1">
      <li v-for="item in items" :key="item.key ?? item.to">
        <M3NavItem :item="item" :active="isActive(item.to)" />
      </li>
    </ul>
  </nav>
  <dialog
    v-else
    ref="el"
    :aria-label="navLabel"
    class="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(20rem,85vw)] flex-col rounded-r-xl bg-surface-container-low p-3 text-on-surface shadow-elevation-3 open:flex backdrop:bg-scrim/32"
    @cancel.prevent="emit('update:open', false)"
    @click="onBackdrop"
    @close="emit('update:open', false)"
  >
    <div class="mb-2 flex items-center justify-between px-2">
      <slot name="header" />
      <button
        type="button"
        class="state-layer ms-auto inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant"
        :aria-label="closeText"
        @click="emit('update:open', false)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" class="size-6 fill-current">
          <path :d="iconPath('mdi-close')" />
        </svg>
      </button>
    </div>
    <nav :aria-label="navLabel">
      <ul class="flex flex-col gap-1">
        <li v-for="item in items" :key="item.key ?? item.to">
          <M3NavItem :item="item" :active="isActive(item.to)" @click="emit('update:open', false)" />
        </li>
      </ul>
    </nav>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { iconPath } from '../lib/icons'
import type { NavEntry } from '../lib/types'
import { usePavoText } from '../composables/usePavoText'
import M3NavItem from './NavItem.vue'

/**
 * Navigation of an app. The standard variant is a permanent column; `modal` turns it into a sheet on a native
 * <dialog>, which closes on Esc, on a click on the scrim, on the close button and when an entry is chosen.
 */
const props = withDefaults(defineProps<{
  items: readonly NavEntry[]
  /** Current route path. The entry for it, and for its nested routes, is marked with aria-current="page". */
  activePath: string
  /** Accessible name of the navigation landmark. Empty falls back to the built-in text. */
  label?: string
  /** Accessible name of the close button of the modal variant. Empty falls back to the built-in text. */
  closeLabel?: string
  modal?: boolean
  open?: boolean
}>(), { label: '', closeLabel: '', modal: false, open: false })
const emit = defineEmits<{ 'update:open': [boolean] }>()

const t = usePavoText()
const navLabel = computed(() => props.label || t('navigation'))
const closeText = computed(() => props.closeLabel || t('close'))

const el = ref<HTMLDialogElement>()

// The root path '/' matches only itself; every other entry also matches its nested routes ('/models' -> '/models/x').
function isActive(to: string): boolean {
  if (to === '/') return props.activePath === '/'
  return props.activePath === to || props.activePath.startsWith(`${to}/`)
}

function sync(open: boolean) {
  const d = el.value
  if (!d) return
  if (open && !d.open) d.showModal()
  else if (!open && d.open) d.close()
}
watch(() => [props.open, props.modal], async () => {
  await nextTick()
  sync(props.open && props.modal)
})
onMounted(() => sync(props.open && props.modal))

// A click on the dialog element itself lands on the scrim; clicks inside the sheet have a child as target.
function onBackdrop(e: MouseEvent) {
  if (e.target === el.value) emit('update:open', false)
}
</script>
