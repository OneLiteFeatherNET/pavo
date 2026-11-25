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
export { PAVO_LINK, useLinkComponent } from './lib/link'
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

// Components: form fields and menus (TextField, Select, Switch, Menu, ...)
export { default as M3TextField } from './components/TextField.vue'
export { default as M3FieldFrame } from './components/FieldFrame.vue'
export { default as M3Select } from './components/Select.vue'
export { default as M3Combobox } from './components/Combobox.vue'
export { default as M3Checkbox } from './components/Checkbox.vue'
export { default as M3RadioGroup } from './components/RadioGroup.vue'
export { default as M3Switch } from './components/Switch.vue'
export { default as M3FileInput } from './components/FileInput.vue'
export { default as M3Menu } from './components/Menu.vue'
export { default as M3MenuItem } from './components/MenuItem.vue'

// Components: navigation and data
export { default as M3DataTable } from './components/DataTable.vue'
export { default as M3NavDrawer } from './components/NavDrawer.vue'
export { default as M3NavItem } from './components/NavItem.vue'
export { default as M3TopAppBar } from './components/TopAppBar.vue'
export type { Column as DataTableColumn } from './components/DataTable.vue'
export type { TableLabels } from './lib/table-labels'

// Components: layout (AppFrame, PageHeader, Problem, ConfirmDialog, StatusChip)
