import { ComparatorEnum } from '$comparatorEnum'
import { SELECTOR_COMPARATORS } from '$utils'
import type {
  IQueryBuilderGroup,
  IQueryBuilderItem,
  IQueryBuilderRow,
  ITableProps,
  TableColumn,
} from '$ui'

const AND_CONDITION = 'AND'
const OR_CONDITION = 'OR'

// Temporary variables
let columnsByField: Record<string, TableColumn<any>> = {}

/**
 * Modifies the query builder query param string when necessary
 * For example, when the query param string starts with `and` or `or`,
 * we don't need to modify it
 * But when it starts with a comparator, we need to add the key
 */
function modifyQBQueryParamString(queryString: string, key: string) {
  if (queryString.startsWith('and') || queryString.startsWith('or')) {
    return queryString
  }

  return `${key}${queryString}`
}

/**
 * Will generate the appropriate path for the current row
 * The result will look like this: `0.children.1.children.2`
 */
function generatePath(parentPath: string, idx: number): string {
  return parentPath ? `${parentPath}.children.${idx}` : `${idx}`
}

/**
 * Extracts the data from filters with nesting.
 */
function extractFilterWithNesting(filterString: string) {
  const regex = /(\w+)\.with=\((\w+)\.(\w+)\(([^)]+)\)\)/
  const match = filterString.match(regex)

  if (match) {
    return {
      field: match[1],
      subField: match[2],
      comparator: match[3],
      values: (match[4] ?? '').split(','), // If values are comma-separated, split them into an array
    }
  } else {
    throw new Error('Invalid filter string format')
  }
}

/**
 * Extract the filter query parameter from URLSearchParams.
 * the `fromSchema` parameter should be used when we provide URLSearchParams
 * from the table layout schema, not from the actual URL
 */
function extractFilterFromSearchParams(
  searchParams: URLSearchParams,
  key = 'filters',
  fromSchema?: boolean,
  modifyFnc?: (queryString: string, key: string) => string,
): string | null {
  let paramsString = searchParams.get(key)

  if (!paramsString) {
    return null
  }

  paramsString = modifyFnc?.(paramsString, key) || paramsString

  if (fromSchema) {
    if (paramsString.startsWith('(') && paramsString.endsWith(')')) {
      return paramsString.slice(1, -1)
    }
  }

  return paramsString
}

/**
 * Check if the filter string at the curr\ent index represents a group condition.
 */
function isGroupCondition(filterStr: string, idx: number): boolean {
  return (
    (filterStr.startsWith(AND_CONDITION.toLowerCase(), idx) && filterStr[idx + 3] === '(')
    || (filterStr.startsWith(OR_CONDITION.toLowerCase(), idx) && filterStr[idx + 2] === '(')
  )
}

/**
 * Parse a group segment from the filter string.
 */
function parseGroupSegment(
  filterStr: string,
  idx: number,
  results: IQueryBuilderRow[],
  parentPath = '',
): number {
  const condition = filterStr[idx] === 'a' ? AND_CONDITION : OR_CONDITION
  const conditionEndIdx = idx + condition.length

  let openBrackets = 1
  let closeIdx = conditionEndIdx + 1

  while (openBrackets !== 0) {
    if (filterStr[closeIdx] === '(') {
      openBrackets++
    } else if (filterStr[closeIdx] === ')') {
      openBrackets--
    }

    closeIdx++
  }

  const groupContent = filterStr.slice(conditionEndIdx + 1, closeIdx - 1)
  const path = generatePath(parentPath, results.length)
  const group: IQueryBuilderGroup = {
    id: generateUUID(),
    path,
    condition,
    children: [],
    isGroup: true,
  }

  // We insert the group into the parent group if there is any parent
  if (parentPath) {
    const segments = path.split('.')
    const lastSegment = segments.pop()
    const parentGroup: any = get(results, segments.join('.'))

    if (lastSegment === 'children') {
      parentGroup.children.push(group)
    } else {
      results.push(group)
    }
  }

  // Otherwise, we insert the group into the results
  else {
    results.push(group)
  }

  parseFilterString(groupContent, group.children, path)

  return closeIdx
}

/**
 * Parse an item segment from the filter string.
 */
function parseItemSegment(
  filterStr: string,
  idx: number,
  results: IQueryBuilderRow[],
  parentPath = '',
  modifiers?: ITableProps['modifiers'],
): number {
  // Arrays are inserted into parentheses, therefore, we need to be aware
  // of the parentheses depth to know when the segment ends
  let parenthesesDepth = 0
  let endIdx = -1

  for (let i = idx; i < filterStr.length; i++) {
    if (filterStr[i] === '(') {
      parenthesesDepth++
    } else if (filterStr[i] === ')') {
      parenthesesDepth--
    } else if (filterStr[i] === ',' && parenthesesDepth === 0) {
      endIdx = i
      break
    }
  }

  let segment = endIdx === -1 ? filterStr.slice(idx) : filterStr.slice(idx, endIdx)

  const comparatorKeys = Object.values(ComparatorEnum)
    .sort((a, b) => b.length - a.length)
  let foundComparator: ComparatorEnum | null = null
  let foundComparatorIdx = -1

  for (const comparator of comparatorKeys) {
    foundComparatorIdx = segment.lastIndexOf(`.${comparator}`)
    if (foundComparatorIdx !== -1) {
      foundComparator = comparator as ComparatorEnum
      break
    }
  }

  if (!foundComparator) {
    throw new Error(`No valid comparator found in segment: ${segment}`)
  }

  // Prepare
  let field: string
  let fieldOriginal: string
  let filterField: string | undefined
  let value: any

  // JAFIN-specific
  if (segment.includes('.with.')) {
    segment = segment.replace('.with.', '.with=')
  }

  const isNestedField = segment.includes('.with=(')

  if (isNestedField) {
    const extracted = extractFilterWithNesting(segment)

    fieldOriginal = extracted.field as string
    field = modifiers?.caseInsensitive
      ? String(extracted.field).toLowerCase()
      : extracted.field as string

    filterField = `${extracted.field}.${extracted.subField}`
    value = extracted.values.toString()
  } else {
    const [_fieldOriginal] = segment.substring(0, foundComparatorIdx).trim().split('.')
    fieldOriginal = _fieldOriginal as string

    field = modifiers?.caseInsensitive
      ? String(fieldOriginal).toLowerCase()
      : fieldOriginal

    let _value: string | undefined = segment.substring(
      foundComparatorIdx + foundComparator.length + 2,
    ) // +2 to skip the dot

    // For ComparatorEnum.IS_EMPTY and ComparatorEnum.NOT_IS_EMPTY
    if (foundComparatorIdx + foundComparator.length + 1 >= segment.length) {
      _value = undefined
    }

    // When the comparator cannot be an array, but we get a value that acts like one
    // -> `(<value>)`, we need to remove the brackets
    else if (
      !SELECTOR_COMPARATORS.includes(foundComparator)
      && _value?.startsWith('(')
      && _value?.endsWith(')')
    ) {
      _value = _value?.slice(1, -1)
    }

    // We check for arrays to parse each value in the array
    const isArray = _value?.startsWith('(') && _value?.endsWith(')')
    value = isArray
      ? _value
          ?.slice(1, -1)
          .split(',')
          .map(val => parseValue(val, columnsByField[field]?.dataType), { comparator: foundComparator })
      : parseValue(_value, columnsByField[field]?.dataType, { comparator: foundComparator })
  }

  const path = generatePath(parentPath, results.length)
  const item: IQueryBuilderItem = {
    id: generateUUID(),
    path,
    field: (columnsByField[field]?.field as string) ?? fieldOriginal,
    filterField,
    comparator: foundComparator,
    value,
  }

  results.push(item)

  return endIdx === -1 ? filterStr.length : endIdx + 1
}

/**
 * Recursively parse the filter string into structured data.
 */
export function parseFilterString(
  filterStr: string,
  results: IQueryBuilderRow[] = [],
  parentPath = '',
  modifiers?: ITableProps['modifiers'],
): IQueryBuilderRow[] {
  let idx = 0
  while (idx < filterStr.length) {
    if (isGroupCondition(filterStr, idx)) {
      idx = parseGroupSegment(filterStr, idx, results, parentPath)
      // If next character is not '(' or end of string, assume it's a new segment.
      if (
        idx < filterStr.length
        && filterStr[idx] !== ','
        && filterStr[idx] !== '('
      ) {
        idx = parseItemSegment(filterStr, idx, results, parentPath, modifiers)
      }
    } else {
      idx = parseItemSegment(filterStr, idx, results, parentPath, modifiers)
      // Handle the case when there's no comma between segments.
      if (idx < filterStr.length && filterStr[idx] !== ',') {
        idx--
      }
    }

    if (idx < filterStr.length && filterStr[idx] === ',') {
      idx++
    }
  }
  return results
}

/**
 * Parses the filter query parameter from URLSearchParams into structured data.
 * the `fromSchema` parameter should be used when we provide URLSearchParams
 * from the table layout schema, not from the actual URL
 */
function extractFilterPartFromUrl(options: {
  searchParams: URLSearchParams
  key?: string
  columns?: TableColumn<any>[]
  fromSchema?: boolean
  modifiers?: ITableProps['modifiers']

  /**
   * The function that will be called before the query string is parsed
   */
  modifyFnc?: (queryString: string, key: string) => string
}): IQueryBuilderRow[] {
  const {
    searchParams,
    key = 'filters',
    columns = [],
    fromSchema,
    modifiers,
    modifyFnc,
  } = options

  // We save the columns in a temporary variable
  columnsByField = columns.reduce((agg, col) => {
    const colField = modifiers?.caseInsensitive ? String(col.field).toLowerCase() : col.field
    agg[colField] = col

    return agg
  }, {} as Record<string, TableColumn<any>>)

  const filterQuery = extractFilterFromSearchParams(
    searchParams,
    key,
    fromSchema,
    modifyFnc,
  )

  return filterQuery ? parseFilterString(filterQuery) : []
}

export function tableExtractFiltersFromUrl(payload: {
  searchParams: URLSearchParams
  columns?: TableColumn<any>[]
  modifiers?: ITableProps['modifiers']

  /**
   * The function that will be called before the query string is parsed
   */
  modifyFnc?: (queryString: string, key: string) => string
}) {
  // Column filters
  const filters = extractFilterPartFromUrl({
    ...payload,
    fromSchema: true,
    key: 'filters',

  })

  // Query builder
  const queryBuilder = extractFilterPartFromUrl({
    ...payload,
    fromSchema: true,
    key: 'qb',
  })

  // ANCHOR: Query builder
  let queryBuilderExtended = queryBuilder

  const queryBuilder_AND = extractFilterPartFromUrl({
    ...payload,
    key: 'and',
    fromSchema: true,
    modifyFnc: modifyQBQueryParamString,
  })

  const queryBuilder_OR = extractFilterPartFromUrl({
    ...payload,
    key: 'or',
    fromSchema: true,
    modifyFnc: modifyQBQueryParamString,
  })

  // We only use one of the resolved query builders
  // The priority is `queryBuilder` -> `filtersAndQueryBuilder_AND` -> `filtersAndQueryBuilder_OR`
  if (queryBuilder_AND[0] && queryBuilder_AND.length && 'isGroup' in queryBuilder_AND[0]) {
    queryBuilderExtended = queryBuilder_AND
  } else if (queryBuilder_OR[0] && queryBuilder_OR.length && 'isGroup' in queryBuilder_OR[0]) {
    queryBuilderExtended = queryBuilder_OR
  }

  // ANCHOR: Non-standard filters
  // In some cases, we get filters that are not in the `filters`, `qb` (or `and` and `or`)
  // query params, but in the URL itself, like `activity=eq.0`
  // We need to extract those and add them to the filters
  // But we do that only if there are no (top-level) filters at all
  const NON_FILTER_KEYS = [
    'qb',
    'filters',
    'and',
    'or',
    'sort',
    'order',
    'select',
    'paging',
    'meta',
    'fromSchema',
    'strict',
  ]
  const paramKeys = Array.from(payload.searchParams.keys())
  const nonStandardFilterKeys = paramKeys.filter(key => !NON_FILTER_KEYS.includes(key))

  if (!filters?.length && nonStandardFilterKeys.length) {
    const usedKeys: Record<string, true> = {}

    const nonStandardFilters = nonStandardFilterKeys
      .flatMap(key => {
        if (usedKeys[key]) {
          return []
        }

        usedKeys[key] = true
        const values = payload.searchParams.getAll(key)

        return values.map(value => {
          const comparatorKeys = Object.values(ComparatorEnum).sort(
            (a, b) => b.length - a.length,
          )

          const segment = `${key}.${value}`
          let foundComparator: ComparatorEnum | null = null
          let foundComparatorIdx = -1

          for (const comparator of comparatorKeys) {
            foundComparatorIdx = segment.lastIndexOf(`.${comparator}`)

            if (foundComparatorIdx !== -1) {
              foundComparator = comparator as ComparatorEnum
              break
            }
          }

          if (!foundComparator) {
            return undefined
          }

          const isSelectorComparator = SELECTOR_COMPARATORS.includes(foundComparator)

          if (isSelectorComparator) {
            // Remove the comparator from the value
            value = value.substring(foundComparator.length + 1)

            if (!value.startsWith('(')) {
              value = `(${value}`
            }

            if (!value.endsWith(')')) {
              value = `${value})`
            }

            return `${key}.${foundComparator}.${value}`
          }

          return `${key}.${value}`
        }).filter(Boolean)
      })
      .filter(Boolean)

    if (nonStandardFilters.length) {
      payload.searchParams.set('filters', nonStandardFilters.join(','))

      nonStandardFilterKeys.forEach(key => {
        payload.searchParams.delete(key)
      })

      return tableExtractFiltersFromUrl(payload)
    }
  }

  return {
    filters,
    queryBuilder: queryBuilderExtended,
  }
}
