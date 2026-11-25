// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import M3DataTable from './DataTable.vue'

const labels = {
  loading: 'Loading', empty: 'Nothing here', select: 'Select row', sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending', rowsPerPage: 'Rows per page', previous: 'Previous page', next: 'Next page',
  range: '{from}-{to} of {total}',
}
const columns = [
  { key: 'name', title: 'Name' },
  { key: 'size', title: 'Size', align: 'end' as const },
  { key: 'actions', title: '', sortable: false },
]
// Names count down (n22 first), so the given order differs from the ascending order.
const items = Array.from({ length: 23 }, (_, i) => ({ id: `r${i}`, name: `n${String(22 - i).padStart(2, '0')}`, size: i }))

const table = (props: Record<string, unknown> = {}) => mount(M3DataTable, { props: { columns, items, labels, ...props } })
const names = (w: ReturnType<typeof table>) => w.findAll('tbody tr').map(r => r.findAll('td')[0]!.text())
const sortButton = (w: ReturnType<typeof table>) => w.get('thead button')
const nextPage = (w: ReturnType<typeof table>) => w.get('button[aria-label="Next page"]')
const previousPage = (w: ReturnType<typeof table>) => w.get('button[aria-label="Previous page"]')

describe('M3DataTable', () => {
  it('shows the first ten rows and the range', () => {
    const w = table()
    expect(w.findAll('tbody tr')).toHaveLength(10)
    expect(w.text()).toContain('1-10 of 23')
  })

  it('moves to the next page', async () => {
    const w = table()
    await nextPage(w).trigger('click')
    expect(w.text()).toContain('11-20 of 23')
  })

  it('moves back to the previous page', async () => {
    const w = table()
    await nextPage(w).trigger('click')
    await previousPage(w).trigger('click')
    expect(w.text()).toContain('1-10 of 23')
  })

  it('disables previous on the first page', () => {
    expect(previousPage(table()).attributes('disabled')).toBeDefined()
  })

  it('disables next on the last page', async () => {
    const w = table()
    await nextPage(w).trigger('click')
    await nextPage(w).trigger('click')
    expect(w.text()).toContain('21-23 of 23')
    expect(nextPage(w).attributes('disabled')).toBeDefined()
  })

  it('shows every row when the page size is raised', async () => {
    const w = table()
    await w.get('select').setValue('25')
    expect(w.findAll('tbody tr')).toHaveLength(23)
  })

  it('sorts a column ascending on the first click', async () => {
    const w = table({ items: items.slice(0, 3) })
    await sortButton(w).trigger('click')
    expect(names(w)).toEqual(['n20', 'n21', 'n22'])
    expect(w.findAll('th')[0]!.attributes('aria-sort')).toBe('ascending')
  })

  it('sorts a column descending on the second click', async () => {
    const w = table({ items: items.slice(0, 3) })
    await sortButton(w).trigger('click')
    await sortButton(w).trigger('click')
    expect(names(w)).toEqual(['n22', 'n21', 'n20'])
    expect(w.findAll('th')[0]!.attributes('aria-sort')).toBe('descending')
  })

  it('restores the given order on the third click', async () => {
    const w = table({ items: items.slice(0, 3) })
    await sortButton(w).trigger('click')
    await sortButton(w).trigger('click')
    await sortButton(w).trigger('click')
    expect(names(w)).toEqual(['n22', 'n21', 'n20'])
    expect(w.findAll('th')[0]!.attributes('aria-sort')).toBe('none')
  })

  it('names the next sort direction in the sort button label', () => {
    expect(sortButton(table()).attributes('aria-label')).toBe('Name: Sort ascending')
  })

  it('offers no sorting for a column marked as not sortable', () => {
    expect(table().findAll('th')[2]!.attributes('aria-sort')).toBeUndefined()
  })

  it('renders the cell slot of a column', () => {
    const w = mount(M3DataTable, {
      props: { columns, items: items.slice(0, 1), labels },
      slots: { 'item.name': '<template #item.name="{ item }">[{{ item.name }}]</template>' },
    })
    expect(w.get('td').text()).toBe('[n22]')
  })

  it('shows the empty text and no pagination without rows', () => {
    const w = table({ items: [] })
    expect(w.text()).toContain('Nothing here')
    expect(w.find('select').exists()).toBe(false)
  })

  it('selects a row with its checkbox', async () => {
    const w = table({ selectable: true, items: items.slice(0, 3) })
    await w.findAll('tbody input[type=checkbox]')[1]!.setValue(true)
    expect(w.emitted('update:selected')?.[0]).toEqual([[items[1]]])
  })

  it('uses the built-in German texts when no label is given', () => {
    const w = mount(M3DataTable, { props: { columns, items: [] } })
    expect(w.text()).toContain('Noch nichts vorhanden')
  })
})
