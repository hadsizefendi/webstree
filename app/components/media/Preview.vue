<template>
  <UModal
    :model-value="modelValue"
    :ui="{
      width: 'max-w-7xl',
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <UCard
      :ui="{
        rounded: $settings.uiConfig.rounded,
        shadow: $settings.uiConfig.shadow,
        background: $settings.uiConfig.background,
        ring: $settings.uiConfig.border
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex gap-2 w-full">
            <UButton
              block
              color="yellow"
              label="Close"
              variant="soft"
              icon="i-heroicons-x-mark"
              @click="$emit('update:modelValue', false)"
            />
          </div>
        </div>
      </template>

      <div class="relative rounded-lg bg-gray-900">
        <img
          v-if="media?.type === 'image'"
          :src="media?.url"
          :alt="media?.title"
          class="w-full h-full object-contain"
        >
        <video
          v-else
          :src="media?.url"
          controls
          class="w-full h-full object-contain"
        />
      </div>

      <div class="mt-4 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-medium">File Name:</span>
          <span>{{ media?.title }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Size:</span>
          <span>{{ formatFileSize(media?.size || 0) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Type:</span>
          <span>{{ media?.type === 'image' ? 'Image' : 'Video' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Upload Date:</span>
          <span>{{ formatDate(media?.createdAt) }}</span>
        </div>
      </div>
      <template #footer>
        <UButton
          block
          color="red"
          label="Delete"
          variant="soft"
          icon="i-heroicons-trash"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @click="$emit('delete')"
        />
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const { $settings } = useNuxtApp()
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  media: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue', 'delete'])

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Format date
const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
