import {
  mdiAlertCircleOutline,
  mdiAlertOutline,
  mdiArrowDown,
  mdiArrowUp,
  mdiCheck,
  mdiCheckCircleOutline,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronUp,
  mdiClose,
  mdiDeleteOutline,
  mdiDotsVertical,
  mdiInformationOutline,
  mdiMagnify,
  mdiMenu,
  mdiTranslate,
  mdiTrayFull,
  mdiUnfoldMoreHorizontal,
  mdiUpload,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js'

/** SVG paths (24x24 viewBox) of the icons Pavo's own components use, keyed by Material Design Icons name. */
const BUILT_IN: Record<string, string> = {
  'mdi-alert-circle-outline': mdiAlertCircleOutline,
  'mdi-alert-outline': mdiAlertOutline,
  'mdi-arrow-down': mdiArrowDown,
  'mdi-arrow-up': mdiArrowUp,
  'mdi-check': mdiCheck,
  'mdi-check-circle-outline': mdiCheckCircleOutline,
  'mdi-chevron-down': mdiChevronDown,
  'mdi-chevron-left': mdiChevronLeft,
  'mdi-chevron-right': mdiChevronRight,
  'mdi-chevron-up': mdiChevronUp,
  'mdi-close': mdiClose,
  'mdi-delete-outline': mdiDeleteOutline,
  'mdi-dots-vertical': mdiDotsVertical,
  'mdi-information-outline': mdiInformationOutline,
  'mdi-magnify': mdiMagnify,
  'mdi-menu': mdiMenu,
  'mdi-translate': mdiTranslate,
  'mdi-tray-full': mdiTrayFull,
  'mdi-unfold-more-horizontal': mdiUnfoldMoreHorizontal,
  'mdi-upload': mdiUpload,
  'mdi-weather-night': mdiWeatherNight,
  'mdi-weather-sunny': mdiWeatherSunny,
}

const registry = new Map<string, string>(Object.entries(BUILT_IN))

/** Adds or replaces icons. The consumer registers the icons its own pages need, for example in a plugin. */
export function registerIcons(icons: Readonly<Record<string, string>>): void {
  for (const [name, path] of Object.entries(icons)) registry.set(name, path)
}

/**
 * The SVG path for an icon name. A registered name gives its path; a string that already looks like an SVG path
 * (starts with M or m followed by a digit or a space) is returned as it is; anything else gives an empty string.
 */
export function iconPath(name: string): string {
  const known = registry.get(name)
  if (known !== undefined) return known
  return /^[Mm][\d\s]/.test(name) ? name : ''
}
