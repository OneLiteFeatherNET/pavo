<script setup lang="ts">
const route = useRoute()
const { locale, setLocale } = useI18n()

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Actions', to: '/actions' },
  { label: 'Forms', to: '/forms' },
  { label: 'Navigation', to: '/navigation' },
  { label: 'Layout', to: '/layout' },
]

function toggleLanguage() {
  void setLocale(locale.value === 'de' ? 'en' : 'de')
}
</script>

<template>
  <M3AppFrame
    app-name="Pavo"
    :items="navItems"
    :active-path="route.path"
    show-language
    @toggle-language="toggleLanguage"
  >
    <NuxtPage />
  </M3AppFrame>
</template>
