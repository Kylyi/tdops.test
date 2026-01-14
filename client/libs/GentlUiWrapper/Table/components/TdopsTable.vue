<script setup lang="ts">
// Types
import type { AxiosRequestConfig } from 'axios'
import type { IQueryBuilderRow, ISelection, ITableEmits, ITableFetchPayload, ITableProps, TableColumn } from '$ui'
import type { TdopsDataTables } from '~/libs/GentlUiWrapper/Table/constants/table-meta.constant'

// Composables
import { useTdopsTable } from '~/libs/GentlUiWrapper/Table/composables/useTdopsTable'

type IProps = ITableProps & {
  tdopsTableMetaId: TdopsDataTables

  /**
   * The params to append when fetching data
   */
  appendParams?: string

  /**
   * Features that are specific to JAFIN project
   */
  // tarFeatures?: Array<'tags' | 'export' | 'subscriptions'>

  /**
   * The config to use for the `axios` calls - meta fetch and data fetch
   */
  config?: (tablePayload: ITableFetchPayload) => AxiosRequestConfig<any>

  /**
   * The path that should be constructed to get to the detail page.
   * NOTE: When using a function, the `pageKey` prop is not used.
   */
  detailLinkPath?: string | ((row: any) => string)

  /**
   * A function that can be used to modify the columns we get from the API,
   * will get called for every column
   */
  modifyColumn?: (col: Partial<TableColumn>) => Partial<TableColumn>

  /**
   * By default, the detail page is constructed like `/<entity>/<id>`,
   * in some cases, we might need to use a different key, for example users use the `login` key
   */
  pageKey?: string

  /**
   * The key to use for `totals`
   */
  totalsKey?: string

  /**
   * When true, the table will primarily use the URL to get the proper structure
   * of columns, filters, sorting, etc.
   */
  useUrl?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  useUrl: true,
  allowComparatorsOfSameType: true,
})

const emits = defineEmits<ITableEmits>()

const slots = useSlots()

// Utils
const tableProps = reactiveOmit(props, ['appendParams', 'config'])

const {
  getDetailLink,
  loadData,
  loadMetaData,
  onMetaFetch,
  onMetaFetchError,
  onDataFetch,
  storageKey,
  tableEl,
} = useTdopsTable(props)

// Layout
const rows = defineModel<IItem[]>('rows', { default: () => [] })
const isLoading = defineModel<boolean>('loading', { default: false })
const queryBuilder = defineModel<IQueryBuilderRow[]>('queryBuilder')
const selection = defineModel<ISelection>('selection')

const selectionConfig = computed(() => {
  if (props.selectionConfig) {
    return props.selectionConfig
  }

  return undefined
})

const cellSlots = computed(() => {
  const NON_CELL_SLOTS = ['actions', 'top', 'toolbar', 'row-inside']

  return Object.keys(slots).filter(slot => !NON_CELL_SLOTS.includes(slot))
})

defineExpose({
  tableEl,
  refetch: () => tableEl.value?.refetch(),
  getSchema: () => {
    const payload = tableEl.value?.getFetchPayload({ includeInvisible: false })

    return new URLSearchParams(payload?.queryParams)
  },
  store: () => tableEl.value?.store(),
})
</script>

<template>
  <div class="tar-table">
    <div
      v-if="$slots.actions"
      class="tar-table__actions"
    >
      <slot name="actions" />
    </div>
    <Table
      ref="tableEl"
      v-bind="tableProps"
      v-model:loading="isLoading"
      v-model:query-builder="queryBuilder"
      v-model:rows="rows"
      v-model:selection="selection"
      :load-data="{ fnc: loadData, onError: onMetaFetchError, onFetch: onDataFetch }"
      :load-meta-data="{ fnc: loadMetaData, onFetch: onMetaFetch, onError: onMetaFetchError }"
      :to="(row: globalThis.IItem) => getDetailLink(row, { rowKey: pageKey ?? 'id' })"
      :selection-config
      :modifiers="{ useUrl, ...modifiers }"
      :storage-key
      @click:row="emits('click:row', $event)"
    >
      <!-- Top -->
      <template #top="topProps">
        <TableTop
          v-bind="topProps"
          v-model:query-builder="queryBuilder"
          border="b-1 ca"
        />
      </template>

      <!-- Toolbar -->
      <template #toolbar="toolbarProps">
        <TableToolbar
          v-bind="toolbarProps"
          border="b-1 ca"
        >
          <!-- Selection -->
          <!-- missing v-else -->
          <template #selection="{ selection }">
            <slot
              :selection
              name="selection"
            />
          </template>

          <!-- Selection menu -->
          <template
            v-if="$slots['selection-menu']"
            #selection-menu="{ selection }"
          >
            <Menu>
              <slot
                name="selection-menu"
                :selection
              />
            </Menu>
          </template>

          <template #append>
            <slot name="toolbar-append" />
          </template>
        </TableToolbar>
      </template>

      <!-- Cell slots -->
      <template
        v-for="colName in cellSlots"
        :key="colName"
        #[colName]="{ row, index, customData, value }"
      >
        <slot
          :name="colName"
          :row
          :index
          :custom-data
          :value
        />
      </template>

      <!-- Row inside -->
      <template #row-inside="{ row, index, customData }">
        <slot
          name="row-inside"
          :row
          :index
          :custom-data
        />
      </template>
    </Table>
  </div>
</template>

<style lang="scss" scoped>
.tar-table {
  @apply flex flex-col grow overflow-auto;

  &__actions {
    @apply flex gap-2 justify-end p-t-2 p-x-2 p-b-1 border-b-1 border-ca;
  }
}
</style>
