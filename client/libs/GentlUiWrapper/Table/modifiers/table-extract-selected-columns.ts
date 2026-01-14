// Models
import type { TableColumn } from '$ui'

/**
 * Extracts the selected columns (and their order) from the URL
 * The URL might look like: `?select=name.value,id,description`
 */
export function tableExtractSelectedColumnsFromUrl(
  params: URLSearchParams,
  columns?: TableColumn[],
) {
  const select = params.get('select')

  if (select === '*') {
    return []
  }

  const selectFields = select?.split(',') ?? []

  return selectFields
}
