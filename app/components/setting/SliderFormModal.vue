<script setup lang="ts">
const { $settings } = useNuxtApp()
interface Props {
  modelValue: boolean
  state: {
    title: string
    description: string
    items: Array<{
      type: 'image' | 'video'
      url: string
      title: string
      subtitle?: string
      description?: string
      order: number
    }>
  }
  editMode?: boolean
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'update:state', 'submit', 'close'])

// State'in bir kopyasını ref olarak tutuyoruz
const localState = ref({ ...props.state })

// Props değişikliklerini izle ve local state'i güncelle
watchEffect(() => {
  localState.value = { ...props.state }
})

const showMediaSelector = ref(false)
const selectedMedias = ref<string[]>([])
const adding = ref(false)

const updateState = (newState: Partial<Props['state']>) => {
  try {
    const updatedState = { ...localState.value, ...newState }
    localState.value = updatedState
    emit('update:state', updatedState)
  } catch (error) {
    console.error('State update error:', error)
  }
}

// Medya seçim işleyicisi güncellendi
const handleMediaSelect = (urls: string[] | undefined) => {
  if (!Array.isArray(urls) || urls.length === 0) return

  try {
    const currentItems = [...localState.value.items]
    const newItems = urls.map((url) => {
      const type = url.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? 'video' : 'image'
      return {
        type,
        url,
        title: '',
        subtitle: '',
        description: '',
        order: currentItems.length
      }
    }).filter(newItem => !currentItems.some(item => item.url === newItem.url))

    updateState({ items: [...currentItems, ...newItems] })

    selectedMedias.value = []
    showMediaSelector.value = false

    useToast().add({
      title: 'Success',
      description: `${newItems.length} media added`,
      color: 'green'
    })
  } catch (error) {
    console.error('Media selection error:', error)
    useToast().add({
      title: 'Error',
      description: 'An error occurred while adding media',
      color: 'red'
    })
  }
}

// Form submit handler'ı değiştir
const handleSubmit = () => {
  if (!localState.value.title?.trim()) {
    useToast().add({
      title: 'Warning',
      description: 'Slider title is required',
      color: 'yellow'
    })
    return false
  }

  // Form verilerini ana bileşene gönder
  const formData = {
    title: localState.value.title.trim(),
    description: localState.value.description?.trim() || '',
    items: localState.value.items || []
  }

  emit('update:state', formData)
  emit('submit')
  return true
}

// Input değişikliği için yeni method
const handleInputChange = (field: string, value: any) => {
  localState.value[field] = value
  updateState({ [field]: value })
}

const addSelectedMedia = () => {
  adding.value = true
  try {
    selectedMedias.value.forEach((url) => {
      const type = url.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? 'video' : 'image'
      const newItems = [...props.state.items, {
        type,
        url,
        title: '',
        description: '',
        order: props.state.items.length
      }]
      updateState({ items: newItems })
    })

    selectedMedias.value = []
    showMediaSelector.value = false
  } finally {
    adding.value = false
  }
}

const removeSlide = (index: number) => {
  const newItems = [...props.state.items]
  newItems.splice(index, 1)
  updateState({ items: newItems })
}

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const sortableEl = ref<HTMLElement | null>(null)

const sortableInstance = ref<any>(null)

// Sortable.js instance'ını güncelleyen fonksiyon
const initSortable = async () => {
  if (sortableEl.value) {
    const Sortable = (await import('sortablejs')).default

    if (sortableInstance.value) {
      sortableInstance.value.destroy()
    }

    sortableInstance.value = new Sortable(sortableEl.value, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      forceFallback: true, // Bu önemli
      fallbackClass: 'sortable-fallback', // Fallback sınıfı
      onStart: (evt) => {
        document.body.style.cursor = 'grabbing'
      },
      onEnd: (evt) => {
        document.body.style.cursor = 'default'
        // Sıralamayı güncelle
        const newItems = [...localState.value.items]
        const movedItem = newItems.splice(evt.oldIndex!, 1)[0]
        newItems.splice(evt.newIndex!, 0, movedItem)

        // Order'ları güncelle
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index
        }))

        updateState({ items: updatedItems })
      }
    })
  }
}

// Items değiştiğinde Sortable'ı yeniden başlat
watch(() => localState.value.items, () => {
  nextTick(() => {
    initSortable()
  })
}, { deep: true })

// Component mount olduğunda Sortable'ı başlat
onMounted(() => {
  initSortable()
})

// Component unmount olduğunda Sortable instance'ını temizle
onBeforeUnmount(() => {
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
  }
})
</script>

<template>
  <UModal
    :model-value="modelValue"
    :ui="{
      width: 'max-w-6xl',
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }"
    :prevent-close="true"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="p-6 space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2
          class="text-2xl font-semibold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent"
        >
          {{ editMode ? 'Edit Slider' : 'Add New Slider' }}
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
          @click="closeModal"
        />
      </div>

      <form
        class="space-y-8"
        @submit.prevent="handleSubmit"
      >
        <!-- Main Info Section -->
        <div class="grid grid-cols-1 gap-3">
          <UFormGroup
            label="Slider Title"
            required
          >
            <UInput
              v-model="localState.title"
              placeholder="Enter main title..."
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @update:model-value="updateState({ title: $event })"
            />
          </UFormGroup>
          <UFormGroup label="Description">
            <UTextarea
              v-model="localState.description"
              placeholder="Enter general description..."
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @update:model-value="updateState({ description: $event })"
            />
          </UFormGroup>
        </div>

        <!-- Media Items Section -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <!-- Media Items Header -->
          <div class="flex items-center justify-center mb-4">
            <div
              class="border-2 border-dotted border-gray-300 dark:border-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:border-primary-500"
              @click="showMediaSelector = true"
            >
              <div class="text-center">
                <UIcon
                  name="i-heroicons-plus-circle"
                  class="w-12 h-12 mx-auto text-gray-400 mb-2"
                />
                <div>
                  <h3 class="text-lg font-semibold">
                    Add Slider Item
                  </h3>
                  <p class="text-sm text-gray-500">
                    You can add and edit your images and videos
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <!-- Selected Items List -->
            <div
              ref="sortableEl"
              class="space-y-2"
            >
              <div
                v-for="(item, index) in localState.items"
                :key="item.url + index"
                class="sortable-item group bg-white dark:bg-gray-900 relative rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 hover:shadow-md transition-all duration-200"
                :data-index="index"
              >
                <div class="flex items-start gap-1 drag-handle cursor-grab group relative">
                  <div
                    class="absolute w-full h-full aspect-video rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <video
                      v-if="item.type === 'video'"
                      :src="item.url"
                      class="w-full h-full object-cover"
                      autoplay
                      muted
                      loop
                      playsinline
                    />
                    <img
                      v-else
                      :src="item.url"
                      class="w-full h-full object-cover"
                    >
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div
                      class="absolute bottom-2 left-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {{ item.type === 'video' ? 'Video' : 'Image' }}
                    </div>
                  </div>

                  <div class="flex-1 flex gap-2 items-center justify-center z-10">
                    <!-- Content -->
                    <div class="flex-grow space-y-2 pb-2">
                      <UInput
                        v-model="item.title"
                        variant="none"
                        placeholder="Add title..."
                        class="bg-black/60 m-2 backdrop-blur-sm p-2"
                        :ui="{
                          rounded: $settings.uiConfig.rounded,
                          shadow: $settings.uiConfig.shadow,
                          background: $settings.uiConfig.background,
                          ring: $settings.uiConfig.border
                        }"
                      />
                      <UInput
                        v-model="item.subtitle"
                        variant="none"
                        placeholder="Add subtitle..."
                        class="bg-black/60 m-2 backdrop-blur-sm p-2"
                        :ui="{
                          rounded: $settings.uiConfig.rounded,
                          shadow: $settings.uiConfig.shadow,
                          background: $settings.uiConfig.background,
                          ring: $settings.uiConfig.border
                        }"
                      />
                      <UTextarea
                        v-model="item.description"
                        variant="none"
                        placeholder="Add description..."
                        class="bg-black/60 m-2 backdrop-blur-sm p-2"
                        :rows="3"
                        :ui="{
                          rounded: $settings.uiConfig.rounded,
                          shadow: $settings.uiConfig.shadow,
                          background: $settings.uiConfig.background,
                          ring: $settings.uiConfig.border
                        }"
                      />
                    </div>
                  </div>
                </div>
                <UIcon
                  name="i-material-symbols-drag-pan"
                  class="w-12 h-12 absolute top-1/2 right-5 group-hover:animate-pulse opacity-0 group-hover:opacity-100 z-10 pointer-events-none"
                />
                <UBadge
                  :label="(index + 1).toString()"
                  color="cyan"
                  size="xs"
                  variant="solid"
                  class="w-6 h-6 flex items-center justify-center absolute -top-1 -right-1 z-30"
                  :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }"
                />
                <UButton
                  color="red"
                  variant="solid"
                  icon="i-heroicons-trash"
                  size="xs"
                  class="w-6 h-6 flex items-center justify-center absolute -top-1 -left-1 z-30"
                  :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }"
                  @click="removeSlide(index)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <UButton
            color="gray"
            variant="soft"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
            @click="closeModal"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="primary"
            :loading="loading"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            {{ editMode ? 'Update' : 'Save' }}
          </UButton>
        </div>
      </form>

      <!-- Media Selection Modal -->
      <UModal
        v-if="showMediaSelector"
        v-model="showMediaSelector"
        :persistent="true"
        :ui="{
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">
              Media Selection
            </h3>
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
              @click="showMediaSelector = false"
            />
          </div>

          <MediaSelectorMulti
            v-model="selectedMedias"
            class="min-h-[400px]"
          />

          <!-- Seçim Onay Butonları -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            <UButton
              color="gray"
              block
              variant="soft"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="showMediaSelector = false"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              block
              :loading="adding"
              :disabled="selectedMedias.length === 0"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="handleMediaSelect(selectedMedias)"
            >
              {{ selectedMedias.length ? `Add ${selectedMedias.length} Items` : 'Add' }}
            </UButton>
          </div>
        </div>
      </UModal>
    </div>
  </UModal>
</template>

<style scoped>
.drag-handle {
    touch-action: none;
    cursor: grab;
}

.drag-handle:active {
    cursor: grabbing;
}

/* Sürükleme sırasındaki görünüm */
.sortable-ghost {
    opacity: 0.3;
    background: #e5e7eb !important;
    border: 2px dashed #9ca3af !important;
}

/* Sürüklenen öğenin görünümü */
.sortable-drag {
    cursor: grabbing !important;
    opacity: 0.9;
    transform: scale(1.05);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.sortable-item {
    user-select: none;
}

.sortable-fallback {
    opacity: 0.8;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: rotate(2deg);
}

.drag-handle {
    touch-action: none;
    cursor: grab !important;
}

.drag-handle:active {
    cursor: grabbing !important;
}

.sortable-ghost {
    opacity: 0.2;
    background: #f3f4f6 !important;
    border: 2px dashed #9ca3af !important;
}
</style>
