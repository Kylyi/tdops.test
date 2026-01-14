import { isDayjs } from 'dayjs'
import { NON_VALUE_COMPARATORS } from '$utils'
import type {
  ITableFilterGroup,
  ITableFilterItem,
  ITableFilterRow,
} from '$ui'

export function tableSerializeFilters(filtersOrQueryBuilder: ITableFilterRow[]): string {
  return filtersOrQueryBuilder
    .map(row => {
      if ('isGroup' in row) {
        const condition = row.condition.toLowerCase()

        if (!row.children.length) {
          return undefined
        }

        const group = row as ITableFilterGroup

        return `${condition}(${tableSerializeFilters(group.children)})`
      } else {
        const item = row as ITableFilterItem
        let val: string | number = item.value

        // Non-value comparator
        const isNonValue = NON_VALUE_COMPARATORS.includes(item.comparator)
        if (isNonValue) {
          return `${item.field}.${item.comparator}`
        }

        if (isNil(val)) {
          return undefined
        }

        // Date
        if (isDayjs(item.value)) {
          val = item.value.format('YYYY-MM-DD')
        }

        // Array
        if (Array.isArray(item.value)) {
          val = `(${item.value.join(',')})`
        }

        // Special handling for nested fields
        if (item.filterField?.includes('.')) {
          const [field, subField] = item.filterField.split('.')

          return `${field}.with=(${subField}.${item.comparator}(${val}))`
        }

        // Includes comma
        if (typeof item.value === 'string' && item.value.includes(',')) {
          val = `(${item.value})`
        }

        return `${item.field}.${item.comparator}.${val}`
      }
    })
    .filter(Boolean)
    .filter(row => {
      const isEmptyCondition = row === 'and()' || row === 'or()'

      return !isEmptyCondition
    })
    .join(',')
}
