// Plain-Vue entry (`@onelitefeathernet/pavo/vue`). Everything here imports only from 'vue' and relative paths,
// so it also works outside Nuxt: pass the translator and theme yourself, or use the composables as they are.

// Composables
export { useColorTheme } from './composables/useColorTheme'
export type { ColorTheme } from './composables/useColorTheme'
export { useMediaQuery } from './composables/useMediaQuery'
export { useSnackbar } from './composables/useSnackbar'
export { usePavoText } from './composables/usePavoText'

// Helpers
export { iconPath, registerIcons } from './lib/icons'
export { useLinkComponent } from './lib/link'
export { parseTheme, resolveTheme, THEME_KEY } from './lib/theme'
export type { ThemeName } from './lib/theme'
export { TONE_CLASSES, TONE_ICONS, TONE_SOLID_CLASSES } from './lib/tones'
export {
  ApiError,
  NetworkError,
  problemFromBody,
  toClientError,
  toTransportError,
} from './lib/problem'
export type { ProblemDetails, ProblemError, TransportData, TransportError } from './lib/problem'
export type { NavEntry, Tone } from './lib/types'

// Components: actions and feedback (Button, Card, Chip, Dialog, ...)
export { default as M3Alert } from './components/Alert.vue'
export { default as M3Button } from './components/Button.vue'
export { default as M3Card } from './components/Card.vue'
export { default as M3Chip } from './components/Chip.vue'
export { default as M3Dialog } from './components/Dialog.vue'
export { default as M3EmptyState } from './components/EmptyState.vue'
export { default as M3Icon } from './components/Icon.vue'
export { default as M3IconButton } from './components/IconButton.vue'
export { default as M3Progress } from './components/Progress.vue'
export { default as M3Snackbar } from './components/Snackbar.vue'

// Components: form fields and menus (TextField, Select, Switch, Menu, ...)

// Components: navigation and data (NavDrawer, NavItem, TopAppBar, DataTable)

// Components: layout (AppFrame, PageHeader, Problem, ConfirmDialog, StatusChip)
