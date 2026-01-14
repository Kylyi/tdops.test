import type { IQueryBuilderRow, ITableSortItem, TableColumn } from '$ui'
import { ComparatorEnum } from '$comparatorEnum'
import { tableSerializeFilters } from '~/libs/GentlUiWrapper/Table/modifiers/table-serialize-filters'
import { tableSerializeSelect } from '~/libs/GentlUiWrapper/Table/modifiers/table-serialize-select'
import { tableSerializeSorting } from '~/libs/GentlUiWrapper/Table/modifiers/table-serialize-sorting'

export function tableBuildFetchPayload(payload: {
  columns: TableColumn[]
  queryBuilder: IQueryBuilderRow[]
  search: string
  pagination: { skip: number, take: number }
  orderBy?: ITableSortItem[]
  fetchMore?: { lastRow: IItem, hasMore: boolean }
  queryParams?: URLSearchParams
  getStore: () => any

  /**
   * Whether to include fields that are marked as `alwaysSelected` or
   * as part of the `needsFields` of a column
   *
   * NOTE: This gets passed to the `tableSerializeSelect` function
   */
  includeInvisible?: boolean
}) {
  const {
    columns,
    fetchMore,
    queryBuilder,
    search,
    pagination,
    orderBy,
    includeInvisible = true,
    getStore,
  } = payload

  const columnFilters = columns.flatMap(col => col.filterDbQuery)

  const { rowKey } = getStore()
  const urlParams = new URLSearchParams()

  // Query builder
  if (queryBuilder.length) {
    // We remove empty groups
    let _queryBuilderTrimmed = tableSerializeFilters(queryBuilder)

    // Regular expression to match and() or or() substrings
    const regex = /and\(\)|or\(\)/g

    let prevResult: string
    do {
      prevResult = _queryBuilderTrimmed
      // Replace matched substrings with an empty string
      _queryBuilderTrimmed = _queryBuilderTrimmed.replace(regex, '')

      // To also remove consecutive commas resulting from the removal, use another regex replacement
      _queryBuilderTrimmed = _queryBuilderTrimmed.replace(/,{2,}/g, ',')

      // Remove trailing commas within parentheses
      _queryBuilderTrimmed = _queryBuilderTrimmed.replace(/,(?=\))/g, '')

      // If comma starts or ends the string, remove it.
      _queryBuilderTrimmed = _queryBuilderTrimmed.replace(/^,|,$/g, '')
    } while (prevResult !== _queryBuilderTrimmed) // Continue as long as changes are being made

    if (_queryBuilderTrimmed.length) {
      const firstBracket = _queryBuilderTrimmed.indexOf('(')
      const condition = _queryBuilderTrimmed.substring(0, firstBracket)
      const content = _queryBuilderTrimmed.substring(
        firstBracket + 1,
        _queryBuilderTrimmed.length - 1,
      )

      urlParams.append(condition, `(${content})`)
    }
  }

  // Column filters
  if (columnFilters?.length) {
    columnFilters.forEach(filter => {
      // We don't need the value when using the ComparatorEnum.IS_EMPTY and ComparatorEnum.NOT_IS_EMPTY comparators
      const EMPTY_COMPARATORS = [
        ComparatorEnum.IS_EMPTY,
        ComparatorEnum.NOT_IS_EMPTY,
      ]

      if (EMPTY_COMPARATORS.includes(filter.comparator)) {
        urlParams.append(filter.field, filter.comparator)
        return
      }

      const isNestedField = filter.filterField?.includes('.')

      const INCLUSION_COMPARATORS = [
        ComparatorEnum.INCLUDES,
        ComparatorEnum.EXCLUDES,
      ]

      if (!isNestedField && INCLUSION_COMPARATORS.includes(filter.comparator)) {
        urlParams.append(filter.field, `${filter.comparator}(${filter.value})`)
        return
      }

      if (isNestedField) {
        const [field = '', filterValue = ''] = tableSerializeFilters([filter]).split('=')

        urlParams.append(field, filterValue)
      }
      else {
        urlParams.append(filter.field, `${filter.comparator}.${filter.value}`)
      }
    })
  }

  // Select
  const select = tableSerializeSelect({ columns, includeInvisible })
  urlParams.append('select', select)

  // Sorting
  const sorting = tableSerializeSorting({ columns, rowKey, lastRow: fetchMore?.lastRow })

  const paging: string[] = [
    'limit.100',
    ...(orderBy?.length || fetchMore
      ? [`sort(${sorting})`]
      : []),
    ...(!fetchMore ? ['count.true'] : []),
  ]

  urlParams.append('paging', `(${paging.join(',')})`)

  return {
    tableData: {
      columns,
      queryBuilder,
      search,
      pagination,
      columnFilters,
      orderBy,
    },
    queryParams: urlParams,
    fetchMore,
    getStore,
  }
}
