<script setup lang="ts">
import { getComponentMergedProps, getComponentProps } from '$ui'
import { useFormUtils } from '#layers/ui/client/components/Form/composables/useFormUtils'

// Types
import type { IFormProps } from '$ui'

type IProps = IFormProps & {
  isEditing?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  ...getComponentProps('form'),
})

defineEmits<{
  (e: 'submit', payload?: any): void
  (e: 'cancel'): void
}>()

// Utils
const { getFormProps, getFormControlsProps } = useFormUtils()

const mergedProps = computed(() => {
  return getComponentMergedProps('form', props)
})

// Layout
const formProps = getFormProps(props)
const formControlsProps = getFormControlsProps(props)
const isConfirmationOpen = ref(false)
const isEditing = defineModel<boolean>('isEditing', { default: true })
</script>

<template>
  <Form
    v-bind="{ ...formProps, ...mergedProps }"
    v-model:is-editing="isEditing"
    @submit="$emit('submit', $event)"
    @cancel="$emit('cancel')"
    @confirmation="isConfirmationOpen = true"
  >
    <slot />

    <template #controls="controlsProps">
      <div
        id="form-controls"
        class="form__controls"
        :class="controlsProps.controlsClass"
        :style="controlsProps.controlsStyle"
      >
        <slot name="controls-start" />

        <FormControls
          v-bind="{ ...formControlsProps, ...controlsProps }"
          m="l-auto"
        >
          <template #confirmation>
            <FormConfirmation
              v-model="isConfirmationOpen"
              @ok="$emit('submit', $event)"
            />
          </template>
        </FormControls>
      </div>
    </template>
  </Form>
</template>

<style lang="scss" scoped>
.form__controls {
  @apply flex gap-2 p-x-3 p-y-2;
}
</style>
