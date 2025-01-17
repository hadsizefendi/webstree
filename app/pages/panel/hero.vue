<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div class="flex items-center gap-3">
          <UButton icon="i-heroicons-arrow-left" color="white" variant="ghost" size="sm"
            class="hover:bg-gray-100 dark:hover:bg-gray-800" @click="navigateTo('/panel')" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }" />
          <div>
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
              {{ editMode ? 'Edit Slider' : 'Slider Management' }}
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton color="gray" variant="soft" icon="i-heroicons-arrow-path" :loading="loading"
            class="shadow-sm hover:shadow-md transition-all" @click="refreshSliders" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }">
            Refresh
          </UButton>
          <UButton color="primary" variant="solid" icon="i-heroicons-plus" @click="showAddSliderForm" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            Add Slider
          </UButton>
        </div>
      </div>

      <!-- Sliders Grid -->
      <div class="flex flex-wrap items-center justify-center gap-6">
        <div v-if="loading" v-for="n in 6" :key="n"
          class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
        </div>

        <div v-else-if="sliders.length > 0" class="flex flex-wrap items-center justify-center gap-4">
          <UCard v-for="slider in sliders" :key="slider._id"
            class="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative" :ui="{
              body: { padding: '!p-0' },
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }">
            <!-- Aktif slider seçimi için checkbox ekliyoruz -->
            <div class="absolute top-2 left-2 z-30">
              <UCheckbox :model-value="activeSlider?._id === slider._id"
                @update:model-value="setActiveSlider(slider)" />
            </div>
            <div class="relative aspect-video w-40 h-40">
              <!-- Preview Grid -->
              <div class="absolute inset-0 grid grid-cols-2 gap-1">
                <template v-for="(item, index) in slider.items.slice(0, 4)" :key="index">
                  <div class="relative bg-gray-100 dark:bg-gray-800">
                    <video v-if="item.type === 'video'" :src="item.url" class="w-full h-full object-cover" autoplay
                      muted loop playsinline />
                    <img v-else :src="item.url" class="w-full h-full object-cover"
                      :alt="item.title || 'Slider görsel'" />
                    <div class="absolute inset-0 bg-black/50">
                      <div class="p-2 text-white">
                        <h4 class="text-sm font-bold">{{ item.title }}</h4>
                        <p v-if="item.subtitle" class="text-xs text-white/90">{{ item.subtitle }}</p>
                        <p v-if="item.description" class="text-xs text-white/80 line-clamp-2">{{ item.description }}</p>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent 
                opacity-60 group-hover:opacity-80 transition-all duration-300" />

              <!-- Content -->
              <div class="absolute inset-0 p-4 flex flex-col justify-between">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <UButton color="yellow" variant="solid" icon="i-heroicons-pencil-square" size="xs"
                    @click.stop="handleEdit(slider)" :ui="{
                      rounded: $settings.uiConfig.rounded,
                      shadow: $settings.uiConfig.shadow,
                      background: $settings.uiConfig.background,
                      ring: $settings.uiConfig.border
                    }" />
                  <UButton color="red" variant="solid" icon="i-heroicons-trash" size="xs"
                    @click.stop="deleteSlider(slider._id)" :ui="{
                      rounded: $settings.uiConfig.rounded,
                      shadow: $settings.uiConfig.shadow,
                      background: $settings.uiConfig.background,
                      ring: $settings.uiConfig.border
                    }" />
                </div>

                <div>
                  <h3 class="font-semibold text-lg text-white">{{ slider.title }}</h3>
                  <p v-if="slider.description" class="text-sm text-white/80 line-clamp-2 mt-1">
                    {{ slider.description }}
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    <UBadge color="white" variant="solid" size="sm" :ui="{
                      rounded: $settings.uiConfig.rounded,
                      shadow: $settings.uiConfig.shadow,
                      background: $settings.uiConfig.background,
                      ring: $settings.uiConfig.border
                    }">
                      {{ slider.items.length }} slides
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 w-full">
          <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No sliders yet</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new slider.</p>
        </div>
      </div>

      <!-- Slider Form Modal -->
      <SettingSliderFormModal v-model="showModal" v-model:state="editingSlider" :edit-mode="editMode" :loading="loading"
        @submit="handleSubmit" @close="resetForm" />

      <!-- Delete Confirmation Modal -->
      <UModal v-model="showDeleteModal" :ui="{
        rounded: $settings.uiConfig.rounded,
        shadow: $settings.uiConfig.shadow,
        background: $settings.uiConfig.background,
        ring: $settings.uiConfig.border
      }">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Delete Slider</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete this slider? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="showDeleteModal = false" label="Cancel" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }" />
            <UButton color="red" :loading="deleteLoading" @click="confirmDelete" label="Delete" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }" />
          </div>
        </div>
      </UModal>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useSeoMeta({
  title: 'Slider Management',
  ogTitle: 'Slider Management',
  description: 'Slider list and management',
  ogDescription: 'Slider list and management'
})
const { $settings } = useNuxtApp()
import { useSortable } from '@vueuse/integrations/useSortable'
import type { Options } from 'sortablejs'
// Core states
const toast = useToast()
const loading = ref(false)
const sliders = ref([])
const showModal = ref(false)
const editMode = ref(false)
const currentSliderId = ref<string | null>(null)

// Form state'i düzenlendi
const editingSlider = ref({
  title: '',
  description: '',
  items: []
})

// Aktif slider state'i
const activeSlider = ref(null)

// Add these state variables
const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const sliderToDelete = ref<string | null>(null)

// Sortable setup
const sortableEl = ref<HTMLElement | null>(null)
const sortableOptions = computed((): Options => ({
  animation: 200,
  handle: '.drag-handle',
  ghostClass: 'opacity-50',
  chosenClass: 'border-primary-500',
  dragClass: 'cursor-grabbing',
  onUpdate: (evt) => {
    // Sıralama güncellendiğinde order değerlerini güncelle
    editingSlider.value.items = Array.from(evt.from.children).map((el, index) => ({
      ...editingSlider.value.items[Number(el.getAttribute('data-index'))],
      order: index
    }))
  }
}))

// Initialize sortable
useSortable(sortableEl, editingSlider.value.items, sortableOptions)

// API calls
const refreshSliders = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/sliders')
    sliders.value = Array.isArray(response) ? response : []
  } catch (error) {
    // Change from toast.error to toast.add
    toast.add({
      title: 'Error',
      description: 'Sliders could not be loaded',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Settings'ten aktif slider'ı yükle
const loadActiveSlider = async () => {
  try {
    const settings = await $fetch('/api/settings')
    const activeSliderSetting = settings.find((s: any) => s.key === 'activeSlider')
    if (activeSliderSetting?.value) {
      activeSlider.value = sliders.value.find(s => s._id === activeSliderSetting.value)
    }
  } catch (error) {
    console.error('Active slider loading error:', error)
  }
}

// Aktif slider'ı ayarla
const setActiveSlider = async (slider: any) => {
  try {
    const { getUserInfo } = useAuth()
    const user = await getUserInfo()

    if (!user?._id) {
      throw new Error('User information could not be retrieved')
    }

    await $fetch('/api/settings/upsert', {
      method: 'POST',
      body: {
        key: 'activeSlider',
        value: slider._id,
        type: 'string',
        label: 'Active Slider',
        description: 'Slider to be displayed on the homepage',
        group: 'slider',
        createdBy: user._id
      }
    })

    activeSlider.value = slider
    toast.add({
      title: 'Success',
      description: 'Active slider updated',
      color: 'green'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'An error occurred while updating the slider',
      color: 'red'
    })
  }
}

// Form handlers
const showAddSliderForm = () => {
  editMode.value = false
  resetForm()
  showModal.value = true
}

const handleEdit = (slider: any) => {
  editMode.value = true
  currentSliderId.value = slider._id
  Object.assign(editingSlider.value, {
    title: slider.title,
    description: slider.description,
    items: [...slider.items]
  })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const { getUserInfo } = useAuth()
    const user = await getUserInfo()

    if (!user?._id) {
      throw new Error('User information could not be retrieved')
    }

    // State kontrolü ekle
    if (!editingSlider.value.title?.trim()) {
      toast.add({
        title: 'Warning',
        description: 'Slider title is required',
        color: 'yellow'
      })
      loading.value = false
      return
    }

    const payload = {
      title: editingSlider.value.title.trim(),
      description: editingSlider.value.description?.trim() || '',
      items: editingSlider.value.items || [],
      createdBy: user._id
    }

    console.log('Final payload:', payload) // Debug için

    const endpoint = editMode.value
      ? `/api/sliders/${currentSliderId.value}`
      : '/api/sliders/add'

    const response = await $fetch(endpoint, {
      method: editMode.value ? 'PUT' : 'POST',
      body: payload
    })

    if (!response) throw new Error('Server did not respond')

    toast.add({
      title: 'Success',
      description: `Slider successfully ${editMode.value ? 'updated' : 'created'}`,
      color: 'green'
    })

    showModal.value = false
    resetForm()
    refreshSliders()
  } catch (error: any) {
    console.error('Slider operation error:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Operation failed',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Helper functions
const resetForm = () => {
  editingSlider.value = {
    title: '',
    description: '',
    items: []
  }
  editMode.value = false
  currentSliderId.value = null
  showModal.value = false
}

const removeSlide = (index: number) => {
  editingSlider.value.items.splice(index, 1)
}

const deleteSlider = (id: string) => {
  sliderToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!sliderToDelete.value) return

  deleteLoading.value = true
  try {
    await $fetch(`/api/sliders/${sliderToDelete.value}`, { method: 'DELETE' })
    toast.add({
      title: 'Success',
      description: 'Slider deleted',
      color: 'green'
    })
    showDeleteModal.value = false
    sliderToDelete.value = null
    refreshSliders()
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Slider could not be deleted',
      color: 'red'
    })
  } finally {
    deleteLoading.value = false
  }
}

// Initialize
onMounted(async () => {
  await refreshSliders()
  await loadActiveSlider()
})
</script>
