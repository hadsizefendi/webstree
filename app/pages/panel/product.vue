<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <!-- Improved Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b dark:border-gray-800">
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
              {{ editMode ? 'Edit Product' : 'Product Management' }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {{ selectedItems.length ? `${selectedItems.length} products selected` : 'No selection' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton color="gray" variant="soft" icon="i-heroicons-arrow-path" :loading="loading"
            class="shadow-sm hover:shadow-md transition-all" @click="refreshProducts" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }">
            Refresh
          </UButton>
          <UButton color="primary" variant="solid" icon="i-heroicons-plus" @click="showAddProductForm" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            Add Product
          </UButton>
        </div>
      </div>

      <!-- Product Form Modal -->
      <UModal v-model="showModal" :ui="{
        width: 'max-w-3xl',
        rounded: $settings.uiConfig.rounded,
        shadow: $settings.uiConfig.shadow,
        background: $settings.uiConfig.background,
        ring: $settings.uiConfig.border
      }">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h2
              class="text-2xl font-semibold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
              {{ editMode ? 'Edit Product' : 'Add New Product' }}
            </h2>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="closeModal" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }" />
          </div>


          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Image Upload -->
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Product Cover Image
              </label>
              <MediaSelector v-model="state.imageUrl" default-image="/images/product.webp" />
            </div>

            <!-- Rest of the form fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="Product Name" required>
                <UInput v-model="state.name" placeholder="Enter product name..." icon="i-heroicons-tag" :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }" />
              </UFormGroup>

              <UFormGroup label="Price (Optional)">
                <UInput v-model="state.price" type="number" placeholder="Enter price..."
                  icon="i-heroicons-currency-dollar" :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }" />
              </UFormGroup>
            </div>

            <UFormGroup label="Description (Optional)">
              <UTextarea v-model="state.description" placeholder="Enter product description..." :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }" />
            </UFormGroup>

            <!-- Kategori Seçimi -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-6">
              <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <span class="i-heroicons-tag text-blue-500" />
                Category Selection <span class="text-red-500">*</span>
              </h3>

              <!-- Category Selection -->
              <div class="space-y-4">
                <!-- Category Dropdown -->
                <USelectMenu v-model="selectedCategoryIds" by="_id" :options="allCategories" option-attribute="title"
                  searchable-placeholder="Kategori ara..." multiple searchable @update:model-value="onUpdateCategories"
                  :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }">
                  <template #label>
                    <template v-if="selectedCategoryIds.length">
                      <div class="flex items-center gap-2">
                        <div class="flex -space-x-2">
                          <UAvatar v-for="category in selectedCategoryIds" :key="category._id" :src="category.image"
                            :alt="category.title" size="2xs" />
                        </div>
                        <span>{{ selectedCategoryIds.length }} categories</span>
                      </div>
                    </template>
                    <template v-else>
                      <span class="text-gray-500 dark:text-gray-400">Select categories</span>
                    </template>
                  </template>
                  <template #option-empty="{ query }">
                    <q>{{ query }}</q> not found.
                  </template>
                  <template #option="{ option }">
                    <div class="flex items-center gap-2">
                      <UAvatar :src="option.image" :alt="option.title" size="2xs" />
                      <span>{{ option.title }}</span>
                    </div>
                  </template>
                </USelectMenu>

                <!-- Selected Categories Display -->
                <div v-if="selectedCategories.length > 0" class="mt-4 space-y-2">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selected Categories:
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <div v-for="category in selectedCategories" :key="category._id"
                      class="group relative flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <UAvatar :src="category.image || '/images/category.webp'" :alt="category.title" size="2xs" />
                      <div class="flex flex-col">
                        <span class="text-sm font-medium">{{ category.title }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {{ category.description }}
                        </span>
                      </div>
                      <UButton color="red" variant="ghost" icon="i-heroicons-x-mark" size="xs"
                        class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="removeCategory(category._id)" :ui="{
                          rounded: $settings.uiConfig.rounded,
                          shadow: $settings.uiConfig.shadow,
                          background: $settings.uiConfig.background,
                          ring: $settings.uiConfig.border
                        }" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medya Seçimi -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-6">
              <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <span class="i-heroicons-photo text-blue-500" />
                Product Media Gallery
              </h3>

              <!-- MediaSelectorMulti kullanımı -->
              <div class="space-y-4">
                <div class="flex items-center justify-center">
                  <div
                    class="border-2 border-dotted border-gray-300 dark:border-gray-700 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:border-primary-500"
                    @click="showMediaSelector = true">
                    <div class="text-center">
                      <UIcon name="i-heroicons-plus-circle" class="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <div>
                        <h3 class="text-lg font-semibold">Add Media</h3>
                        <p class="text-sm text-gray-500">Add and edit your images and videos</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Seçilen Medyaların Listesi -->
                <div ref="sortableEl" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="(item, index) in state.media" :key="index"
                    class="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-move drag-handle"
                    :data-index="index">
                    <!-- Video Preview -->
                    <video v-if="item.type === 'video'" :src="item.url" class="w-40 h-40 object-cover" autoplay muted
                      loop playsinline />
                    <!-- Image Preview -->
                    <img v-else :src="item.url" class="w-40 h-40 object-cover" />

                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div class="absolute top-2 right-2 flex gap-2">
                        <UButton color="red" variant="solid" icon="i-heroicons-trash" size="xs"
                          @click.prevent="removeMedia(index)" :ui="{
                            rounded: $settings.uiConfig.rounded,
                            shadow: $settings.uiConfig.shadow,
                            background: $settings.uiConfig.background,
                            ring: $settings.uiConfig.border
                          }" />
                      </div>
                      <div class="absolute bottom-2 left-2 text-white text-xs">
                        {{ item.type === 'video' ? 'Video' : 'Görsel' }} #{{ index + 1 }}
                      </div>
                    </div>
                    <UBadge :label="index + 1" :ui="{
                      rounded: $settings.uiConfig.rounded,
                      shadow: $settings.uiConfig.shadow,
                      background: $settings.uiConfig.background,
                      ring: $settings.uiConfig.border
                    }" />

                    <!-- Sürükleme göstergesi ekle -->
                    <UIcon name="i-material-symbols-drag-pan"
                      class="absolute top-2 left-2 w-6 h-6 text-white opacity-0 group-hover:opacity-100 z-20 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-6">
              <UButton color="gray" variant="soft" @click="closeModal" :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }">
                Cancel
              </UButton>
              <UButton type="submit" color="primary" :loading="loading" :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }">
                {{ editMode ? 'Update' : 'Save' }}
              </UButton>
            </div>
          </form>

          <!-- Media Selection Modal - Ana modalın içine taşındı -->
          <UModal v-if="showMediaSelector" v-model="showMediaSelector" :ui="{
            width: 'max-w-5xl',
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">Media Selection</h3>
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showMediaSelector = false" :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }" />
              </div>

              <MediaSelectorMulti v-model="selectedMedias" class="min-h-[400px]" />

              <div class="flex justify-end gap-3 mt-4">
                <UButton color="gray" variant="soft" @click="showMediaSelector = false" :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }">
                  Cancel
                </UButton>
                <UButton color="primary" :disabled="selectedMedias.length === 0" @click="handleMediaSelect" :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }">
                  {{ selectedMedias.length ? `Add ${selectedMedias.length} Items` : 'Add' }}
                </UButton>
              </div>
            </div>
          </UModal>
        </div>
      </UModal>

      <!-- Products Grid -->
      <div class="space-y-8">
        <!-- Loading Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <UCard v-for="n in 8" :key="n" class="overflow-hidden" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            <div class="animate-pulse">
              <div class="aspect-square bg-gray-200 dark:bg-gray-700"></div>
              <div class="p-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Products List -->
        <div v-else-if="products.length > 0" class="flex flex-wrap items-center justify-center gap-4">
          <UCard v-for="product in products" :key="product._id"
            class="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            :class="{ 'ring-2 ring-primary-500': selectedItems.includes(product._id) }" :ui="{ body: { padding: '!p-0' },
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }">
            <div class="relative aspect-square">
              <img :src="product.imageUrl || '/images/product.webp'" :alt="product.name"
                class="w-40 h-40 object-cover opacity-100 group-hover:opacity-20 duration-500">
              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              <!-- Selection Indicator -->
              <div v-if="selectedItems.includes(product._id)"
                class="absolute inset-0 flex items-center justify-center bg-primary-500/20">
                <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-white" />
              </div>

              <!-- Action Buttons -->
              <div
                class="absolute right-1 flex flex-col z-50 top-1/2 transform -translate-y-1/2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <UButton color="yellow" variant="ghost" icon="i-heroicons-pencil-square" size="xs"
                  @click.stop="handleEdit(product)" :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }" />
                <UButton color="red" variant="ghost" icon="i-heroicons-trash" size="xs"
                  @click.stop="deleteProduct(product._id)" :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }" />
                <UButton color="purple" variant="ghost" icon="i-heroicons-check-circle" size="xs"
                  @click="toggleSelect(product._id, $event)" :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }" />
              </div>

              <!-- Product Content -->
              <div class="absolute inset-0 p-4">
                <h3 class="font-semibold text-lg text-white line-clamp-1 mb-2">{{ product.name }}</h3>
                <p class="text-xs text-white opacity-0 group-hover:opacity-100 duration-500">
                  Created:<br> {{ formatDateTime(product.createdAt) }}
                </p>
                <p v-if="product.updatedAt" class="text-xs text-white opacity-0 group-hover:opacity-100 duration-500">
                  Updated:<br> {{ formatDateTime(product.updatedAt) }}
                </p>
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="flex justify-between items-center text-white">
                    <span v-if="product.price" class="text-sm">{{ product.price }} ₺</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <UIcon name="i-heroicons-cube" class="w-16 h-16 mx-auto text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No products yet</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new product.</p>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedItems.length > 0"
          class="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white px-6 py-4 rounded-2xl shadow-xl z-50 flex items-center gap-4 backdrop-blur-md">
          <div class="flex items-center gap-2">
            <UButton color="yellow" variant="outline" @click="clearSelection" label="Cancel" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }" />
            <UChip :text="selectedItems.length" color="red" size="3xl">
              <UButton color="red" variant="outline" @click="bulkDelete" label="Delete" :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }" />
            </UChip>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <UModal v-model="showDeleteModal" :ui="{
        rounded: $settings.uiConfig.rounded,
        shadow: $settings.uiConfig.shadow,
        background: $settings.uiConfig.background,
        ring: $settings.uiConfig.border
      }">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Delete Product</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ selectedItems.length > 0 ? `Are you sure you want to delete ${selectedItems.length} products?` : 'Are you sure you want to delete this product?' }} This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="soft" @click="() => { showDeleteModal = false; clearSelection(); }"
              label="Cancel" :ui="{
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
  title: 'Product Management',
  ogTitle: 'Product Management',
  description: 'Product Management',
  ogDescription: 'Product Management'
})
const { $settings } = useNuxtApp()

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('tr-TR', { month: 'short' })
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  
  return `${day} ${month} ${year} ${hours}:${minutes}`
}

import { ref, reactive, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
// Interface tanımları ekleyelim
interface Category {
  _id: string
  title: string
  description?: string
  image?: string
}

// Core states
const toast = useToast()
const loading = ref(false)
const products = ref([])
const allCategories = ref<Category[]>([])
const selectedItems = ref([])
const lastSelectedId = ref(null)
const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const showModal = ref(false)
const editMode = ref(false)
const currentProductId = ref(null)

// Form state
const state = reactive({
  name: '',
  description: '',
  price: '',
  imageUrl: '', // photo yerine imageUrl kullan
  categories: [],
  media: [] as Array<{ type: string, url: string, order: number }>
})

// UI states - selectedCategory ve selectedCategories yerine tek bir yapı kullanalım
const selectedCategoryIds = ref([]) // Seçili kategori ID'lerini tutan ref
const selectedCategories = computed(() => {
  return allCategories.value.filter(cat => selectedCategoryIds.value.includes(cat._id))
})

// API calls
const fetchCategories = async () => {
  try {
    const response = await $fetch('/api/categories')
    allCategories.value = Array.isArray(response) ? response : response.data || []
  } catch (error) {
    toast.add({ title: 'Error', description: 'Categories could not be loaded', color: 'red' })
  }
}

const refreshProducts = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/products')
    products.value = Array.isArray(response) ? response : response.data || []
  } catch (error) {
    toast.add({ title: 'Error', description: 'Products could not be loaded', color: 'red' })
  } finally {
    loading.value = false
  }
}

// Form handlers
const showAddProductForm = () => {
  editMode.value = false
  resetForm()
  showModal.value = true
}

const handleEdit = (product) => {
  editMode.value = true
  currentProductId.value = product._id
  showModal.value = true

  Object.assign(state, {
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl || '',
    media: product.media || []
  })

  // Kategorileri benzersiz hale getir
  const productCategories = product.categories || []
  const uniqueCategories = Array.from(new Set(productCategories.map(cat =>
    typeof cat === 'string' ? cat : cat._id
  )))

  selectedCategoryIds.value = uniqueCategories

  console.log('Product categories:', product.categories)
  console.log('Unique category IDs:', selectedCategoryIds.value)
}

const { getUserInfo } = useAuth()
const currentUser = ref(null)

const handleSubmit = async () => {
  if (!state.name) {
    toast.add({ title: 'Error', description: 'Product name is required', color: 'red' })
    return
  }

  if (selectedCategoryIds.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select at least one category', color: 'red' })
    return
  }

  if (!currentUser.value?._id) {
    toast.add({ title: 'Error', description: 'Session error, please login again', color: 'red' })
    return
  }

  loading.value = true
  try {
    const payload = {
      name: state.name,
      description: state.description || '',
      price: state.price || undefined,
      imageUrl: state.imageUrl !== '/images/product.webp' ? state.imageUrl : undefined,
      categories: selectedCategoryIds.value,
      media: state.media,
      createdBy: currentUser.value._id
    }

    const endpoint = editMode.value
      ? `/api/products/${currentProductId.value}`
      : '/api/products/add'

    const response = await $fetch(endpoint, {
      method: editMode.value ? 'PUT' : 'POST',
      body: payload
    })

    toast.add({
      title: 'Başarılı',
      description: `Ürün başarıyla ${editMode.value ? 'güncellendi' : 'oluşturuldu'}`,
      color: 'green'
    })

    showModal.value = false
    resetForm()
    refreshProducts()
  } catch (error) {
    console.error('Form submission error:', error)
    toast.add({ title: 'Hata', description: 'İşlem başarısız', color: 'red' })
  } finally {
    loading.value = false
  }
}

// Selection handlers
const toggleSelect = (id, event) => {
  event.preventDefault()
  event.stopPropagation()

  const index = selectedItems.value.indexOf(id)

  if (event.shiftKey && lastSelectedId.value) {
    const currentIndex = products.value.findIndex(p => p._id === id)
    const lastIndex = products.value.findIndex(p => p._id === lastSelectedId.value)

    const start = Math.min(currentIndex, lastIndex)
    const end = Math.max(currentIndex, lastIndex)

    for (let i = start; i <= end; i++) {
      const productId = products.value[i]._id
      if (!selectedItems.value.includes(productId)) {
        selectedItems.value.push(productId)
      }
    }
  } else {
    if (index === -1) {
      selectedItems.value.push(id)
    } else {
      selectedItems.value.splice(index, 1)
    }
    lastSelectedId.value = id
  }
}

// Reset handlers
const resetForm = () => {
  Object.assign(state, {
    name: '',
    description: '',
    price: '',
    imageUrl: '', // photo yerine imageUrl kullan
    categories: [],
    media: []
  })
  selectedCategoryIds.value = [] // selectedCategory yerine selectedCategoryIds kullan
  editMode.value = false
  showModal.value = false
}

const clearSelection = () => {
  selectedItems.value = []
  lastSelectedId.value = null
}

// Delete handlers
const deleteProduct = id => {
  selectedItems.value = [id]
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleteLoading.value = true
  try {
    await Promise.all(
      selectedItems.value.map(id => $fetch(`/api/products/${id}`, { method: 'DELETE' }))
    )

    toast.add({
      title: 'Başarılı',
      description: `${selectedItems.value.length > 1 ? 'Ürünler' : 'Ürün'} silindi`,
      color: 'green'
    })

    showDeleteModal.value = false
    clearSelection()
    refreshProducts()
  } catch (error) {
    toast.add({ title: 'Hata', description: 'Silme işlemi başarısız', color: 'red' })
  } finally {
    deleteLoading.value = false
  }
}

// Initialize
onMounted(async () => {
  currentUser.value = await getUserInfo()
  refreshProducts()
  fetchCategories()
  initSortable()
})

// Add closeModal function
const closeModal = () => {
  if (showMediaSelector.value) {
    // Eğer medya seçim modalı açıksa sadece onu kapat
    showMediaSelector.value = false
    selectedMedias.value = []
  } else {
    // Ana modalı kapat
    showModal.value = false
    resetForm()
  }
}

// Script kısmına aşağıdaki fonksiyonu ekleyelim
const removeCategory = (categoryId: string) => {
  selectedCategoryIds.value = selectedCategoryIds.value.filter(id => id !== categoryId)
}

// Bulk Delete fonksiyonu
const bulkDelete = () => {
  if (selectedItems.value.length === 0) {
    toast.add({
      title: 'Uyarı',
      description: 'Lütfen silinecek ürünleri seçin',
      color: 'yellow'
    })
    return
  }
  showDeleteModal.value = true
}

// USelectMenu bileşenine model-value handler ekle
const onUpdateCategories = (newValue) => {
  // Yeni seçimlerde de benzersizliği sağla
  selectedCategoryIds.value = Array.from(new Set(newValue))
}

// Yeni state tanımlamaları
const showMediaSelector = ref(false)
const selectedMedias = ref<string[]>([])
const sortableEl = ref<HTMLElement | null>(null)

// Sortable instance'ı için ref ekle
const sortableInstance = ref<any>(null)

// Sortable için setup fonksiyonunu güncelle
const initSortable = async () => {
  if (sortableEl.value) {
    const Sortable = (await import('sortablejs')).default

    // Eğer önceki instance varsa destroy et
    if (sortableInstance.value) {
      sortableInstance.value.destroy()
    }

    sortableInstance.value = new Sortable(sortableEl.value, {
      animation: 150,
      handle: '.drag-handle', // Sürükleme için tutma noktası
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      forceFallback: true, // Bu önemli
      fallbackClass: 'sortable-fallback',
      onStart: () => {
        document.body.style.cursor = 'grabbing'
      },
      onEnd: (evt) => {
        document.body.style.cursor = 'default'
        // Sıralamayı güncelle
        const newItems = [...state.media]
        const movedItem = newItems.splice(evt.oldIndex!, 1)[0]
        newItems.splice(evt.newIndex!, 0, movedItem)

        // Order'ları güncelle
        state.media = newItems.map((item, index) => ({
          ...item,
          order: index
        }))
      }
    })
  }
}

// Media değişikliklerini izle ve Sortable'ı yeniden başlat
watch(() => state.media, () => {
  nextTick(() => {
    initSortable()
  })
}, { deep: true })

// Component unmount olduğunda Sortable instance'ını temizle
onBeforeUnmount(() => {
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
  }
})

// Medya seçim işleyicisi
const handleMediaSelect = () => {
  if (!selectedMedias.value.length) {
    showMediaSelector.value = false
    return
  }

  const newMedia = selectedMedias.value.map((url, index) => ({
    type: url.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? 'video' : 'image',
    url,
    order: state.media.length + index
  }))

  state.media.push(...newMedia)
  selectedMedias.value = [] // Seçimleri temizle
  showMediaSelector.value = false // Sadece medya seçim modalını kapat

  toast.add({
    title: 'Başarılı',
    description: `${newMedia.length} medya eklendi`,
    color: 'green'
  })
}

// Medya silme işleyicisi
const removeMedia = (index: number) => {
  state.media.splice(index, 1)
  // Sıralamayı güncelle
  state.media = state.media.map((item, idx) => ({
    ...item,
    order: idx
  }))
}
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.3;
  background: #e5e7eb !important;
  border: 2px dashed #9ca3af !important;
}

.sortable-drag {
  cursor: grabbing !important;
  opacity: 0.9;
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.drag-handle {
  touch-action: none;
  cursor: grab !important;
}

.drag-handle:active {
  cursor: grabbing !important;
}

.sortable-fallback {
  opacity: 0.8;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: rotate(2deg);
}
</style>