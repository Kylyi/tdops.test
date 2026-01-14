<script setup lang="ts">
  import type { ICollapseProps } from '$ui'
  import { getComponentMergedProps, getComponentProps } from '$ui'
  
  type IProps = ICollapseProps & {
    noCollapse?: boolean
    invalid?: boolean
    blocksOpenByName?: IItem
  
    /**
     * When true, the header class will be customized
     *
     * @default true
     */
    customHeaderClass?: boolean
  
    /**
     * When true, the content will have a form grid layout (2 columns on md and up)
     *
     * @default false
     */
    formGridContent?: boolean
  }
  
  const props = withDefaults(defineProps<IProps>(), {
    ...getComponentProps('collapse'),
    customHeaderClass: true,
  })
  
  defineEmits<{
    (e: 'before-show'): void
    (e: 'hide'): void
  }>()
  
  // Layout
  const blocksOpenByName = defineModel<IItem>('blocksOpenByName')
  
  // Utils
  const mergedProps = computed(() => {
    const merged = getComponentMergedProps('collapse', props)
  
    return {
      ...merged,
      ui: {
        ...merged.ui,
        ...props.customHeaderClass && {
          headerClass: isActive => {
            const color = props.invalid ? 'color-negative' : 'color-primary dark:color-white'
  
            return isActive
              ? `bg-slate-50 dark:bg-slate-900 ${color} font-700`
              : `bg-slate-50 dark:bg-slate-900${props.invalid ? ` ${color}` : ' dark:color-true-gray-300'}`
          },
        },
        ...props.formGridContent && {
          contentClass: () => '!grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-6 p-4 items-start',
        },
      } as ICollapseProps['ui'],
    }
  })
  
  // Layout
  const model = defineModel({ default: true })
  </script>
  
  <template>
    <Collapse
      v-if="!noCollapse"
      v-bind="$props"
      v-model="model"
      :ui="mergedProps.ui"
      :expand-icon="() => 'color-primary'"
      class="collapse"
      max-w="screen-lg"
      @before-show="$emit('before-show')"
      @hide="$emit('hide')"
    >
      <template #header="headerProps">
        <CollapseHeader
          v-bind="headerProps"
          :icon="$props.icon"
        >
          <template #title>
            <div flex="~ items-center grow">
              <!-- <span
                class="info-block__header-title"
                :class="typeof headerProps.ui?.titleClass === 'function' ? headerProps.ui.titleClass({ isOpen: headerProps.isOpen }) : headerProps.ui?.titleClass"
                :style="typeof headerProps.ui?.titleStyle === 'function' ? headerProps.ui.titleStyle({ isOpen: headerProps.isOpen }) : headerProps.ui?.titleStyle"
              >
                {{ title }}
              </span> -->
  
              <span
                class="info-block__header-title"
                :class="headerProps.ui?.titleClass"
              >
                {{ title }}
              </span>
  
              <slot name="title-suffix" />
  
              <div
                flex="~ gap-1"
                m="l-auto"
              >
                <SectionsToggle
                  v-if="blocksOpenByName"
                  v-model:blocks-open-by-name="blocksOpenByName"
                  size="sm"
                  @click.stop.prevent
                />
  
                <slot name="right" />
              </div>
            </div>
          </template>
        </CollapseHeader>
      </template>
  
      <template #default>
        <slot />
      </template>
    </Collapse>
  
    <template v-else>
      <div
        class="collapse"
        rounded="!t-3"
      >
        <div class="title title-uncollapsable">
          <span
            v-if="icon"
            :class="icon"
            class="icon"
          />
          {{ title }}
        </div>
        <slot />
      </div>
    </template>
  </template>
  
  <style scoped lang="scss">
  .collapse {
    @apply border-blue-50 border-2 rounded-2 dark:border-color-gray-900;
  }
  
  .info-block__header-title {
    @apply font-rem-14 font-semibold overflow-auto;
  }
  
  .title {
    @apply font-rem-18 select-none font-bold grow;
  
    &-uncollapsable {
      @apply bg-blue-50 dark:bg-gray-900 rounded-2 h-9 flex items-center p-x-4
        rounded-b-0 gap-2;
    }
  }
  .icon {
    @apply color-blue-500 dark: color-blue-700;
  }
  </style>
  