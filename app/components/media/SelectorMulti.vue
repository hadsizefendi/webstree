<template>
  <div class="space-y-6">
    <!-- Upload Section -->
    <div
      class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:border-primary-500"
      :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragging }"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="$refs.fileInput?.click()"
    >
      <div class="text-center">
        <UIcon
          name="i-heroicons-cloud-arrow-up"
          class="w-12 h-12 mx-auto text-gray-400 mb-2"
        />
        <p class="text-base text-gray-600 dark:text-gray-300">
          Drag images and videos here
        </p>
        <p class="mt-1 text-sm text-gray-500">
          or click to upload
        </p>
        <p class="mt-2 text-xs text-gray-400">
          Supported formats: PNG, JPG, WEBP, MP4, WEBM
        </p>
      </div>
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*,video/*"
        class="hidden"
        @change="handleFileInput"
      >
    </div>

    <!-- Media Grid -->
    <div class="space-y-4">
      <!-- Filter Tabs -->
      <div class="flex flex-wrap items-center gap-2 pb-4 border-b dark:border-gray-800">
        <UButton
          v-for="filter in filters"
          :key="filter.value"
          :color="activeFilter === filter.value ? 'primary' : 'gray'"
          variant="soft"
          block
          size="xs"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @click="activeFilter = filter.value"
        >
          <UIcon
            :name="filter.icon"
            class="mr-1"
          />
          {{ filter.label }}
          <UBadge
            v-if="filter.count"
            :color="activeFilter === filter.value ? 'white' : 'gray'"
            size="xs"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            {{ filter.count }}
          </UBadge>
        </UButton>
      </div>

      <!-- Grid View -->
      <div
        v-if="loading"
        class="flex flex-wrap items-center justify-center gap-4"
      >
        <div
          v-for="n in 12"
          :key="n"
          class="aspect-video animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
        />
      </div>

      <div
        v-else
        class="flex flex-wrap items-center justify-center gap-2"
      >
        <div
          v-for="item in filteredItems"
          :key="item._id"
          class="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500"
          :class="{ 'ring-2 ring-primary-500': isSelected(item.url) }"
          @click="toggleSelection(item)"
        >
          <!-- Preview -->
          <div class="h-full">
            <video
              v-if="item.type === 'video'"
              :src="item.url"
              class="w-24 h-24 object-cover"
              autoplay
              muted
              loop
              playsinline
            />
            <img
              v-else
              :src="item.url"
              class="w-24 h-24 object-cover"
            >
          </div>

          <!-- Selection Indicator -->
          <div
            class="absolute inset-0 flex items-center justify-center"
            :class="isSelected(item.url) ? 'bg-primary-500/20' : 'bg-black/40 opacity-0 hover:opacity-100'"
          >
            <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <UIcon
                :name="isSelected(item.url) ? 'i-heroicons-check' : 'i-heroicons-plus'"
                class="w-5 h-5 text-white"
              />
            </div>
          </div>

          <!-- Type Indicator -->
          <div class="absolute bottom-2 left-2 flex items-center gap-1">
            <UIcon
              :name="item.type === 'video' ? 'i-heroicons-video-camera' : 'i-heroicons-photo'"
              class="w-4 h-4 text-white"
            />
            <span class="text-xs text-white">{{ item.type === 'video' ? 'Video' : 'Görsel' }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!loading && filteredItems.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-heroicons-photo"
          class="w-12 h-12 mx-auto text-gray-400 mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          No media found
        </h3>
        <p class="text-gray-500 text-sm mt-2">
          Start by uploading images or videos
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const { $settings } = useNuxtApp()

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

// Local state
const isDragging = ref(false)
const loading = ref(false)
const mediaItems = ref([])
const selectedUrls = ref<string[]>([])

// Filter system
const filters = computed(() => [
  { label: 'Tümü', value: 'all', icon: 'i-heroicons-squares-2x2', count: mediaItems.value.length },
  { label: 'Görseller', value: 'image', icon: 'i-heroicons-photo', count: mediaItems.value.filter(i => i.type === 'image').length },
  { label: 'Videolar', value: 'video', icon: 'i-heroicons-video-camera', count: mediaItems.value.filter(i => i.type === 'video').length }
])

const activeFilter = ref('all')

// Filtered items based on active filter
const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return mediaItems.value
  return mediaItems.value.filter(item => item.type === activeFilter.value)
})

// Selection handling - Basitleştirilmiş
const toggleSelection = (item: any) => {
  if (!item?.url) return

  const urls = [...selectedUrls.value]
  const index = urls.indexOf(item.url)

  if (index === -1) {
    urls.push(item.url)
  } else {
    urls.splice(index, 1)
  }

  selectedUrls.value = urls
  emit('update:modelValue', urls)
}

const isSelected = (url: string) => selectedUrls.value.includes(url)

// Watch for external changes only
watch(() => props.modelValue, (newValue) => {
  selectedUrls.value = Array.isArray(newValue) ? [...newValue] : []
}, { immediate: true })

// API call for fetching media
const fetchMedia = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/media')
    mediaItems.value = Array.isArray(response.media) ? response.media : []
  } catch (error) {
    console.error('Error fetching media:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to load media list',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// File handling functions
const handleFiles = async (files: FileList) => {
  const formData = new FormData()
  const allowedFiles = Array.from(files).filter(file =>
    file.type.startsWith('image/') || file.type.startsWith('video/')
  )

  if (allowedFiles.length === 0) {
    useToast().add({
      title: 'Warning',
      description: 'Please select image or video files',
      color: 'yellow'
    })
    return
  }

  // Video boyut kontrolü
  const maxSize = 100 * 1024 * 1024 // 100MB
  const oversizedFiles = allowedFiles.filter(file =>
    file.type.startsWith('video/') && file.size > maxSize
  )

  if (oversizedFiles.length > 0) {
    useToast().add({
      title: 'Warning',
      description: 'Video files must be smaller than 100MB',
      color: 'yellow'
    })
    return
  }

  allowedFiles.forEach(file => formData.append('files', file))

  try {
    loading.value = true
    const response = await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })

    await fetchMedia() // Medya listesini güncelle

    useToast().add({
      title: 'Success',
      description: 'Media uploaded successfully',
      color: 'green'
    })
  } catch (error) {
    console.error('Upload error:', error)
    useToast().add({
      title: 'Error',
      description: 'Failed to upload media',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  selectedUrls.value = [...props.modelValue]
  fetchMedia()
})

// File handling functions
const handleFileInput = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    await handleFiles(input.files)
  }
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    await handleFiles(event.dataTransfer.files)
  }
}

// ... Rest of file handling and API calls from existing MediaSelector ...
</script>

<style scoped>
.grid {
  grid-auto-rows: 1fr;
}
</style>
