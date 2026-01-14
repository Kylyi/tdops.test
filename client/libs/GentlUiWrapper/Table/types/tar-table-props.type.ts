import type { ITableFetchPayload, TableColumn } from '$ui'
import type { AxiosRequestConfig } from 'axios'
import type { TdopsDataTables } from '~/libs/GentlUiWrapper/Table/constants/table-meta.constant'

export type TarTableProps = {
  tarTableMetaId: TdopsDataTables

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
   * Configuration for the `ExportBtn`
   */
  exportSetup?: Partial<IExportSetup>

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

  /**
   * Features that are specific to TARIFF project
   */
  tarFeatures?: Array<'export'>
}
