import type { Tone } from './types'

export type { Tone } from './types'

/** Container colours per tone. `info` uses the tertiary roles, because M3 has no separate info colour. */
export const TONE_CLASSES: Readonly<Record<Tone, string>> = {
  neutral: 'bg-surface-container-high text-on-surface',
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-tertiary-container text-on-tertiary-container',
}

/** Solid colours for a filled indicator (a dot, a progress bar) per tone. */
export const TONE_SOLID_CLASSES: Readonly<Record<Tone, string>> = {
  neutral: 'bg-outline',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-tertiary',
}

/** Default icon per tone, from the icon registry. `neutral`, `primary`, `secondary` and `tertiary` show no icon by default. */
export const TONE_ICONS: Readonly<Record<Tone, string>> = {
  neutral: '',
  primary: '',
  secondary: '',
  tertiary: '',
  success: 'mdi-check-circle-outline',
  warning: 'mdi-alert-outline',
  error: 'mdi-alert-circle-outline',
  info: 'mdi-information-outline',
}
