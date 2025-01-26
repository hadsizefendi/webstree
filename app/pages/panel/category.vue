<template>
  <div>
    <UContainer class="py-12">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b dark:border-gray-800"
      >
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-arrow-left"
            color="white"
            variant="ghost"
            size="sm"
            class="hover:bg-gray-100 dark:hover:bg-gray-800"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
            @click="navigateTo('/panel')"
          />
          <div>
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
            >
              Category Management
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {{ allCategories.length }} active categories • {{ selectedItems.length ? `${selectedItems.length}
              selected`
                : 'No selection' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-arrow-path"
            :loading="loading"
            class="shadow-sm hover:shadow-md transition-all"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
            @click="fetchCategories"
          >
            Refresh
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            icon="i-heroicons-plus"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
            @click="addButton"
          >
            Add Category
          </UButton>
        </div>
      </div>

      <!-- Add/Edit Category Modal -->
      <UModal
        v-model="showModal"
        :ui="{ width: 'max-w-xl',
               rounded: $settings.uiConfig.rounded,
               shadow: $settings.uiConfig.shadow,
               background: $settings.uiConfig.background,
               ring: $settings.uiConfig.border
        }"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h2
              class="text-2xl font-semibold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent"
            >
              {{ editingCategory._id ? 'Edit Category' : 'Add New Category' }}
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
            class="space-y-6"
            @submit.prevent="saveCategory"
          >
            <!-- Image Upload -->
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Category Image
              </label>
              <MediaSelector
                v-model="editingCategory.image"
                default-image="/images/category.webp"
              />
            </div>

            <!-- Title Input -->
            <UFormGroup
              label="Category Name"
              required
            >
              <UInput
                v-model="editingCategory.title"
                placeholder="e.g., Invitation"
                icon="i-heroicons-tag"
                :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }"
              />
            </UFormGroup>

            <!-- Description Input -->
            <UFormGroup label="Description">
              <UTextarea
                v-model="editingCategory.description"
                placeholder="Category description..."
                :rows="4"
                :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }"
              >
                <template #leading>
                  <UIcon
                    name="i-heroicons-document-text"
                    class="w-5 h-5 text-gray-400"
                  />
                </template>
              </UTextarea>
            </UFormGroup>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-6">
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
                {{ editingCategory._id ? 'Update' : 'Save' }}
              </UButton>
            </div>
          </form>
        </div>
      </UModal>

      <!-- Delete Confirmation Modal -->
      <UModal
        v-model="showDeleteModal"
        :ui="{
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">
            Delete Category
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ selectedItems.length > 0 ? `Are you sure you want to delete ${selectedItems.length} categories?` : 'Are you sure you want to delete this category?' }} This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              label="Cancel"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="showDeleteModal = false"
            />
            <UButton
              color="red"
              :loading="deleteLoading"
              label="Delete"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="confirmDelete"
            />
          </div>
        </div>
      </UModal>

      <!-- Categories Grid -->
      <div class="space-y-8">
        <!-- Loading Skeleton -->
        <div
          v-if="loading"
          class="flex flex-wrap gap-3 items-center justify-center"
        >
          <UCard
            v-for="n in 8"
            :key="n"
            class="overflow-hidden"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="animate-pulse">
              <div class="aspect-video bg-gray-200 dark:bg-gray-700" />
              <div class="p-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Categories List -->
        <div
          v-else-if="categories.length > 0"
          class="flex flex-wrap gap-3 items-center justify-center"
        >
          <UCard
            v-for="category in categories"
            :key="category._id"
            class="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            :class="{ 'ring-2 ring-primary-500': selectedItems.includes(category._id) }"
            :ui="{
              body: { padding: '!p-0' },
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <!-- Card Header - Image and Selection -->
            <div class="relative aspect-square">
              <img
                :src="category.image || '/images/category.webp'"
                :alt="category.title"
                class="w-40 h-40 object-cover opacity-80 group-hover:opacity-20 duration-500"
              >
              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              />

              <!-- Selection Indicator -->
              <div
                v-if="selectedItems.includes(category._id)"
                class="absolute inset-0 flex items-center justify-center bg-primary-500/20"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-12 h-12 text-white"
                />
              </div>

              <!-- Action Buttons -->
              <div
                class="absolute right-1 flex flex-col z-50 top-1/2 transform -translate-y-1/2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <UButton
                  color="yellow"
                  variant="ghost"
                  icon="i-heroicons-pencil-square"
                  size="xs"
                  :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }"
                  @click.stop="editCategory(category)"
                />
                <UButton
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  size="xs"
                  :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }"
                  @click.stop="deleteCategory(category._id)"
                />
                <UButton
                  color="purple"
                  variant="ghost"
                  icon="i-heroicons-check-circle"
                  size="xs"
                  :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }"
                  @click="toggleSelect(category._id, $event)"
                />
              </div>
              <!-- Card Content -->
              <div class="absolute inset-0 p-4">
                <h3 class="font-semibold text-lg line-clamp-1 mb-2">
                  {{ category.title }}
                </h3>
                <p class="text-sm drop-shadow-xl opacity-0 group-hover:opacity-100 duration-500">
                  {{ category.description
                  }}
                </p>
              </div>
              <div class="p-4 absolute bottom-0">
                <!-- Card Footer -->
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <div class="flex items-center gap-1">
                    <UIcon
                      name="i-heroicons-calendar"
                      class="w-4 h-4"
                    />
                    <span>{{ new Date(category.createdAt).toLocaleDateString('en-US') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="text-center py-12"
        >
          <UIcon
            name="i-heroicons-folder-open"
            class="w-16 h-16 mx-auto text-gray-400"
          />
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            No categories yet
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding a new category.
          </p>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination.total > itemsPerPage"
          class="flex justify-center my-8"
        >
          <UPagination
            v-model="page"
            :total="pagination.total"
            :page-count="itemsPerPage"
            :first-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'İlk', color: 'gray' }"
            :last-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Son', color: 'gray' }"
            :max="9"
            show-first
            show-last
          />
        </div>
        <!-- Bulk Actions -->
        <div
          v-if="selectedItems.length > 0"
          class="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white px-6 py-4 rounded-2xl shadow-xl z-50 flex items-center gap-4 backdrop-blur-md"
        >
          <div class="flex items-center gap-2">
            <UButton
              color="yellow"
              variant="outline"
              label="Cancel"
              :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }"
              @click="selectedItems = []"
            />
            <UChip
              :text="selectedItems.length"
              color="red"
              size="3xl"
            >
              <UButton
                color="red"
                variant="outline"
                label="Delete"
                :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }"
                @click="bulkDelete"
              />
            </UChip>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
useSeoMeta({
  title: 'Category Management',
  ogTitle: 'Category Management',
  description: 'Category list and management',
  ogDescription: 'Category list and management'
})

const { $settings } = useNuxtApp()

// Add Category interface
interface Category {
  _id: string
  title: string
  description: string
  image: string
  createdAt: string
}

const page = ref(1)
const itemsPerPage = 24
const allCategories = ref<Category[]>([])
const pagination = ref({
  total: 0
})

// Computed property for paginated categories
const categories = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allCategories.value.slice(start, end)
})

const loading = ref(false)
const deleteLoading = ref(false)
const showDeleteModal = ref(false)
const selectedCategoryId = ref('')
const selectedImage = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const showModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const toast = useToast()

const editingCategory = ref<Partial<Category>>({})
const selectedItems = ref<string[]>([])
const lastSelectedId = ref<string | null>(null)

// Kategorileri getir
const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/categories')

    if (Array.isArray(response)) {
      allCategories.value = response
      pagination.value = {
        total: response.length
      }
    } else {
      allCategories.value = response.data || []
      pagination.value = {
        total: response.total || response.length || 0
      }
    }
  } catch (error) {
    console.error('Kategoriler alınırken bir hata oluştu:', error)
    allCategories.value = []
    pagination.value = {
      total: 0
    }
    toast.add({
      title: 'Error',
      description: 'Error loading categories',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const onImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    selectedImage.value = file

    // Preview image
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveCategory = async () => {
  if (!editingCategory.value.title) {
    toast.add({
      title: 'Error',
      description: 'Please fill in all required fields',
      color: 'red'
    })
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('title', editingCategory.value.title)
    formData.append('description', editingCategory.value.description || '')

    // Seçilen görsel URL'si varsa ve default görsel değilse
    if (editingCategory.value.image && editingCategory.value.image !== '/images/category.webp') {
      formData.append('imageUrl', editingCategory.value.image) // 'image' yerine 'imageUrl' olarak değiştirildi
    }

    const endpoint = editingCategory.value._id
      ? `/api/categories/${editingCategory.value._id}`
      : '/api/categories/add'

    const method = editingCategory.value._id ? 'PUT' : 'POST'

    const response = await $fetch(endpoint, {
      method,
      body: formData
    })

    toast.add({
      title: 'Success',
      description: `Category ${editingCategory.value._id ? 'updated' : 'added'} successfully`,
      color: 'green'
    })

    showModal.value = false
    await fetchCategories()
  } catch (error) {
    console.error('Kategori kaydedilirken bir hata oluştu:', error)
    toast.add({
      title: 'Error',
      description: 'Error saving category',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const addButton = () => {
  editingCategory.value = {
    title: '',
    description: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCategory.value = {}
  selectedImage.value = null
  photoPreview.value = null
}

// Kategori düzenleme
const editCategory = (category: Category) => {
  editingCategory.value = { ...category }
  showModal.value = true
}

// Kategori silme
const deleteCategory = (id: string) => {
  selectedCategoryId.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleteLoading.value = true
  try {
    if (selectedItems.value.length > 0) {
      // Toplu silme işlemi
      await Promise.all(selectedItems.value.map(id => $fetch(`/api/categories/${id}`, { method: 'DELETE' })))
      toast.add({
        title: 'Success',
        description: 'Selected categories deleted successfully',
        color: 'green'
      })
      await fetchCategories()
      clearSelection()
    } else if (selectedCategoryId.value) {
      // Tekli silme işlemi
      await $fetch(`/api/categories/${selectedCategoryId.value}`, {
        method: 'DELETE'
      })
      toast.add({
        title: 'Success',
        description: 'Category deleted successfully',
        color: 'green'
      })
      await fetchCategories()
    }
    showDeleteModal.value = false
    deleteLoading.value = false
  } catch (error) {
    console.error('Silme işlemi sırasında hata:', error)
    toast.add({
      title: 'Error',
      description: 'Error during deletion',
      color: 'red'
    })
    deleteLoading.value = false
  }
}

const toggleSelect = (id: string, event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  // Shift tuşu ile seçim
  if (event instanceof MouseEvent && event.shiftKey && lastSelectedId.value) {
    const currentIndex = categories.value.findIndex(item => item._id === id)
    const lastIndex = categories.value.findIndex(item => item._id === lastSelectedId.value)

    if (currentIndex !== -1 && lastIndex !== -1) {
      const start = Math.min(currentIndex, lastIndex)
      const end = Math.max(currentIndex, lastIndex)

      const itemsToSelect = categories.value.slice(start, end + 1).map(item => item._id)

      // Seçili olmayan öğeleri seç
      itemsToSelect.forEach((itemId) => {
        if (!selectedItems.value.includes(itemId)) {
          selectedItems.value.push(itemId)
        }
      })
    }
  } else {
    // Normal tekli seçim
    const index = selectedItems.value.indexOf(id)
    if (index === -1) {
      selectedItems.value.push(id)
    } else {
      selectedItems.value.splice(index, 1)
    }
    lastSelectedId.value = id
  }
}

// Seçimi temizle
const clearSelection = () => {
  selectedItems.value = []
  lastSelectedId.value = null
}

const bulkDelete = () => {
  showDeleteModal.value = true
}

// Watch page changes
watch(page, () => {
  // Sayfa değiştiğinde sayfanın en üstüne scroll yap
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
  fetchCategories()
})
</script>
