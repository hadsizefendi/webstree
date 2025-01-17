<template>
  <USelect v-model="localValue" :options="options" size="sm" />
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
  { label: 'Glassmorphism', value: '!bg-opacity-0 !backdrop-blur-2xl' },
  { label: 'Secondary Light', value: 'bg-gray-50 dark:bg-gray-800' },
  { label: 'Secondary', value: 'bg-gray-100 dark:bg-gray-700' },
  { label: 'Primary Light', value: 'bg-primary-50 dark:bg-primary-900' },
  { label: 'Primary', value: 'bg-primary-100 dark:bg-primary-800' },
  { 
    label: 'Gradient Primary', 
    value: 'bg-gradient-to-r from-primary-100 to-primary-300 dark:from-primary-900 dark:to-primary-700'
  },
  { 
    label: 'Gradient Secondary', 
    value: 'bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700'
  },
  { 
    label: 'Gradient Mix', 
    value: 'bg-gradient-to-r from-primary-100 to-gray-300 dark:from-primary-900 dark:to-gray-700'
  },
  { 
    label: 'Gradient Diagonal', 
    value: 'bg-gradient-to-br from-primary-100 via-gray-100 to-primary-300 dark:from-primary-900 dark:via-gray-900 dark:to-primary-700'
  }
]
</script>
