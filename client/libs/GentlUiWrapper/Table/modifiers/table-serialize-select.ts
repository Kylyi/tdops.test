import type { TableColumn } from '$ui'

/**
 * Serializes the selected columns from the internal structure to the URL
 *
 * You can provide either `columns` or `select`
 */
export function tableSerializeSelect(payload: {
  columns?: TableColumn[]
  select?: string[]
  includeInvisible?: boolean
}): string {
  const requestUrl = useRequestURL()
  const isStrict = requestUrl.searchParams.get('strict') === 'true'

  const { columns = [], select, includeInvisible } = payload

  let _select: string[]

  if (includeInvisible) {
    _select = select ?? columns
      .filter(col => {
        if (isStrict) {
          return (!col.isHelperCol && !col.hidden)
        }

        return col.alwaysSelected || col.sortDbQuery || (!col.isHelperCol && !col.hidden)
      })
      .flatMap(col => [...(col.local ? [] : [col.field]), ...(col.needsFields ?? [])])
  } else {
    _select = select ?? columns
      .filter(col => !col.isHelperCol && !col.hidden)
      .map(col => col.field)
  }

  return uniq(_select).join(',')
}
