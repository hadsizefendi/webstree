<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="py-6 px-4 backdrop-blur-lg bg-white/5">
      <UContainer>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-200 to-primary-800 bg-clip-text text-transparent">
            WebsTree Panel
          </h1>
          <p class="text-gray-400 mt-1">
            Welcome {{ user?.name || user?.username }}! 
            <template v-if="isAdmin">Here you can manage your website content.</template>
          </p>
        </div>
      </UContainer>
    </header>
    <!-- Main Content -->
    <UContainer class="py-12 h-full flex items-center justify-center">
      <!-- Admin kartlarını sadece admin kullanıcılara göster -->
      <div v-if="isAdmin" class="flex flex-wrap items-center justify-center gap-8">
        <!-- Medya Yönetimi -->
        <NuxtLink to="/panel/media">
          <UCard
            class="group panel-cards duration-300"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="p-3 flex items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                <UIcon
                  name="i-heroicons-photo"
                  class="w-8 h-8"
                />
              </div>
              <div>
                <h2 class="text-xl font-semibold">
                  Media Management
                </h2>
                <div class="text-xs text-gray-400">
                  Manage all your media files
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-cloud-arrow-up" />
                <span>Upload new media</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-photo" />
                <span>View media gallery</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-clipboard" />
                <span>Copy and share URLs</span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
        <!-- Slider Yönetimi -->
        <NuxtLink to="/panel/hero">
          <UCard
            class="group panel-cards duration-300"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="p-3 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <UIcon
                  name="i-heroicons-play-circle"
                  class="w-8 h-8"
                />
              </div>
              <div>
                <h2 class="text-xl font-semibold">
                  Slider Management
                </h2>
                <div class="text-xs text-gray-400">
                  Manage sliders and slides
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-plus-circle" />
                <span>Add new slider</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-photo" />
                <span>Add images and videos</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-arrows-up-down" />
                <span>Sort slides</span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
        <!-- Ürün Yönetimi -->
        <NuxtLink to="/panel/product">
          <UCard
            class="group panel-cards duration-300"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="p-3 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <UIcon
                  name="i-heroicons-shopping-bag"
                  class="w-8 h-8"
                />
              </div>
              <div>
                <h2 class="text-xl font-semibold">
                  Product Management
                </h2>
                <div class="text-xs text-gray-400">
                  Manage your products
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-plus-circle" />
                <span>Add new product</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-tag" />
                <span>Edit existing products</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-photo" />
                <span>Add images and categories</span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
        <!-- Kategori Yönetimi -->
        <NuxtLink to="/panel/category">
          <UCard
            class="group panel-cards duration-300"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="p-3 flex items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <UIcon
                  name="i-heroicons-tag"
                  class="w-8 h-8"
                />
              </div>
              <div>
                <h2 class="text-xl font-semibold">
                  Category Management
                </h2>
                <div class="text-xs text-gray-400">
                  Manage your categories
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-plus-circle" />
                <span>Add new category</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-tag" />
                <span>Edit categories</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-photo" />
                <span>Add category images</span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
        <!-- Blog Yönetimi -->
        <NuxtLink to="/panel/blog">
          <UCard
            class="group panel-cards duration-300"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="p-3 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <UIcon
                  name="i-heroicons-pencil-square"
                  class="w-8 h-8"
                />
              </div>
              <div>
                <h2 class="text-xl font-semibold">
                  Blog Management
                </h2>
                <div class="text-xs text-gray-400">
                  Manage your blog posts
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-plus-circle" />
                <span>Add new post</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-document-text" />
                <span>Edit existing posts</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-photo" />
                <span>Add images and media</span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
        <!-- Theme Management -->
        <NuxtLink to="/panel/theme">
          <UCard
            class="group panel-cards duration-300"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="p-3 flex items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                <UIcon
                  name="i-heroicons-paint-brush"
                  class="w-8 h-8"
                />
              </div>
              <div>
                <h2 class="text-xl font-semibold">
                  Theme Management
                </h2>
                <div class="text-xs text-gray-400">
                  Customize your website theme
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-swatch" />
                <span>Change colors</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-document" />
                <span>Edit layouts</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-cog" />
                <span>Theme settings</span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
      
      <!-- Normal kullanıcılar için alternatif içerik -->
      <div v-else class="text-center">
        <UIcon name="i-heroicons-information-circle" class="w-12 h-12 mx-auto text-gray-400"/>
        <h2 class="mt-4 text-xl font-medium">Normal User Dashboard</h2>
        <p class="mt-2 text-gray-500">Welcome to your dashboard.</p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { $settings } = useNuxtApp()
const { user, getUserInfo, isAdmin } = useAuth()

onMounted(async () => {
  await getUserInfo()
})

useSeoMeta({
  title: 'Admin Panel - WebsTree',
  ogTitle: 'Admin Panel - WebsTree',
  description: 'Admin Panel - WebsTree',
  ogDescription: 'Admin Panel - WebsTree'
})

</script>

<style>
.panel-cards {
  transform: scale(1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom;
  will-change: transform;
}

.panel-cards:hover {
  transform: scale(1.05);
}
</style>
