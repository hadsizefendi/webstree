<template>
  <section class="py-8 mb-10">
    <h1 class="text-3xl font-bold text-center mb-8">
      Blogs
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-4 max-w-7xl mx-auto">
      <div
        v-for="(blog, index) in displayedBlogs"
        :key="index"
        class="group rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1 relative"
      >
        <NuxtLink
          :href="`/blogs/${blog._id}`"
          class="flex flex-col h-full"
        >
          <div class="aspect-square overflow-hidden relative">
            <img
              :src="blog.imageUrl || '/images/blog.webp'"
              :alt="blog.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div class="p-5 backdrop-blur-md rounded-lg flex flex-col w-full absolute bottom-0">
            <h2 class="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              {{ blog.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {{ truncateText(blog.description, 24) }}
            </p>
            <div class="mt-auto pt-4">
              <span class="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                Devamını Oku
                <svg
                  class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div
      v-if="visibleBlogs < blogs.length"
      class="flex justify-center mt-8"
    >
      <UButton
        label="More"
        color="primary"
        variant="outline"
        @click="loadMore"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const { $settings } = useNuxtApp()
const blogs = ref([])
const visibleBlogs = ref(4)

const loadMore = () => {
  visibleBlogs.value += 4
}

const displayedBlogs = computed(() => {
  return blogs.value.slice(0, visibleBlogs.value)
})

const fetchBlogs = async () => {
  try {
    blogs.value = await $fetch('/api/blogs')
  } catch (error) {
    console.error('Bloglar alınırken bir hata oluştu:', error)
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

onMounted(() => {
  fetchBlogs()
})
</script>
