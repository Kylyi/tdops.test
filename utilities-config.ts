// import { initializeTasksInstance } from '$task/server/functions/initialize-tasks-instance'
import { config, documentation, environment } from './config'
import { ComparatorEnum as MergedComparatorEnum } from '$comparatorEnum'

const AGO_COMPARATORS = [
  MergedComparatorEnum.AGO,
  MergedComparatorEnum.NOT_AGO,
  MergedComparatorEnum.UNTIL,
  MergedComparatorEnum.NOT_UNTIL,
]

const uiPath = '#layers/ui'

export default extendUtilitiesConfig({
  general: {
    transliterate: true,
    useUtc: false,
  },
  tdops: {
    ...config,
    documentation,
    environment,
    domain: 'domain' in config ? config.domain : undefined,
  },
  request: {
    payloadKey: 'data.payload',
    errorHandler: (error: any, t?: any): string[] => {
      if (error) {
        // If we get explicit errors (as an array) from the API, we use them
        if (error?.response?.data?.errors) {
          const errors = error.response.data.errors
          if (Array.isArray(errors)) {
            return errors.map((e: any) => e.message)
          }
          if (typeof errors === 'object') {
            return Object.values(errors)
          }
          return []
        }

        // If status string error message is provided, we use it
        if (error.status?.message && typeof error.status.message === 'string') {
          return [error.status.message]
        }

        // If error is provided in the reponse data, we use it
        if (
          error.response?.data?.status
          && typeof error.response.data.status.message === 'string'
        ) {
          return [`${error.response.data.status.message}`]
        }

        // If string error message is provided, we use it
        if (error.message && typeof error.message === 'string') {
          const translated = t(`httpError.${error.message}`)

          if (translated === `httpError.${error.message}`) {
            return [error.message]
          }

          return error.status === 500 ? ['System error'] : [t(`httpError.${error.message}`)]
        }

        // If the error comes in `additionalInformation`, we use that
        if (
          error.response?.data?.additionalInformation
          && typeof error.response?.data?.additionalInformation === 'string'
        ) {
          return [error.response.data.additionalInformation]
        }
      }

      return []
    },
  },
  dataTypeExtend: {
    formatFncByDataType: {
      int: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'number' }),
      long: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'number' }),
      double: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'number' }),
      DateTime: (value, row, options) => {
        if (options?.comparator) {
          const isAgoComparator = AGO_COMPARATORS.includes(options.comparator)

          if (isAgoComparator) {
            return options?.formatFnc?.(value, row, { ...options, dataType: 'string' })
          }
        }

        return Intl.DateTimeFormat(options?.localeIso, { dateStyle: 'medium' }).format(new Date(value))
      },
      intSimple: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'number' }),
      longSimple: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'number' }),
      doubleSimple: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'number' }),
      DateTimeSimple: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'datetime' }),
      decimal: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'number' }),
      decimalSimple: (value, row, options) => options?.formatFnc?.(value, row, { ...options, dataType: 'number' }),
    },
    inputByDataType: {
      int: { component: defineAsyncComponent(() => import(`${uiPath}/client/components/Inputs/NumberInput/NumberInput.vue`)), props: {}, icon: 'i-lsicon:number-filled' },
      // intSimple: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/NumberInput/NumberInput.vue')), props: {}, icon: 'i-lsicon:number-filled' },
      // long: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/NumberInput/NumberInput.vue')), props: {}, icon: 'i-tabler:decimal' },
      // longSimple: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/NumberInput/NumberInput.vue')), props: {}, icon: 'i-tabler:decimal' },
      // double: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/NumberInput/NumberInput.vue')), props: {}, icon: 'i-tabler:decimal' },
      // doubleSimple: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/NumberInput/NumberInput.vue')), props: {}, icon: 'i-tabler:decimal' },
      // DateTime: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/DateInput/DateInput.vue')), props: {}, icon: 'i-system-uicons:calendar-date' },
      // DateTimeSimple: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/DateInput/DateInput.vue')), props: {}, icon: 'i-system-uicons:calendar-date' },
      // array: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Selector/Selector.vue')), props: { multi: true }, icon: 'i-material-symbols:data-array-rounded' },
      // decimal: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/NumberInput/NumberInput.vue')), props: { decimal: true, precision: 4 }, icon: 'i-tabler:decimal' },
      // decimalSimple: { component: defineAsyncComponent(() => import('#layers/ui/client/components/Inputs/NumberInput/NumberInput.vue')), props: { decimal: true, precision: 4 }, icon: 'i-tabler:decimal' },
    },
    comparatorsByDataType: {
      string: [
        MergedComparatorEnum.GREATER_THAN,
        MergedComparatorEnum.GREATER_THAN_OR_EQUAL,
        MergedComparatorEnum.LESS_THAN,
        MergedComparatorEnum.LESS_THAN_OR_EQUAL,
        MergedComparatorEnum.EQUAL,
        MergedComparatorEnum.NOT_EQUAL,
        MergedComparatorEnum.LIKE,
        MergedComparatorEnum.NOT_LIKE,
        MergedComparatorEnum.CONTAINS,
        MergedComparatorEnum.NOT_CONTAINS,
        MergedComparatorEnum.STARTS_WITH,
        MergedComparatorEnum.NOT_STARTS_WITH,
        MergedComparatorEnum.ENDS_WITH,
        MergedComparatorEnum.NOT_ENDS_WITH,
        MergedComparatorEnum.IS_EMPTY,
        MergedComparatorEnum.NOT_IS_EMPTY,
        MergedComparatorEnum.IN,
        MergedComparatorEnum.NOT_IN,
        MergedComparatorEnum.STARTS_WITH_IN,
        MergedComparatorEnum.NOT_STARTS_WITH_IN,
      ],
      int: [
        MergedComparatorEnum.EQUAL,
        MergedComparatorEnum.NOT_EQUAL,
        MergedComparatorEnum.GREATER_THAN,
        MergedComparatorEnum.GREATER_THAN_OR_EQUAL,
        MergedComparatorEnum.LESS_THAN,
        MergedComparatorEnum.LESS_THAN_OR_EQUAL,
        MergedComparatorEnum.IS_EMPTY,
        MergedComparatorEnum.NOT_IS_EMPTY,
        MergedComparatorEnum.IN,
        MergedComparatorEnum.NOT_IN,
      ],
      long: [
        MergedComparatorEnum.EQUAL,
        MergedComparatorEnum.NOT_EQUAL,
        MergedComparatorEnum.GREATER_THAN,
        MergedComparatorEnum.GREATER_THAN_OR_EQUAL,
        MergedComparatorEnum.LESS_THAN,
        MergedComparatorEnum.LESS_THAN_OR_EQUAL,
        MergedComparatorEnum.IS_EMPTY,
        MergedComparatorEnum.NOT_IS_EMPTY,
      ],
      decimal: [
        MergedComparatorEnum.EQUAL,
        MergedComparatorEnum.NOT_EQUAL,
        MergedComparatorEnum.GREATER_THAN,
        MergedComparatorEnum.GREATER_THAN_OR_EQUAL,
        MergedComparatorEnum.LESS_THAN,
        MergedComparatorEnum.LESS_THAN_OR_EQUAL,
        MergedComparatorEnum.IS_EMPTY,
        MergedComparatorEnum.NOT_IS_EMPTY,
      ],
      double: [
        MergedComparatorEnum.EQUAL,
        MergedComparatorEnum.NOT_EQUAL,
        MergedComparatorEnum.GREATER_THAN,
        MergedComparatorEnum.GREATER_THAN_OR_EQUAL,
        MergedComparatorEnum.LESS_THAN,
        MergedComparatorEnum.LESS_THAN_OR_EQUAL,
        MergedComparatorEnum.IS_EMPTY,
        MergedComparatorEnum.NOT_IS_EMPTY,
      ],
      DateTime: [
        MergedComparatorEnum.EQUAL,
        MergedComparatorEnum.NOT_EQUAL,
        MergedComparatorEnum.GREATER_THAN,
        MergedComparatorEnum.GREATER_THAN_OR_EQUAL,
        MergedComparatorEnum.LESS_THAN,
        MergedComparatorEnum.LESS_THAN_OR_EQUAL,
        MergedComparatorEnum.IS_EMPTY,
        MergedComparatorEnum.NOT_IS_EMPTY,
        MergedComparatorEnum.AGO,
        MergedComparatorEnum.NOT_AGO,
        MergedComparatorEnum.UNTIL,
        MergedComparatorEnum.NOT_UNTIL,
      ],
      array: [
        MergedComparatorEnum.EXCLUDES,
        MergedComparatorEnum.INCLUDES,
        MergedComparatorEnum.IS_EMPTY,
        MergedComparatorEnum.NOT_IS_EMPTY,
      ],
      currency: [
        MergedComparatorEnum.EQUAL,
        MergedComparatorEnum.NOT_EQUAL,
        MergedComparatorEnum.GREATER_THAN,
        MergedComparatorEnum.GREATER_THAN_OR_EQUAL,
        MergedComparatorEnum.LESS_THAN,
        MergedComparatorEnum.LESS_THAN_OR_EQUAL,
        MergedComparatorEnum.IS_EMPTY,
        MergedComparatorEnum.NOT_IS_EMPTY,
      ],
    },
    numberDataTypes: ['number', 'numberSimple', 'int', 'intSimple', 'long', 'longSimple', 'double', 'doubleSimple', 'decimal', 'decimalSimple'],
  },
  ecosystem: {
    signInUrl: '/',
  },
})

enum ComparatorEnum {
  // Date
  AGO = 'ago',
  NOT_AGO = 'not.ago',
  UNTIL = 'for',
  NOT_UNTIL = 'not.for',
  // Complex
  INCLUDES = 'incl',
  EXCLUDES = 'excl',
  STARTS_WITH_IN = 'stw.in',
  NOT_STARTS_WITH_IN = 'not.stw.in',
}

type DataType
  = | 'int'
    | 'long'
    | 'double'
    | 'DateTime'
    | 'array'
    | 'decimal'
