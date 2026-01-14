<script lang="ts" setup>
import { getComponentMergedProps, getComponentProps } from '$ui'
import type { IPageWrapperProps } from '$ui'

const props = withDefaults(defineProps<IPageWrapperProps>(), {
  ...getComponentProps('pageWrapper'),
})

const mergedProps = computed(() => {
  return getComponentMergedProps('pageWrapper', props)
})
</script>

<template>
  <PageWrapper
    v-bind="props"
    :ui="mergedProps.ui"
    :pad="false"
    :breadcrumbs="false"
  >
    <template
      v-if="!loading"
      #above
    >
      <TopBar>
        <template #breadcrumbs-append>
          <slot name="breadcrumbs-append" />
        </template>
      </TopBar>
    </template>

    <template
      v-if="!loading"
      #pageTitle
    >
      <PageTitle
        v-if="mergedProps.pageTitleProps?.title || $slots.title"
        v-bind="mergedProps.pageTitleProps"
      >
        <template #right>
          <slot name="title-right" />
        </template>
        <template #below>
          <slot name="title-below" />
        </template>

        <template #default>
          <slot name="title">
            {{ mergedProps.pageTitleProps?.title }}
          </slot>
        </template>
      </PageTitle>
    </template>
    <!-- Default slot -->
    <template v-if="!loading">
      <slot name="default" />
    </template>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.page-drawer.is-open.page-drawer--left.is-mini ~ .page-wrapper {
  margin-left: calc(var(--drawerLeftMiniWidth)) !important;
}
</style>
