import type { ITableSortItem, TableColumn } from '$ui'

/**
 * Serializes the sorting from the internal structure to the URL
 *
 * You can provide either `columns` or `sortItems`
 */
export function tableSerializeSorting(payload: {
  columns?: TableColumn[]
  sortItems?: ITableSortItem[]
  rowKey: string
  lastRow?: IItem
}): string {
  const { columns = [], sortItems, lastRow, rowKey } = payload
  const $key = get(lastRow, toValue(rowKey))

  const _sortItems = sortItems ?? columns
    .flatMap(col => col.sortDbQuery)
    .filter(Boolean)
    .toSorted((a, b) => (a!.sortOrder || 0) - (b!.sortOrder || 0)) as ITableSortItem[]

  let orderByString = ''
  orderByString = _sortItems
    .map(sort => {
      if (sort.field === $key) {
        return `${sort.field}.${sort.direction}.${$key}`
      } else if (lastRow) {
        const fieldValue = get(lastRow, sort.field)
        const val = fieldValue || (fieldValue === null ? '$null' : '$empty')

        return `${sort.field}.${sort.direction}.${val}`
      }

      return `${sort.field}.${sort.direction}`
    })
    .join(',')

  if (!orderByString && lastRow) {
    orderByString += `${rowKey}.asc.${$key},$key.${$key}`
  } else if (lastRow) {
    orderByString += `,$key.${$key}`
  }

  return orderByString
}
