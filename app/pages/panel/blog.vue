<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <!-- Improved Header -->
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
              class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent"
            >
              {{ editMode ? 'Edit Blog' : 'Blog Management' }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {{ selectedItems.length ? `${selectedItems.length} blogs selected` : 'No selection' }}
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
            @click="refreshBlogs"
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
            @click="showAddBlogForm"
          >
            Add Blog
          </UButton>
        </div>
      </div>

      <!-- Blog Form Modal -->
      <UModal
        v-model="showModal"
        :ui="{
          width: 'max-w-3xl',
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }"
      >
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-6">
            {{ editMode ? 'Edit Blog' : 'Add New Blog' }}
          </h2>

          <form
            class="space-y-6"
            @submit.prevent="handleSubmit"
          >
            <!-- Media Selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Blog Image
                </label>
                <MediaSelector
                  v-model="state.imageUrl"
                  default-image="/images/blog.webp"
                />
              </div>
              <div class="space-y-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Video URL
                </label>
                <MediaSelector
                  v-model="state.videoUrl"
                  type="video"
                />
              </div>
            </div>

            <!-- Form Fields -->
            <UFormGroup
              label="Blog Title"
              required
            >
              <UInput
                v-model="state.title"
                placeholder="Enter blog title..."
                icon="i-heroicons-document-text"
                :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }"
              />
            </UFormGroup>

            <UFormGroup
              label="Blog Content"
              required
            >
              <UTextarea
                v-model="state.description"
                placeholder="Enter blog content..."
                :rows="6"
                :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }"
              />
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
                {{ editMode ? 'Update' : 'Save' }}
              </UButton>
            </div>
          </form>
        </div>
      </UModal>

      <!-- Blogs Grid -->
      <div class="space-y-8">
        <!-- Loading Skeleton -->
        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-4 gap-4"
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

        <!-- Blogs List -->
        <div
          v-else-if="blogs.length > 0"
          class="flex flex-wrap items-center justify-center gap-4"
        >
          <UCard
            v-for="blog in blogs"
            :key="blog._id"
            class="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            :class="{ 'ring-2 ring-primary-500': selectedItems.includes(blog._id) }"
            :ui="{
              body: { padding: '!p-0' },
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="relative aspect-video">
              <img
                :src="blog.imageUrl || '/images/blog.webp'"
                :alt="blog.title"
                class="w-40 h-40 object-cover opacity-100 group-hover:opacity-20 duration-500"
              >

              <!-- Video Indicator -->
              <div
                v-if="blog.videoUrl"
                class="absolute top-2 right-2"
              >
                <UIcon
                  name="i-heroicons-video-camera"
                  class="w-6 h-6 text-white"
                />
              </div>

              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              />

              <!-- Selection Indicator -->
              <div
                v-if="selectedItems.includes(blog._id)"
                class="absolute inset-0 flex items-center justify-center bg-primary-500/20"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-12 h-12 text-white"
                />
              </div>

              <!-- Action Buttons -->
              <div
                class="absolute right-2 top-1/2 z-50 transform -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                  @click.stop="handleEdit(blog)"
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
                  @click.stop="deleteBlog(blog._id)"
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
                  @click="toggleSelect(blog._id, $event)"
                />
              </div>

              <!-- Blog Content -->
              <div class="absolute inset-0 p-4">
                <h3 class="font-semibold text-lg text-white line-clamp-1 mb-2">
                  {{ blog.title }}
                </h3>
                <p class="text-sm text-white opacity-0 group-hover:opacity-100 duration-500 line-clamp-3">
                  {{ blog.description }}
                </p>
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
            name="i-heroicons-document-text"
            class="w-16 h-16 mx-auto text-gray-400"
          />
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            No blog posts yet
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding a new blog post.
          </p>
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
              @click="clearSelection"
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
            Delete Blog
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ selectedItems.length > 0 ? `Are you sure you want to delete ${selectedItems.length} blogs?` : 'Are you sure you want to delete this blog?' }}
            This action cannot be undone.
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
              @click="() => { showDeleteModal = false; clearSelection(); }"
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
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useSeoMeta({
  title: 'Blog Management',
  ogTitle: 'Blog Management',
  description: 'Blog list and management',
  ogDescription: 'Blog list and management'
})
const { $settings } = useNuxtApp()
const toast = useToast()
const loading = ref(false)
const deleteLoading = ref(false)
const blogs = ref([])
const selectedItems = ref([])
const lastSelectedId = ref(null)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editMode = ref(false)
const currentBlogId = ref(null)

// Form state
const state = reactive({
  title: '',
  description: '',
  imageUrl: '',
  videoUrl: ''
})

// API calls
const refreshBlogs = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/blogs')
    blogs.value = Array.isArray(response) ? response : []
  } catch (error) {
    toast.add({ title: 'Error', description: 'Error loading blogs', color: 'red' })
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('title', state.title)
    formData.append('description', state.description)
    formData.append('videoUrl', state.videoUrl)
    formData.append('imageUrl', state.imageUrl)

    if (editMode.value) {
      await $fetch(`/api/blogs/${currentBlogId.value}`, {
        method: 'PUT',
        body: formData
      })
    } else {
      await $fetch('/api/blogs/add', {
        method: 'POST',
        body: formData
      })
    }

    toast.add({
      title: 'Success',
      description: `Blog ${editMode.value ? 'updated' : 'created'} successfully`,
      color: 'green'
    })

    closeModal()
    refreshBlogs()
  } catch (error) {
    toast.add({ title: 'Error', description: 'Error saving blog', color: 'red' })
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  editMode.value = false
  currentBlogId.value = null
  state.title = ''
  state.description = ''
  state.imageUrl = ''
  state.videoUrl = ''
}

const showAddBlogForm = () => {
  showModal.value = true
}

const handleEdit = (blog) => {
  editMode.value = true
  currentBlogId.value = blog._id
  state.title = blog.title
  state.description = blog.description
  state.imageUrl = blog.imageUrl
  state.videoUrl = blog.videoUrl
  showModal.value = true
}

const deleteBlog = async (id) => {
  selectedItems.value = [id] // Seçili öğelere sadece silinecek blogu ekle
  showDeleteModal.value = true // Modal'ı göster
}

const toggleSelect = (id, event) => {
  event.stopPropagation()
  if (selectedItems.value.includes(id)) {
    selectedItems.value = selectedItems.value.filter(item => item !== id)
  } else {
    selectedItems.value.push(id)
  }
}

const clearSelection = () => {
  selectedItems.value = []
}

const bulkDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    deleteLoading.value = true
    await Promise.all(selectedItems.value.map(id => $fetch(`/api/blogs/${id}`, { method: 'DELETE' })))
    toast.add({ title: 'Success', description: 'Selected blogs deleted', color: 'green' })
    clearSelection()
    refreshBlogs()
  } catch (error) {
    toast.add({ title: 'Error', description: 'Error deleting blogs', color: 'red' })
  } finally {
    deleteLoading.value = false
    showDeleteModal.value = false
  }
}

refreshBlogs()
</script>
