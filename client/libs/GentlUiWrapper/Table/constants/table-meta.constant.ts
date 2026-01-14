export enum TdopsDataTables {
  // Administration
  AUTHORIZED_PERSONS,

  // Business day
  BUSINESS_DAYS,

  // Cash registers
  CASH_REGISTERS,

  // Cash requests
  CASH_REQUESTS,

  // Data tables
  DENOMINATIONS,

  // Payment orders
  PAYMENT_ORDERS,

  // Vault cash states
  VAULT_CASH_STATES,
}

type TdopsTableMeta = {
  tableId: string
  endpoint: string
  translationPrefix: string
  storageKey: string
  viewCode?: string
}

export const TDOPS_TABLE_META: Record<TdopsDataTables, TdopsTableMeta> = {
  // Administration
  [TdopsDataTables.AUTHORIZED_PERSONS]: {
    tableId: 'authorizedPersonsTable',
    endpoint: 'authorized-persons',
    translationPrefix: 'authorizedPerson',
    storageKey: 'AuthorizedPersonsTable',
  },

  // Business day
  [TdopsDataTables.BUSINESS_DAYS]: {
    tableId: 'businessDaysTable',
    endpoint: 'business-days',
    translationPrefix: 'businessDay',
    storageKey: 'BusinessDaysTable',
  },

  // Cash registers
  [TdopsDataTables.CASH_REGISTERS]: {
    tableId: 'cashRegistersTable',
    endpoint: 'cash-registers',
    translationPrefix: 'cashRegister',
    storageKey: 'CashRegistersTable',
  },

  // Cash requests
  [TdopsDataTables.CASH_REQUESTS]: {
    tableId: 'cashRequestsTable',
    endpoint: 'cash-requests',
    translationPrefix: 'cashRequest',
    storageKey: 'CashRequestsTable',
  },

  // Data tables
  [TdopsDataTables.DENOMINATIONS]: {
    tableId: 'denominationsTable',
    endpoint: 'denominations',
    translationPrefix: 'denomination',
    storageKey: 'DenominationsTable',
  },

  // Payment orders
  [TdopsDataTables.PAYMENT_ORDERS]: {
    tableId: 'paymentOrdersTable',
    endpoint: 'payment-orders',
    translationPrefix: 'paymentOrder',
    storageKey: 'PaymentOrdersTable',
  },

  // Vault cash states
  [TdopsDataTables.VAULT_CASH_STATES]: {
    tableId: 'vaultCashStatesTable',
    endpoint: 'vault-cash-states',
    translationPrefix: 'vaultCashState',
    storageKey: 'VaultCashStatesTable',
  },
}
