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
  { label: 'Small', value: 'shadow-sm' },
  { label: 'Medium', value: 'shadow' },
  { label: 'Large', value: 'shadow-lg' },
  { label: 'Extra Large', value: 'shadow-xl' },
  { label: 'MAX', value: 'shadow-2xl' }
]
</script>
