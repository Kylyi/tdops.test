import { FilterItem } from '$utils'
import { split } from 'change-case'
import { tableExtractDataFromUrl } from '$ui'

// Constants
import { TDOPS_TABLE_META } from '~/libs/GentlUiWrapper/Table/constants/table-meta.constant'

// Functions
import { createTableFetchData, createTableFetchMeta } from '~/libs/GentlUiWrapper/Table/functions/createTableFetchParams'

// Types
import type { AxiosRequestConfig } from 'axios'
import type { ITableFetchPayload, ITableProps, ITableTotal, TableColumn, useTableStore } from '$ui'
import type { TdopsDataTables } from '~/libs/GentlUiWrapper/Table/constants/table-meta.constant'

export function useTdopsTable(
  payload: {
    tdopsTableMetaId: TdopsDataTables
    appendParams?: string
    config?: (tablePayload: ITableFetchPayload) => AxiosRequestConfig<any>
    detailLinkPath?: string | ((row: any) => string)
    totalsKey?: string
    modifyColumn?: (col: Partial<TableColumn>) => Partial<TableColumn>
  },
) {
  const {
    config,
    appendParams,
    modifyColumn,
    detailLinkPath,
    totalsKey,
    tdopsTableMetaId,
  } = payload

  // Utils
  const route = useRoute()
  const tableEl = ref<any>()

  // Store
  const { isActiveElementInput } = useUIStore()

  const { endpoint, translationPrefix, storageKey, viewCode } = TDOPS_TABLE_META[tdopsTableMetaId]

  function getDetailLink(row: IItem, options?: { rowKey?: string }) {
    const { rowKey = 'id' } = options ?? {}
    const id = get(row, rowKey)

    return typeof detailLinkPath === 'function'
      ? $p(detailLinkPath(row))
      : $p(`${detailLinkPath}/${id}`)
  }

  function loadData(tablePayload: ITableFetchPayload) {
    const _config = config?.(tablePayload)

    return createTableFetchData({
      tablePayload,
      endpoint,
      appendParams,
      config: _config,
    })
  }

  const onDataFetch: NonNullable<ITableProps['loadData']>['onFetch'] = payload => {
    const { res, getStore } = payload
    const tableStore = getStore()

    if (!tableStore) {
      return res
    }

    const { queryParams, virtualScrollEl, onDataFetchQueue } = tableStore

    // When no `filter` or `queryBuilder` is currently active, we fall back to the `activeFilter` that we
    // got from the fetch
    const hasFilters = queryParams.value.has('filters')
    const hasQueryBuilder = queryParams.value.has('qb')

    // Make sure there is some active filter actually present
    const activeFilter = new URLSearchParams(get(res, 'data.additionalInformation.defaultFilter'))

    activeFilter.delete('paging')
    activeFilter.delete('select')
    activeFilter.delete('metaInclude')

    if (!hasFilters && !hasQueryBuilder && activeFilter.toString() !== '') {
      setActiveFilter({ store: tableStore, res })
    }

    onDataFetchQueue.value.push(() => {
      nextTick(() => {
        if (!isActiveElementInput()) {
          virtualScrollEl.value?.focus?.()
        }
      })
    })

    return res
  }

  const loadMetaData: NonNullable<ITableProps['loadMetaData']>['fnc'] = payload => {
    const { tablePayload, getStore } = payload
    const tableStore = getStore()
    const { state } = tableStore

    // In case we are loading the table for the first time ever (no columns are in the state)
    // we only fetch the bare minimum to get the meta data
    const isFirstTimeLoad = !state.value?.columns?.length

    if (isFirstTimeLoad) {
      const queryParams = new URLSearchParams()
      tablePayload.queryParams = queryParams
    }

    const _config = config?.(tablePayload)

    return createTableFetchMeta({
      endpoint,
      config: _config,
      metaFields: ['columns'],
      tablePayload,
      appendParams,
    })
  }

  const onMetaFetch: NonNullable<ITableProps['loadMetaData']>['onFetch'] = payload => {
    const { res, getStore } = payload
    const tableStore = getStore()
    const {
      rowKey,
      rows,
      totalRows,
      hasMore,
      customData,
      state,
      totals,
      queryParams,
      virtualScrollEl,
      onDataFetchQueue,
      loadData,
    } = tableStore

    const isFirstTimeLoad = !state.value?.columns?.length
    const { payloadKey = 'data', countKey = 'count' } = loadData.value ?? {}

    const rowsFetched = get(res, payloadKey) ?? []
    const countFetched = get(res, countKey) ?? 0

    // General
    rows.value = rowsFetched
    totalRows.value = countFetched
    hasMore.value = rows.value.length < totalRows.value

    const _rowKey = res?.data?.additionalInformation?.filtersMeta?.tableKey

    if (_rowKey) {
      rowKey.value = _rowKey
    }

    // Custom data
    customData.value = {
      ...customData.value,
      viewCode,
    }

    // Columns
    const columns = res?.data?.additionalInformation?.columnMeta?.columnMetadata ?? []
    res.columns = columns.map((col: { name: any, type: any }) => {
      let _col = {
        field: col.name,
        dataType: col.type,
        label: () => $t(`${translationPrefix}.${col.name}`),
      } as Partial<TableColumn>

      _col = modifyColumn?.(_col) ?? _col

      return _col
    })
    // Default filter
    const defaultFilter = res?.data?.additionalInformation?.defaultFilter
    res.defaultLayout = defaultFilter
      ? {
          schema: defaultFilter,
        }
      : null

    // Totals
    if (totalsKey) {
      const _totals = get(res, totalsKey)

      if (!_totals) {
        return
      }

      totals.value = Object.entries(_totals).reduce((agg, entry) => {
        const _key = split(entry[0]).slice(0, -1).join('')
        agg.push({
          field: _key,
          value: entry[1],
          dataType: 'string',
        })

        return agg
      }, [] as ITableTotal[])
    }

    // When no `filter` or `queryBuilder` is currently active, we fall back to the `activeFilter` that we
    // got from the fetch
    const hasFilters = queryParams.value.has('filters')
    const hasQueryBuilder = queryParams.value.has('qb')

    // Make sure there is some active filter actually present
    const activeFilter = new URLSearchParams(get(res, 'data.additionalInformation.defaultFilter'))

    activeFilter.delete('paging')
    activeFilter.delete('select')
    activeFilter.delete('metaInclude')

    if (!hasFilters && !isFirstTimeLoad && !hasQueryBuilder && activeFilter.toString() !== '') {
      setTimeout(() => {
        setActiveFilter({ store: tableStore, res })
      })
    }

    if (!isFirstTimeLoad) {
      onDataFetchQueue.value.push(() => {
        nextTick(() => {
          if (!isActiveElementInput()) {
            virtualScrollEl.value?.focus?.()
          }
        })
      })
    }

    return { ...res, _preventFetchData: !isFirstTimeLoad }
  }

  const onMetaFetchError: NonNullable<ITableProps['loadMetaData']>['onError'] = (_, res, getStore) => {
    const isInvalidTokenField = get(res, 'response.data.status.code') === 'Pagin8_TokenFieldInvalid'
    const isUnauthorized = get(res, 'status') === 401 || get(res, 'status') === 403

    if (isUnauthorized) {
      $nav('/')
    }

    if (!isInvalidTokenField) {
      return
    }

    const {
      state,
      onDataFetchQueue,
      isInitialLoad,
      rows,
      loadData,
      autofitConfig,
      runOnDataFetchQueue,
      fetchAndSetMetaData,
      fetchAndSetData,
      navigate,
    } = getStore()

    // Reset the state
    state.value = {
      columns: [] as any[],
      layouts: [] as any[],
      layoutDefault: undefined as any | undefined,
      metaRaw: null as any,
      queryBuilder: [] as any[],
      search: '',
      queryParams: '',

      /**
       * We sometimes need to save some custom data in table context to access it in
       * a component or similar.
       */
      customData: {} as IItem,
    }

    navigateTo({ path: route.path, query: {}, replace: true })

    const isImmediate = loadData.value?.immediate || !rows.value.length

    function autoFit() {
      let mode: 'fit' | 'stretch' | 'justify' | 'fit-with-header' | null | undefined

      if (autofitConfig.value?.onInit === 'forced') {
        mode = autofitConfig.value.mode
      }

      nextTick(() => tableEl.value?.fitColumns(undefined, { mode }))
    }

    fetchAndSetMetaData()
      .then(res => {
      // We may have returned a special property `_preventFetchData`, in which case
      // we do not fetch the data (for example in case we already got the data in the meta fetch)
        if (typeof res === 'object' && res?._preventFetchData) {
          if (rows.value.length) {
            autoFit()
          }
          isInitialLoad.value = false

          onDataFetchQueue.value.push(navigate)
          runOnDataFetchQueue()

          return
        }

        if (loadData.value?.fnc && isImmediate) {
          fetchAndSetData({ force: true })
            .then(() => {
              if (rows.value.length) {
                autoFit()
              }

              isInitialLoad.value = false
            })
        } else {
          autoFit()
          isInitialLoad.value = false
        }
      })
  }

  function setActiveFilter(payload: {
    store: ReturnType<typeof useTableStore>
    res: any
  }) {
    const { res, store } = payload
    const activeFilter = get(res, 'data.additionalInformation.defaultFilter')

    const { isSilentChange, internalColumns, modifiers, queryBuilder } = store

    // Turn off reactivity for the filters
    isSilentChange.value = true

    const { filters, queryBuilder: _queryBuilder } = tableExtractDataFromUrl({
      columns: internalColumns.value,
      modifiers: modifiers.value,
      searchParams: activeFilter,
    })

    filters.forEach(filter => {
      if ('isGroup' in filter) {
        return
      }
      const col = internalColumns.value.find(col => col.field === filter.field)
      if (!col) {
        return
      }

      const parseValueOptions = { dateFormat: 'YYYY-MM-DD', comparator: filter.comparator }
      const colProps = pick(col, [
        'field',
        'filterField',
        'dataType',
        'format',
        'filterFormat',
        'customDbQueryFnc',
      ])

      let value: any

      if (Array.isArray(filter.value)) {
        value = filter.value.map(v => parseValue(v, col.dataType, parseValueOptions))
      } else {
        value = parseValue(filter.value, col.dataType, parseValueOptions)
      }

      const filterModel = new FilterItem({ ...filter, ...colProps, value })
      col.filters = [...(col.filters ?? []), filterModel]
    })

    queryBuilder.value = _queryBuilder.length
      ? _queryBuilder
      : [{
          id: generateUUID(),
          isGroup: true,
          children: [],
          condition: 'AND',
          path: '0',
        }]

    // Turn on reactivity for the filters
    isSilentChange.value = false
  }

  return {
    getDetailLink,
    loadData,
    loadMetaData,
    onMetaFetch,
    onMetaFetchError,
    onDataFetch,

    storageKey,
    tableEl,
  }
}
