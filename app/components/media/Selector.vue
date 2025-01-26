<template>
  <div>
    <div class="space-y-4">
      <!-- Current Media Preview -->
      <div
        class="relative group cursor-pointer w-full aspect-video"
        @click="showMediaModal = true"
      >
        <!-- Video Preview -->
        <video
          v-if="type === 'video' && modelValue"
          :key="modelValue"
          class="w-full h-full object-cover rounded-lg"
          autoplay
          muted
          loop
          playsinline
        >
          <source
            :src="modelValue"
            type="video/mp4"
          >
        </video>
        <!-- Image Preview -->
        <img
          v-else
          :src="modelValue || defaultImage"
          class="w-full h-full object-cover rounded-lg transition-all duration-300"
          :class="[modelValue ? 'border-2 border-primary-500' : 'border-2 border-dashed border-gray-300 dark:border-gray-700']"
        >

        <div
          class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50"
        >
          <UIcon
            :name="type === 'video' ? 'i-heroicons-video-camera' : 'i-heroicons-photo'"
            class="w-8 h-8 text-white"
          />
          <span class="text-sm text-white mt-2">{{ type === 'video' ? 'Video' : 'Görsel' }} Seç veya Yükle</span>
        </div>
      </div>

      <!-- Media Selection Modal -->
      <UModal
        v-model="showMediaModal"
        :ui="{
          width: 'max-w-5xl',
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">
              Select Media
            </h2>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="showMediaModal = false"
            />
          </div>

          <!-- Upload Section -->
          <div class="mb-6">
            <div
              class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:border-primary-500"
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
                  class="w-8 h-8 mx-auto text-gray-400"
                />
                <p class="mt-2 text-sm text-gray-500">
                  Click or drag to upload new {{ type === 'video' ? 'video'
                    : 'image' }}
                </p>
              </div>
              <input
                ref="fileInput"
                type="file"
                multiple
                :accept="type === 'video' ? 'video/*' : 'image/*'"
                class="hidden"
                @change="handleFileInput"
              >
            </div>
          </div>

          <!-- Media Grid -->
          <div
            v-if="loading"
            class="grid grid-cols-4 gap-4"
          >
            <div
              v-for="n in 8"
              :key="n"
              class="aspect-video animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          </div>

          <div
            v-else
            class="flex flex-wrap items-center justify-center gap-2 max-h-[400px] overflow-y-auto p-2"
          >
            <div
              v-for="item in paginatedItems"
              :key="item._id"
              class="relative group cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500"
              :class="{ 'ring-2 ring-primary-500': selectedUrl === item.url }"
              @click="selectMedia(item)"
            >
              <!-- Video Preview -->
              <video
                v-if="type === 'video'"
                :key="item.url"
                class="w-32 h-32 object-cover aspect-video"
                autoplay
                muted
                loop
                playsinline
              >
                <source
                  :src="item.url"
                  type="video/mp4"
                >
              </video>
              <!-- Image Preview -->
              <img
                v-else
                :src="item.url"
                :alt="item.title"
                class="w-32 h-32 object-cover aspect-video"
              >

              <div
                class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <UIcon
                  v-if="selectedUrl === item.url"
                  name="i-heroicons-check-circle"
                  class="w-8 h-8 text-primary-500"
                />
                <UIcon
                  v-else
                  name="i-heroicons-plus-circle"
                  class="w-8 h-8 text-white"
                />
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div class="mt-4 flex justify-center gap-2">
            <UButton
              :disabled="currentPage === 1"
              color="white"
              variant="soft"
              icon="i-heroicons-chevron-left"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="currentPage--"
            />
            <span class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              Page {{ currentPage }} / {{ totalPages }}
            </span>
            <UButton
              :disabled="currentPage === totalPages"
              color="white"
              variant="soft"
              icon="i-heroicons-chevron-right"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="currentPage++"
            />
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="showMediaModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="confirmSelection"
            >
              Select
            </UButton>
          </div>
        </div>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $settings } = useNuxtApp()
const props = defineProps({
  modelValue: String,
  defaultImage: {
    type: String,
    default: '/images/product.webp'
  },
  type: {
    type: String,
    default: 'image',
    validator: (value: string) => ['image', 'video'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const showMediaModal = ref(false)
const loading = ref(false)
const mediaItems = ref([])
const isDragging = ref(false)
const selectedUrl = ref(props.modelValue)
const fileInput = ref<HTMLInputElement>()

const toast = useToast()

const currentPage = ref(1)
const itemsPerPage = 24

// Fetch media items
const fetchMedia = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/media')
    mediaItems.value = response.media || []
  } catch (error) {
    console.error('Error fetching media:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load media list',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Handle file input change
const handleFileInput = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    await handleFiles(input.files)
  }
}

// Handle drop
const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    await handleFiles(event.dataTransfer.files)
  }
}

// Handle files
const handleFiles = async (files: FileList) => {
  const formData = new FormData()
  const allowedFiles = Array.from(files).filter((file) => {
    if (props.type === 'image') {
      return file.type.startsWith('image/')
    } else if (props.type === 'video') {
      return file.type.startsWith('video/')
    }
    return false
  })

  if (allowedFiles.length === 0) {
    toast.add({
      title: 'Warning',
      description: `Please upload only ${props.type === 'image' ? 'image' : 'video'} files`,
      color: 'yellow'
    })
    return
  }

  // Dosya boyutu kontrolü (video için)
  if (props.type === 'video') {
    const maxSize = 100 * 1024 * 1024 // 100MB
    const oversizedFiles = allowedFiles.filter(file => file.size > maxSize)

    if (oversizedFiles.length > 0) {
      toast.add({
        title: 'Warning',
        description: 'Video file must be smaller than 100MB',
        color: 'yellow'
      })
      return
    }
  }

  allowedFiles.forEach((file) => {
    formData.append('files', file)
  })

  try {
    loading.value = true
    const response = await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })

    toast.add({
      title: 'Success',
      description: `${props.type === 'image' ? 'Image' : 'Video'} uploaded successfully`,
      color: 'green'
    })

    await fetchMedia()

    // Yeni yüklenen görseli seç
    if (response.files?.[0]?.url) {
      selectedUrl.value = response.files[0].url
      emit('update:modelValue', response.files[0].url)
    }
  } catch (error) {
    console.error('Upload error:', error)
    toast.add({
      title: 'Error',
      description: `${props.type === 'image' ? 'Image' : 'Video'} could not be uploaded`,
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Select media
const selectMedia = (item: any) => {
  selectedUrl.value = item.url
  emit('update:modelValue', item.url)
}

// Confirm selection
const confirmSelection = () => {
  emit('update:modelValue', selectedUrl.value)
  showMediaModal.value = false
}

// Watch for modal opening
watch(showMediaModal, (newValue) => {
  if (newValue) {
    currentPage.value = 1
    fetchMedia()
  }
})

// Initialize selected URL when modelValue changes
watch(() => props.modelValue, (newValue) => {
  selectedUrl.value = newValue
})

// Sadece görselleri filtrele
const filteredMediaItems = computed(() => {
  return mediaItems.value.filter(item => item.type === props.type)
})

// Computed properties for pagination
const totalPages = computed(() => {
  return Math.ceil(filteredMediaItems.value.length / itemsPerPage)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMediaItems.value.slice(start, end)
})

// Watch for filter changes to reset page
watch(filteredMediaItems, () => {
  currentPage.value = 1
})
</script>
