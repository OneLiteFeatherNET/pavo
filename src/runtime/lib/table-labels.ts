/** Texts of the data table. Each one is read from usePavoText unless the `labels` prop overrides it. */
export interface TableLabels {
  loading: string
  empty: string
  /** Accessible name of the row selection checkbox. */
  select: string
  sortAscending: string
  sortDescending: string
  rowsPerPage: string
  previous: string
  next: string
  /** Template with {from}, {to} and {total}. */
  range: string
}
