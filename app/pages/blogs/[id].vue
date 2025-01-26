<template>
  <div>
    <section class="py-8 px-4 max-w-4xl mx-auto space-y-6">
      <UButton
        block
        label="Go Back"
        icon="i-heroicons-arrow-left"
        variant="outline"
        size="xs"
        :ui="{
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }"
        @click="goBack"
      />
      <div
        v-if="blog"
        class="space-y-6 bg-black/50 rounded-lg p-10"
      >
        <div>
          <img
            :src="blog.imageUrl || '/images/blog.webp'"
            :alt="blog.title"
            class="w-screen h-screen fixed left-0 top-0 -z-10 object-cover blur-md"
          >
          <div class="fixed bg-black/50 -z-[5] w-full h-full left-0 top-0" />
        </div>
        <img
          :src="blog.imageUrl || '/images/blog.webp'"
          :alt="blog.title"
          class="w-full h-full object-cover rounded-lg shadow-md"
        >
        <h1 class="text-4xl font-bold text-primary-500">
          {{ blog.title }}
        </h1>
        <p class="text-white leading-relaxed text-md text-center">
          {{ blog.description }}
        </p>
        <div
          v-if="blog.videoUrl"
          class="mt-6"
        >
          <h2 class="text-xl font-semibold text-primary-500 mb-2">
            Video
          </h2>
          <div class="aspect-w-16 aspect-h-9">
            <video
              class="w-full h-full rounded-lg shadow-md"
              controls
            >
              <source
                :src="blog.videoUrl"
                type="video/mp4"
              >
              Your browser does not support video playback.
            </video>
          </div>
        </div>
      </div>
      <p
        v-else
        class="text-center text-gray-500"
      >
        Loading content...
      </p>
    </section>
    <BlogList />
  </div>
</template>

<script setup lang="ts">
const { $settings } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const blog = ref(null)

const fetchBlog = async () => {
  try {
    blog.value = await $fetch(`/api/blogs/${route.params.id}`)
  } catch (error) {
    console.error('Error while fetching blog details:', error)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchBlog()
})

useSeoMeta({
  title: () => blog.value ? `${blog.value.title} - Webstree` : 'Webstree',
  ogTitle: () => blog.value ? `${blog.value.title} - Webstree` : 'Webstree',
  description: () => blog.value ? `${blog.value?.description} - Webstree` : 'Webstree',
  ogDescription: () => blog.value ? `${blog.value?.description} - Webstree` : 'Webstree'
})
</script>
