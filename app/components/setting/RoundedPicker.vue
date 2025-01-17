<template>
  <USelect
    v-model="localValue"
    :options="options"
    size="sm"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change')
  }
})

const options = [
  { label: 'None', value: '' },
  { label: 'Small', value: 'rounded-md' },
  { label: 'Medium', value: 'rounded-lg' },
  { label: 'Large', value: 'rounded-xl' },
  { label: 'Full', value: 'rounded-3xl' }
]
</script>
