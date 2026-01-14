import { TableColumn } from '$ui'

export function useAuditColumns() {
  function getAuditColumnDefinitions() {
    return computed(() => [
      // Created at
      new TableColumn({
        field: 'createdAt',
        label: $t('general.createdAt'),
        dataType: 'datetime',
      }),

      // Updated at
      new TableColumn({
        field: 'updatedAt',
        label: $t('general.updatedAt'),
        dataType: 'datetime',
      }),

      // Created by
      new TableColumn({
        field: 'createdBy',
        label: $t('general.createdBy'),
      }),

      // Updated by
      new TableColumn({
        field: 'updatedBy',
        label: $t('general.updatedBy'),
      }),
    ])
  }

  return { getAuditColumnDefinitions }
}
