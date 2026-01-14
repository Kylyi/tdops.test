import { ComparatorEnum } from '$comparatorEnum'

// Types
import type { IQueryBuilderRow, ITableProps, TableColumn } from '$ui'

// Functions
import { tableSerializeFilters } from '~/libs/GentlUiWrapper/Table/modifiers/table-serialize-filters'
import { tableSerializeSelect } from '~/libs/GentlUiWrapper/Table/modifiers/table-serialize-select'
import { tableSerializeSorting } from '~/libs/GentlUiWrapper/Table/modifiers/table-serialize-sorting'

export function tableCreateSchema(payload: {
  columns: TableColumn[]
  queryBuilder: IQueryBuilderRow[]
  modifiers?: ITableProps['modifiers']
}) {
  const { queryBuilder, columns, modifiers } = payload
  const {
    serializeFilters = tableSerializeFilters,
    serializeSorting = tableSerializeSorting,
    serializeSelectedColumns = tableSerializeSelect,
  } = modifiers ?? {}

  const urlParams = new URLSearchParams()
  const columnFilters = columns.flatMap(col => col.filterDbQuery)

  // Query builder
  if (queryBuilder.length) {
    // We remove empty groups
    let _queryBuilderTrimmed = serializeFilters(queryBuilder)

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

      if (isNestedField) {
        const [field = '', filterValue = ''] = tableSerializeFilters([filter]).split('=')

        urlParams.append(field, filterValue)
      } else {
        urlParams.append(filter.field, `${filter.comparator}.${filter.value}`)
      }
    })
  }

  // Select
  const select = serializeSelectedColumns({ columns, includeInvisible: false })
  urlParams.append('select', select)

  // Sorting
  const sorting = serializeSorting({
    columns,

    // Doesn't matter, is not used
    rowKey: 'id',
  })

  if (sorting) {
    urlParams.append('paging', `(sort(${sorting}))`)
  }

  return urlParams
}
