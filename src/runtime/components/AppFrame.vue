<template>
  <div class="min-h-screen">
    <a
      class="absolute -top-16 left-2 z-[70] rounded-full bg-primary px-4 py-2 text-on-primary focus:top-2"
      href="#main"
      @click.prevent="focusMain"
    >{{ skipText }}</a>

    <M3TopAppBar>
      <template #leading>
        <M3IconButton
          v-if="!isDesktop"
          icon="mdi-menu"
          :label="menuText"
          :aria-expanded="String(drawerOpen)"
          @click="drawerOpen = true"
        />
      </template>
      <template #title>
        <slot name="title">
          <span class="text-title-large">{{ appName }}</span>
        </slot>
      </template>
      <template #actions>
        <slot name="actions" />
        <M3IconButton
          v-if="showLanguage"
          icon="mdi-translate"
          :label="languageText"
          @click="emit('toggle-language')"
        />
        <M3IconButton
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          :label="themeText"
          @click="toggle"
        />
      </template>
    </M3TopAppBar>

    <div class="flex">
      <M3NavDrawer
        v-if="isDesktop"
        class="sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto"
        :items="items"
        :active-path="activePath"
        :label="navigationText"
      />
      <M3NavDrawer
        v-else
        v-model:open="drawerOpen"
        modal
        :items="items"
        :active-path="activePath"
        :label="navigationText"
        :close-label="closeText"
      />
      <main id="main" ref="mainEl" tabindex="-1" class="min-w-0 flex-1 px-4 py-6 outline-none md:px-6">
        <div class="max-w-[88rem]">
          <slot />
        </div>
      </main>
    </div>

    <M3Snackbar :message="snackbarMessage" :close-label="closeText" @dismiss="dismissSnackbar" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useColorTheme } from '../composables/useColorTheme'
import { useMediaQuery } from '../composables/useMediaQuery'
import { usePavoText } from '../composables/usePavoText'
import { useSnackbar } from '../composables/useSnackbar'
import type { NavEntry } from '../lib/types'
import M3IconButton from './IconButton.vue'
import M3NavDrawer from './NavDrawer.vue'
import M3Snackbar from './Snackbar.vue'
import M3TopAppBar from './TopAppBar.vue'

/**
 * Page frame of an app: top app bar, navigation, skip link and the main landmark, plus the app-wide snackbar.
 * Below 1024px the navigation is a modal sheet behind the menu button. The theme toggle is built in; the language
 * toggle is shown only with `showLanguage` and emits `toggle-language`, the app switches its locale itself.
 * Every text has a prop; an empty prop falls back to the built-in text.
 */
const props = withDefaults(defineProps<{
  items: readonly NavEntry[]
  activePath: string
  appName?: string
  showLanguage?: boolean
  skipLabel?: string
  menuLabel?: string
  navigationLabel?: string
  closeLabel?: string
  languageLabel?: string
  lightThemeLabel?: string
  darkThemeLabel?: string
}>(), {
  appName: '',
  showLanguage: false,
  skipLabel: '',
  menuLabel: '',
  navigationLabel: '',
  closeLabel: '',
  languageLabel: '',
  lightThemeLabel: '',
  darkThemeLabel: '',
})
const emit = defineEmits<{ 'toggle-language': [] }>()

const t = usePavoText()
const skipText = computed(() => props.skipLabel || t('skipToContent'))
const menuText = computed(() => props.menuLabel || t('menu'))
const navigationText = computed(() => props.navigationLabel || t('navigation'))
const closeText = computed(() => props.closeLabel || t('close'))
const languageText = computed(() => props.languageLabel || t('language'))
const themeText = computed(() => {
  if (isDark.value) return props.lightThemeLabel || t('lightTheme')
  return props.darkThemeLabel || t('darkTheme')
})

// Starts false on the server and on the first client render, so the markup matches before the query is known.
const isDesktop = useMediaQuery('(min-width: 1024px)')
const drawerOpen = ref(false)

const { isDark, toggle, restore } = useColorTheme()
// The stored theme choice is only known in the browser; restoring it after mount avoids a hydration mismatch.
onMounted(restore)

const { message: snackbarMessage, dismiss: dismissSnackbar } = useSnackbar()

const mainEl = ref<HTMLElement>()

// After a navigation, focus moves to the new page so keyboard and screen reader users start at the content.
watch(() => props.activePath, () => {
  drawerOpen.value = false
  void nextTick(focusMain)
})

function focusMain() {
  mainEl.value?.focus({ preventScroll: true })
}
</script>
