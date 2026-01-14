<script setup lang="ts">
// Types
import type { IListFetchPayload, ISelectorProps } from '$ui'

import { getComponentMergedProps, getComponentProps } from '$ui'

type IProps = ISelectorProps & {
  endpoint: string
  queryParams?: string | URLSearchParams
  customGetData?: (payload: IListFetchPayload) => Promise<any> | undefined
  optionKey?: string
  optionLabel?: string
}

const props = withDefaults(defineProps<IProps>(), {
  ...getComponentProps('selector'),
  optionKey: 'id',
  optionLabel: 'name',
})

defineEmits<{
  (e: 'onAdd:item', value: any): void
}>()

// Utils
const mergedProps = computed(() => {
  return getComponentMergedProps('selector', props)
})

const keyField = computed(() => props.optionKey || 'id')
const labelField = computed(() => props.optionLabel || 'name')

function getLabel(row: any) {
  if (row && typeof row === 'object') {
    const key = row?.[keyField.value]
    const label = row?.[labelField.value]
    return `${key}: ${label}`
  }

  return row
}

// Layout
const selectorEl = useTemplateRef('selectorEl')
const search = ref('')
const model = defineModel<any>()

function setSearch() {
  nextTick(() => {
    const isArray = Array.isArray(model.value)

    if (!model.value || isArray) {
      search.value = ''
      return
    }

    const [key] = String(getLabel(model.value)).split(':')
    if (model.value?._isCreate) {
      const labelValue = model.value[labelField.value]
      search.value = labelValue === '-' ? '' : labelValue
    } else {
      search.value = key === 'null' || key === '-' || key === undefined ? '' : key
    }
  })
}

setSearch()

// Data fetching
function getData(payload: IListFetchPayload) {
  const { search = '', options } = payload
  const { fetchMore, hasMore, lastRow } = options ?? {}

  const searchValues: string[] = []
  let paging = 'limit.50'

  if (search) {
    let { id = '', name } = extractIdAndName(search === '-' ? '' : search)

    const idContainsCommaOrSpaceOrAmpersand = /[,\s&]/.test(id)

    if (idContainsCommaOrSpaceOrAmpersand) {
      id = `(${id})`
    }

    if (id && !Number.isNaN(Number(id))) {
      // Split by dot, increment last part
      const parts = id.split('.')
      const last = parts.pop()
      if (last !== undefined && /^\d+$/.test(last)) {
        parts.push((Number.parseInt(last, 10) + 1).toString())
        const upperBound = parts.join('.')
        searchValues.push(`and(${keyField.value}.gte.${id},${keyField.value}.lt.${upperBound})`)
      } else {
        // fallback: just use the original logic
        searchValues.push(`and(${keyField.value}.gte.${id},${keyField.value}.lt.${(Number(id) + 1).toString()})`)
      }
    }

    const containsCommaOrSpaceOrAmpersand = /[,\s&]/.test(name)

    if (containsCommaOrSpaceOrAmpersand) {
      name = `(${name})`
    }

    if (name) {
      searchValues.push(`${labelField.value}.cs.${name}`)
    }
  }

  if (fetchMore) {
    if (!hasMore || !lastRow) {
      return
    }

    const lastRowKey = lastRow.ref[keyField.value]
    paging += `,sort(${keyField.value}.asc.${lastRowKey},$key.${lastRowKey})`
  } else {
    paging += ',count.true'
  }

  paging = `(${paging})`

  const queryParams = new URLSearchParams(props.queryParams || '')
  queryParams.append('paging', paging)

  if (searchValues.length) {
    queryParams.append('or', `(${searchValues.join(',')})`)
  }

  return tdopsApiHttpClient.get(props.endpoint, {
    signal: payload.abortController?.signal,
    params: queryParams,
  })
}

defineExpose({
  focus: () => selectorEl.value?.focus?.(),
  select: () => selectorEl.value?.select?.(),
  resetSearchValue: () => search.value = '',
})
</script>

<template>
  <Selector
    ref="selectorEl"
    v-bind="$props"
    v-model="model"
    v-model:search="search"
    :ui="mergedProps.ui"
    :list-props="mergedProps.listProps"
    :menu-props="mergedProps.menuProps"
    :load-data="{ fnc: customGetData ?? getData, onSearch: 300 }"
    :option-label="optionLabel ?? getLabel"
    no-sort
    no-filter
    clear-options-on-menu-hide
    @picker-hide="setSearch"
    @clear="setSearch"
    @add:item="$emit('onAdd:item', $event)"
  >
    <template #option="{ item }">
      <slot
        name="option"
        :item
      >
        <span
          v-if="item.ref[keyField] && !item._isNew && !item.ref._isCreate"
          class="option__id"
        >
          {{ item.ref[keyField] }}:
        </span>

        <span class="option__name">
          {{ item.ref[labelField] }}
        </span>
      </slot>
    </template>

    <template
      v-if="$slots.append"
      #append
    >
      <slot name="append" />
    </template>

    <template #selection-item="{ item }">
      <slot
        name="selection-item"
        :item
      >
        <div flex="~ items-center gap-2px">
          <span
            v-if="typeof item === 'string'"
            class="option__name truncate"
          >
            {{ item }}
          </span>

          <span
            v-if="item?.[keyField] && !item?._isNew && !item?._isCreate"
            class="option__id"
          >
            {{ item[keyField] }}
          </span>

          <span
            v-if="item?.[labelField]"
            class="option__name truncate"
          >
            : {{ item[labelField] }}
          </span>
        </div>
      </slot>
    </template>

    <template #menu-above>
      <slot name="menu-above" />
    </template>
  </Selector>
</template>

<style lang="scss" scoped>
.option__id {
  @apply flex self-start items-center font-semibold p-y-1 m-t-px leading-tight font-mono font-rem-14;
}

.option__name {
  @apply p-y-1 leading-tight font-rem-14;
}
</style>
