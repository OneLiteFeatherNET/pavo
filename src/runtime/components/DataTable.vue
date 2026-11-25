<template>
  <div class="overflow-hidden rounded-md border border-outline-variant bg-surface">
    <p v-if="loading" role="status" class="px-4 py-2 text-body-small text-on-surface-variant">{{ text.loading }}</p>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-body-medium">
        <thead>
          <tr class="bg-surface-container text-on-surface-variant">
            <th v-if="selectable" scope="col" class="w-12 px-2">
              <span class="sr-only">{{ text.select }}</span>
            </th>
            <th
              v-for="c in columns"
              :key="c.key"
              scope="col"
              :aria-sort="ariaSort(c)"
              :class="['h-12 whitespace-nowrap px-4 text-title-small', c.align === 'end' ? 'text-end' : 'text-start']"
            >
              <button
                v-if="c.sortable !== false && c.title"
                type="button"
                :class="['state-layer -mx-2 inline-flex items-center gap-1 rounded-sm px-2 py-1', c.align === 'end' ? 'flex-row-reverse' : '']"
                :aria-label="`${c.title}: ${nextSortText(c.key)}`"
                @click="toggleSort(c.key)"
              >
                {{ c.title }}
                <svg
                  v-if="sortKey === c.key"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  class="size-4 fill-current"
                >
                  <path :d="iconPath(sortDescending ? 'mdi-arrow-down' : 'mdi-arrow-up')" />
                </svg>
              </button>
              <template v-else>{{ c.title }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in pageRows"
            :key="String(val(row, rowKey))"
            v-bind="rowAttrs ? rowAttrs(row) : {}"
            class="border-t border-outline-variant hover:bg-on-surface/8"
          >
            <td v-if="selectable" class="w-12 px-2">
              <input
                type="checkbox"
                class="size-4 accent-primary"
                :checked="isSelected(row)"
                :aria-label="text.select"
                @change="toggleRow(row, ($event.target as HTMLInputElement).checked)"
              >
            </td>
            <td
              v-for="c in columns"
              :key="c.key"
              :class="['px-4 py-3 align-middle', c.align === 'end' ? 'text-end' : 'text-start']"
            >
              <slot :name="`item.${c.key}`" :item="row" :value="val(row, c.key)">{{ val(row, c.key) ?? '' }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!items.length && !loading" class="px-4 py-8 text-center text-body-medium text-on-surface-variant">
        {{ text.empty }}
      </p>
    </div>
    <div
      v-if="paginate && items.length > pageSizes[0]!"
      class="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 border-t border-outline-variant px-4 py-1 text-body-small text-on-surface-variant"
    >
      <label class="flex items-center gap-2">
        {{ text.rowsPerPage }}
        <select
          v-model.number="pageSize"
          class="h-8 rounded-xs border border-outline-variant bg-transparent px-1 text-body-small text-on-surface"
        >
          <option v-for="n in pageSizes" :key="n" :value="n" class="bg-surface-container-high">{{ n }}</option>
        </select>
      </label>
      <span aria-live="polite">{{ rangeText }}</span>
      <span class="flex">
        <button
          type="button"
          class="state-layer inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant disabled:opacity-[0.38]"
          :aria-label="text.previous"
          :disabled="page === 0"
          @click="page--"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="size-6 fill-current">
            <path :d="iconPath('mdi-chevron-left')" />
          </svg>
        </button>
        <button
          type="button"
          class="state-layer inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant disabled:opacity-[0.38]"
          :aria-label="text.next"
          :disabled="to >= sorted.length"
          @click="page++"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="size-6 fill-current">
            <path :d="iconPath('mdi-chevron-right')" />
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends object">
/**
 * Table for lists of objects with sorting, paging and row selection.
 *
 * Cell slots: a column renders its cell through the slot `item.<key>`, where `<key>` is the column key.
 * The slot receives `{ item, value }`; without the slot the raw value is shown.
 *
 * Sorting is internal by default. Pass `sortBy` (and `sortDesc`) to control it with
 * `v-model:sort-by` / `v-model:sort-desc`; the table then only emits on header clicks.
 * An empty `sortBy` means unsorted. `serverSort` keeps the given order (the parent sorts),
 * but aria-sort and the emits still work. A column's `sortValue` replaces `row[key]` for ordering.
 *
 * Paging: `paginate` (default true) and `pageSizes` (default 10, 25, 50, 100).
 * Without paging every row is rendered and no footer is shown.
 *
 * `rowAttrs` adds attributes or classes to each body row, e.g. `data-test`.
 */
import { computed, ref, watch } from 'vue'
import { usePavoText } from '../composables/usePavoText'
import { iconPath } from '../lib/icons'
import type { TableLabels } from '../lib/table-labels'

export interface Column<R extends object = object> {
  key: string
  title: string
  align?: 'start' | 'end'
  /** Defaults to true; the actions column sets false. */
  sortable?: boolean
  /** Value used for ordering instead of `row[key]`, e.g. `(row) => Date.now() - row.createdAt`. */
  sortValue?: (row: R) => unknown
}
const val = (row: object, key: string): unknown => (row as Record<string, unknown>)[key]

const props = withDefaults(defineProps<{
  columns: readonly Column<T>[]
  items: readonly T[]
  rowKey?: string
  loading?: boolean
  /** Overrides single texts; an empty value keeps the built-in text. */
  labels?: Partial<TableLabels>
  selectable?: boolean
  selected?: readonly T[]
  /** Controlled sort column key; an empty string means unsorted. Omit to let the table sort itself. */
  sortBy?: string
  /** Controlled sort direction, used together with `sortBy`. */
  sortDesc?: boolean
  /** The parent delivers the items already sorted; the table does not reorder them. */
  serverSort?: boolean
  pageSizes?: readonly number[]
  paginate?: boolean
  /** Attributes or classes for each body row. */
  rowAttrs?: (row: T) => Record<string, unknown>
}>(), {
  rowKey: 'id',
  loading: false,
  labels: () => ({}),
  selectable: false,
  selected: () => [],
  sortBy: undefined,
  serverSort: false,
  pageSizes: () => [10, 25, 50, 100],
  paginate: true,
  rowAttrs: undefined,
})
const emit = defineEmits<{
  'update:selected': [T[]]
  'update:sortBy': [string]
  'update:sortDesc': [boolean]
}>()

const t = usePavoText()
const defaults = computed<TableLabels>(() => ({
  loading: t('loading'),
  empty: t('noData'),
  select: t('table.select'),
  sortAscending: t('table.sortAscending'),
  sortDescending: t('table.sortDescending'),
  rowsPerPage: t('table.rowsPerPage'),
  previous: t('table.previousPage'),
  next: t('table.nextPage'),
  range: t('table.range'),
}))
const text = computed<TableLabels>(() => {
  const overrides = Object.fromEntries(Object.entries(props.labels).filter(([, value]) => value))
  return { ...defaults.value, ...overrides }
})

const internalKey = ref('')
const internalDesc = ref(false)
const controlled = computed(() => props.sortBy !== undefined)
const sortKey = computed(() => (controlled.value ? props.sortBy ?? '' : internalKey.value))
const sortDescending = computed(() => (controlled.value ? props.sortDesc === true : internalDesc.value))
const page = ref(0)
const pageSize = ref(props.pageSizes[0]!)

function toggleSort(key: string) {
  let nextKey = sortKey.value
  let nextDesc = sortDescending.value
  if (sortKey.value !== key) {
    nextKey = key
    nextDesc = false
  }
  else if (!nextDesc) {
    nextDesc = true
  }
  else {
    nextKey = ''
    nextDesc = false
  }
  if (!controlled.value) {
    internalKey.value = nextKey
    internalDesc.value = nextDesc
  }
  emit('update:sortBy', nextKey)
  emit('update:sortDesc', nextDesc)
}
// The next click on a column sorts it the other way round, so the button label names that direction.
function nextSortText(key: string): string {
  return sortKey.value === key && !sortDescending.value ? text.value.sortDescending : text.value.sortAscending
}
function ariaSort(c: Column<T>): 'ascending' | 'descending' | 'none' | undefined {
  if (c.sortable === false || !c.title) return undefined
  return sortKey.value === c.key ? (sortDescending.value ? 'descending' : 'ascending') : 'none'
}

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}
const sorted = computed(() => {
  if (props.serverSort || !sortKey.value) return [...props.items]
  const k = sortKey.value
  const column = props.columns.find(c => c.key === k)
  const read = (row: T) => (column?.sortValue ? column.sortValue(row) : val(row, k))
  const dir = sortDescending.value ? -1 : 1
  return [...props.items].sort((x, y) => dir * compare(read(x), read(y)))
})

const from = computed(() => (sorted.value.length ? page.value * pageSize.value + 1 : 0))
const to = computed(() => Math.min(sorted.value.length, (page.value + 1) * pageSize.value))
const pageRows = computed(() => (props.paginate
  ? sorted.value.slice(page.value * pageSize.value, (page.value + 1) * pageSize.value)
  : sorted.value))
const rangeText = computed(() => text.value.range
  .replace('{from}', String(from.value))
  .replace('{to}', String(to.value))
  .replace('{total}', String(sorted.value.length)))

// New data or a new page size can leave the current page past the end.
watch([() => props.items, pageSize], () => {
  const last = Math.max(0, Math.ceil(sorted.value.length / pageSize.value) - 1)
  if (page.value > last) page.value = last
})
watch(pageSize, () => (page.value = 0))

const isSelected = (row: T) => props.selected.some(s => val(s, props.rowKey) === val(row, props.rowKey))
function toggleRow(row: T, on: boolean) {
  const rest = props.selected.filter(s => val(s, props.rowKey) !== val(row, props.rowKey))
  emit('update:selected', on ? [...rest, row] : rest)
}
</script>
