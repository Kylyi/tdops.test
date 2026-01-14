// @unocss-include
import { tableSerializeFilters } from '~/libs/GentlUiWrapper/Table/modifiers/table-serialize-filters'
import { tableBuildFetchPayload } from '~/libs/GentlUiWrapper/Table/modifiers/table-build-fetch-payload'
import { tableExtractFiltersFromUrl } from '~/libs/GentlUiWrapper/Table/modifiers/table-extract-filters-from-url'
import { tableExtractSortingFromUrl } from '~/libs/GentlUiWrapper/Table/modifiers/table-extract-sorting-from-url'
import { tableExtractSelectedColumnsFromUrl } from '~/libs/GentlUiWrapper/Table/modifiers/table-extract-selected-columns'
import { tableNavigate } from '~/libs/GentlUiWrapper/Table/modifiers/table-navigate'

export default extendUIConfig({
  inputWrapper: {
    props: {
      stackLabel: true,
      ui: {
        borderColor: {
          base: '#737373',
          focus: 'var(--color-primary)',
        },
      },
    },
  },
  collapse: {
    props: {
      ui: {
        contentClass: () => 'bg-transparent',
      },
    },
    merge: ['ui'],
  },
  pageWrapper: {
    props: { breadcrumbs: false },
    merge: ['pageTitleProps', 'ui'],
  },
  selector: {
    props: {
      stackLabel: true,
      clearOptionsOnMenuHide: true,
      clearSearchOnHide: true,
      loadData: {
        payloadKey: 'data.payload.data',
        countKey: 'data.payload.totalRows',
      },
      maxChipsRows: 5,
    },
  },
  tab: {
    props: {
      btnProps: () => ({
        size: 'sm',
        noUppercase: true,
        noBold: true,
      }),
    },
  },
  table: {
    props: {
      emptyValue: '$empty',
      features: ['autofit', 'queryBuilder', 'queryBuilderDialog', 'sorting', 'columnSelection'],
      loadData: {
        payloadKey: 'data.payload.data',
        countKey: 'data.payload.totalRows',
      },
      separator: 'cell',
      loadMetaData: {
        columnsKey: 'columns',
        layoutsKey: 'layouts',
        defaultLayoutKey: 'defaultLayout',
      },
      modifiers: {
        useUrl: true,
        caseInsensitive: true,
        buildFetchPayload: tableBuildFetchPayload as any,
        extractFiltersFromUrl: tableExtractFiltersFromUrl,
        extractSortingFromUrl: tableExtractSortingFromUrl,
        extractSelectedColumnsFromUrl: tableExtractSelectedColumnsFromUrl,
        serializeFilters: tableSerializeFilters,
        navigate: tableNavigate,
      },
      allowComparatorsOfSameType: true,
      queryBuilderProps: {
        allowComparatorsOfSameType: true,
        showColumnFilters: true,
        editable: true,
      },
      bordered: true,
      ui: {
        containerClass: 'p-x-1',
      },
      // getFilterComponent,
    },
  },
  tooltip: {
    props: {
      ui: {
        tooltipClass: '!font-rem-14 !dark:color-truegray-500 !color-truegray-700 !bg-white dark:!bg-dark-950',
      },
    },
  },
  queryBuilder: {
    props: {
      allowNegation: true,
    },
  },
  virtualScroller: {
    props: {
      overscan: { top: 1600, bottom: 2400 },
    },
  },

  // dynamicGrid: {
  //   props: {
  //     nestedGridConfiguration: {
  //       loadDynamicGridFnc: async ({ item }) => {
  //         // TODO: Implement

  //         return null
  //         // const { dynamicGridFindOne } = useDynamicGridApi()

  //         // if (!item.buildingBlock.dynamicGrid?.id) {
  //         //   return
  //         // }

  //         // const dynamicGrid = await dynamicGridFindOne({
  //         //   args: {
  //         //     where: { id: item.buildingBlock.dynamicGrid?.id },
  //         //     include: { files: true },
  //         //   },
  //         // })

  //         // return {
  //         //   actions: dynamicGrid.actions,
  //         //   items: dynamicGrid.items,
  //         //   contextData: dynamicGrid.contextData,
  //         //   designSystem: dynamicGrid.designSystem,
  //         //   files: dynamicGrid.files,
  //         //   layers: dynamicGrid.layers,
  //         //   noFluid: !dynamicGrid.fluid,
  //         // }
  //       },
  //       loadDynamicGridOptionsFnc: async ({ search }) => {
  //         // TODO: Implement
  //         // const { dynamicGridFindMany } = useDynamicGridApi()
  //         // const { data: dynamicGrids } = await dynamicGridFindMany({
  //         //   search,
  //         //   args: { select: { id: true, name: true } },
  //         // })

  //         // return dynamicGrids
  //         return []
  //       },
  //     },
  //   } satisfies IDynamicGridProps,
  // },
})
