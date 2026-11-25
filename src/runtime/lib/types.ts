/** Semantic status colour of a component. Maps to the container roles of the theme (see tones.ts). */
export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'

/** One entry of a navigation drawer or bar. `to` is an app path (or URL) the link component navigates to. */
export interface NavEntry {
  label: string
  to: string
  /** Icon name from the icon registry, for example `mdi-view-dashboard-outline`. */
  icon?: string
  /** Stable key for the active state when two entries share a route. */
  key?: string
}
