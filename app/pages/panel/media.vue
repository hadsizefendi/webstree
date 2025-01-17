<template>
  <div>
    <div id="home" class="absolute top-0" />
    <UContainer class="py-8">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b dark:border-gray-800">
        <div class="flex items-center gap-3">
          <UButton icon="i-heroicons-arrow-left" color="white" variant="ghost" size="sm"
            class="!rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" @click="navigateTo('/panel')" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }" />
          <div>
            <h1 class="text-2xl font-semibold">
              Media Management
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ pagination?.total || 0 }} media items • {{ selectedItems.length ? `${selectedItems.length} selected` :
                'No selection' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton color="gray" variant="soft" icon="i-heroicons-arrow-path" :loading="loading" size="sm"
            @click="fetchMedia" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }">
            Refresh
          </UButton>
        </div>
      </div>
      <UCard class="overflow-hidden relative mb-8" :ui="{
        rounded: $settings.uiConfig.rounded,
        shadow: $settings.uiConfig.shadow,
        background: $settings.uiConfig.background,
        ring: $settings.uiConfig.border
      }">
        <div class="relative overflow-hidden p-8">
          <div
            class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            :class="{ 'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging }"
            @dragenter.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @dragover.prevent
            @drop.prevent="handleDrop" @click="$refs.fileInput.click()">
            <div class="text-center">
              <UIcon name="i-heroicons-cloud-arrow-up" class="w-12 h-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-sm font-medium">
                Drag and drop media to upload
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                or click on the area
              </p>
            </div>

            <input ref="fileInput" type="file" multiple accept="image/*,video/*" class="hidden"
              @change="handleFileInput">
          </div>
        </div>
      </UCard>
      <div v-if="selectedItems.length > 0" class="fixed bottom-4 right-4 z-50 flex gap-2">
        <UButton color="gray" variant="solid" label="Clear Selection" icon="i-heroicons-x-mark" @click="clearSelection"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }" />
        <UButton color="red" variant="solid" :label="`Delete ${selectedItems.length} selected items`"
          icon="i-heroicons-trash" @click="confirmDelete({ ids: selectedItems })" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }" />
      </div>
      <div class="flex flex-wrap gap-3 items-center justify-center">
        <template v-if="loading">
          <div v-for="i in skeletonItems" :key="i" class="space-y-2">
            <USkeleton class="h-40 w-full" />
            <USkeleton class="h-4 w-3/4" />
            <USkeleton class="h-4 w-1/2" />
          </div>
        </template>
        <template v-else-if="mediaItems.length > 0">
          <MediaCard v-for="(item, index) in mediaItems" :key="item?._id || index" :item="item"
            :is-selected="isSelected(item?._id)" @preview="previewMedia(item)" @delete="confirmDelete(item)"
            @toggle-select="toggleSelect(item, index, $event)" />
        </template>

        <!-- Empty State -->
        <div v-else class="text-center py-12 w-full">
          <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No media yet</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Get started by adding new media.</p>
        </div>
      </div>

      <div v-if="pagination?.total > itemsPerPage" class="flex justify-center my-8">
        <UPagination v-model="page" :total="pagination?.total || 0" :page-count="itemsPerPage"
          :first-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'İlk', color: 'gray' }"
          :last-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Son', color: 'gray' }"
          :max="9" show-first show-last />
      </div>
      <MediaPreview v-model="showPreview" :media="selectedMedia" @delete="confirmDelete(selectedMedia)" />
      <UModal v-model="showDeleteConfirm" :ui="{
        rounded: $settings.uiConfig.rounded,
        shadow: $settings.uiConfig.shadow,
        background: $settings.uiConfig.background,
        ring: $settings.uiConfig.border
      }">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Delete Media</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ mediaToDelete?.ids ? `Are you sure you want to delete ${mediaToDelete.ids.length} media items?` : 'Are you sure you want to delete this media?' }} This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showDeleteConfirm = false" label="Cancel" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }" />
            <UButton color="red" :loading="loading" @click="deleteMedia(mediaToDelete)" label="Delete" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }" />
          </div>
        </div>
      </UModal>
      <UModal v-model="isUploading" prevent-close :ui="{
        rounded: $settings.uiConfig.rounded,
        shadow: $settings.uiConfig.shadow,
        background: $settings.uiConfig.background,
        ring: $settings.uiConfig.border
      }">
        <UCard :ui="{
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-arrow-up-on-square" class="w-5 h-5" />
                <h3 class="text-base font-semibold">
                  Uploading Media
                </h3>
              </div>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="isUploading = false" :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }" />
            </div>
          </template>
          <div class="py-8 flex flex-col items-center justify-center space-y-4">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
            <p class="text-sm text-gray-500">
              Please wait while media files are being uploaded...
            </p>
          </div>
        </UCard>
      </UModal>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
const { $settings } = useNuxtApp()
import { ref, watch, onMounted } from 'vue'
useSeoMeta({
  title: 'Media Management',
  ogTitle: 'Media Management',
  description: 'Media Management',
  ogDescription: 'Media Management'
})

const toast = useToast()
const page = ref(1)
const loading = ref(false)
const isUploading = ref(false)
const mediaItems = ref<any[]>([])
const itemsPerPage = 24
const selectedItems = ref<string[]>([])
const lastSelectedIndex = ref(-1)
const isDragging = ref(false)
const showPreview = ref(false)
const showDeleteConfirm = ref(false)
const mediaToDelete = ref<any>(null)
const selectedMedia = ref<any>(null)

const pagination = ref({
  total: 0
})

const skeletonItems = Array(itemsPerPage).fill(null)

async function fetchMedia() {
  loading.value = true
  try {
    const response = await $fetch('/api/media', {
      params: {
        page: page.value,
        limit: itemsPerPage
      }
    })

    if (response && response.media) {
      mediaItems.value = response.media
      pagination.value.total = response?.pagination?.total || 0
    } else {
      mediaItems.value = []
      pagination.value.total = 0
    }
  } catch (error) {
    console.error('Medya yüklenirken hata:', error)
    mediaItems.value = []
    pagination.value.total = 0
    toast.add({
      title: 'Error',
      description: 'Error loading media list',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const handleFileInput = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    await handleFileUpload(event)
  }
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    await handleFileUpload(event)
  }
}

const generateFileName = () => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0')

  return `up-${day}-${month}-${year}-t-${hours}-${minutes}-${seconds}-${milliseconds}`
}

const getFileExtension = (filename: string) => {
  return filename.substring(filename.lastIndexOf('.'))
}

async function handleFileUpload(event: any) {
  const files = event.target.files || event.dataTransfer?.files
  if (!files?.length) return

  isUploading.value = true

  try {
    const formData = new FormData()
    for (const file of files) {
      const fileName = generateFileName() + getFileExtension(file.name)
      formData.append('files', file, fileName)
    }

    await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })

    toast.add({
      title: 'Success',
      description: 'Media uploaded successfully',
      color: 'green'
    })

    await fetchMedia()
  } catch (error) {
    console.error('Dosya yüklenirken hata:', error)
    toast.add({
      title: 'Error',
      description: 'Error uploading file',
      color: 'red'
    })
  } finally {
    isUploading.value = false
  }
}

const previewMedia = (media: any) => {
  selectedMedia.value = media
  showPreview.value = true
}

function confirmDelete(media: any) {
  mediaToDelete.value = media
  showDeleteConfirm.value = true
}

async function deleteMedia(media: any) {
  try {
    if (Array.isArray(media?.ids)) {
      await Promise.all(media.ids.map(mediaId =>
        $fetch(`/api/media/${mediaId}`, {
          method: 'DELETE'
        })
      ))
      selectedItems.value = []

      toast.add({
        title: 'Success',
        description: `${media.ids.length} media items deleted successfully`,
        color: 'green'
      })
    } else {
      await $fetch(`/api/media/${media._id}`, {
        method: 'DELETE'
      })

      toast.add({
        title: 'Success',
        description: 'Media deleted successfully',
        color: 'green'
      })
    }

    await fetchMedia()

    showDeleteConfirm.value = false
    showPreview.value = false
  } catch (error) {
    console.error('Medya silme hatası:', error)
    toast.add({
      title: 'Error',
      description: 'Error deleting media',
      color: 'red'
    })
  }
}

function isSelected(id: string) {
  return selectedItems.value.includes(id)
}

function toggleSelect(item: any, index: number, event: MouseEvent) {
  const id = item._id

  if (event.shiftKey && lastSelectedIndex.value !== -1) {
    const start = Math.min(lastSelectedIndex.value, index)
    const end = Math.max(lastSelectedIndex.value, index)
    const itemsToSelect = mediaItems.value.slice(start, end + 1)
    const idsToSelect = itemsToSelect.map(item => item._id)

    idsToSelect.forEach((id) => {
      if (!selectedItems.value.includes(id)) {
        selectedItems.value.push(id)
      }
    })
  } else {
    const index = selectedItems.value.indexOf(id)
    if (index === -1) {
      selectedItems.value.push(id)
    } else {
      selectedItems.value.splice(index, 1)
    }
  }
  lastSelectedIndex.value = index
}

function clearSelection() {
  selectedItems.value = []
  lastSelectedIndex.value = -1
}

watch(page, () => {
  fetchMedia()
})

onMounted(() => {
  fetchMedia()
})
</script>
