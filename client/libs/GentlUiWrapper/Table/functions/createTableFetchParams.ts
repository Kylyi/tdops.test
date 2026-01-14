import type { AxiosRequestConfig } from 'axios'
import type { ITableFetchPayload } from '$ui'

/**
 * Wraps the table fetch function to provide easier way to handle the params
 * and/or versions
 */
export function createTableFetchData(payload: {
  /**
   * The endpoint to fetch the data from
   */
  endpoint: string

  /**
   * The table fetch function input that we get as an argument from Table.vue
   */
  tablePayload: ITableFetchPayload

  /**
   * The axios config that we want to use/extend with
   */
  config?: AxiosRequestConfig<any>

  /**
   * If provided, the params will be appended to the fetch query params
   */
  appendParams?: string
}) {
  const { endpoint, tablePayload, config, appendParams } = payload
  const { queryParams = new URLSearchParams() } = tablePayload

  if (appendParams) {
    const _appendParams = new URLSearchParams(appendParams)

    _appendParams.forEach((value, key) => {
      queryParams.append(key, value)
    })
  }

  return tdopsApiHttpClient({
    url: endpoint,
    params: queryParams,
    ...config,
  })
}

/**
 * Wraps the table fetch function to provide easier way to handle the params
 */
export function createTableFetchMeta(options: {
  endpoint: string

  /**
   * The table fetch function input that we get as an argument from Table.vue
   */
  tablePayload: ITableFetchPayload

  /**
   * The axios config that we want to use/extend with
   */
  config?: AxiosRequestConfig<any>

  /**
   * The meta fields to include in the fetch
   */
  metaFields?: Array<'filters' | 'subscriptions' | 'columns'>

  /**
   * If provided, the params will be appended to the fetch query params
   */
  appendParams?: string
}) {
  const {
    endpoint,
    tablePayload,
    config,
    appendParams,
    metaFields = ['columns'],
  } = options

  const { queryParams = new URLSearchParams() } = tablePayload
  if (appendParams) {
    const _appendParams = new URLSearchParams(appendParams)

    _appendParams.forEach((value, key) => {
      queryParams.append(key, value)
    })
  }

  if (metaFields.length) {
    queryParams.append('metaInclude', metaFields.join(','))
  }

  return tdopsApiHttpClient(
    endpoint,
    { params: queryParams, ...config },
  )
}
