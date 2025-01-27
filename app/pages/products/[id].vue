<template>
  <div class="min-h-screen py-6">
    <UContainer>
      <!-- Breadcrumb Navigation -->
      <nav class="mb-8 items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hidden md:flex">
        <UButton
          variant="link"
          to="/shop"
        >
          Shop
        </UButton>
        <span class="i-heroicons-chevron-right" />
        <span class="truncate">{{ product?.name || 'Product Details' }}</span>
      </nav>

      <!-- Loading State -->
      <div
        v-if="pending"
        class="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        <div class="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-square" />
        <div class="space-y-6 animate-pulse">
          <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
          <div class="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div class="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3" />
        </div>
      </div>

      <!-- Error State -->
      <UAlert
        v-else-if="error"
        title="Product Not Found"
        description="The product you're looking for cannot be found or may have been removed."
        color="red"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
      >
        <template #footer>
          <UButton
            color="red"
            variant="soft"
            to="/shop"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            Return to Shop
          </UButton>
        </template>
      </UAlert>

      <!-- Product Content -->
      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        <!-- Product Gallery -->
        <div class="sticky top-2 z-10 drop-shadow-[10px_10px_20px_rgba(0,0,0,0.5)]">
          <ProductGallery
            :media="productMedia"
            class=""
          />
        </div>

        <!-- Product Information -->
        <div class="space-y-8">
          <div>
            <h1 class="text-3xl font-bold mb-4">
              {{ product.name }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Categories -->
          <div
            v-if="product?.categories?.length"
            class="space-y-2"
          >
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Categories
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="category in product.categories"
                :key="typeof category === 'string' ? category : category._id"
                color="primary"
                variant="soft"
                :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }"
              >
                {{ typeof category === 'string' ? category : category.title }}
              </UBadge>
            </div>
          </div>

          <!-- Variations -->
          <div
            v-if="product.variations?.length"
            class="space-y-4"
          >
            <div
              v-for="variation in product.variations"
              :key="variation.name"
              class="space-y-2"
            >
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ variation.name }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="option in variation.options"
                  :key="option"
                  variant="soft"
                  color="white"
                  size="sm"
                  :ui="{
                    rounded: $settings.uiConfig.rounded,
                    shadow: $settings.uiConfig.shadow,
                    background: $settings.uiConfig.background,
                    ring: $settings.uiConfig.border
                  }"
                >
                  {{ option }}
                </UButton>
              </div>
            </div>
          </div>

          <!-- Price and Actions -->
          <div class="space-y-6 pt-6 border-t">
            <div
              v-if="product.price"
              class="flex items-baseline gap-4"
            >
              <span class="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {{ formatPrice(product.price) }} ₺
              </span>
            </div>

            <div class="flex gap-4">
              <UButton
                color="primary"
                size="xl"
                block
                :icon="'i-heroicons-shopping-cart'"
                @click="addToCart"
                :loading="addingToCart"
                :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }"
              >
                Add to Cart
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
    <ProductList />
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
const route = useRoute()
const toast = useToast() // Add toast composable

// Fetch product data
const { data: product, pending, error } = await useFetch(`/api/products/${route.params.id}`)

// Format media data for gallery
const productMedia = computed(() => {
  const media = []
  const defaultImage = '/images/product.webp'

  // Eğer hiç medya yoksa varsayılan görseli ekle
  if (!product.value?.imageUrl && (!product.value?.media || product.value.media.length === 0)) {
    return [{
      type: 'image',
      url: defaultImage,
      order: -1,
      isCover: true
    }]
  }

  // Kapak görselini ilk sıraya ekle
  media.push({
    type: 'image',
    url: product.value?.imageUrl || defaultImage,
    order: -1,
    isCover: true
  })

  // Diğer medyaları ekle (kapak görseli hariç)
  if (product.value?.media?.length > 0) {
    const additionalMedia = product.value.media
      .filter(m => m.url !== product.value.imageUrl)
      .sort((a, b) => a.order - b.order)
    media.push(...additionalMedia)
  }

  return media
})

// Price formatter
const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}

const addingToCart = ref(false)

async function addToCart() {
  addingToCart.value = true
  try {
    await $fetch('/api/cart/add', {
      method: 'POST',
      body: {
        productId: product.value._id,
        quantity: 1
      }
    })
    
    // Show simple success toast
    toast.add({
      title: 'Başarılı',
      description: 'Ürün sepete eklendi',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 2000
    })

    // MiniCart'ı güncelle
    const nuxtApp = useNuxtApp()
    nuxtApp.callHook('cart:updated')
    
  } catch (error) {
    toast.add({
      title: 'Hata',
      description: error.data?.message || 'Ürün sepete eklenirken bir hata oluştu',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
  } finally {
    addingToCart.value = false
  }
}

useSeoMeta({
  title: product.value ? `${product.value.name} - Webstree` : 'Webstree',
  ogTitle: product.value ? `${product.value.name} - Webstree` : 'Webstree',
  description: product.value ? `${product.value?.description} - Webstree` : 'Webstree',
  ogDescription: product.value ? `${product.value?.description} - Webstree` : 'Webstree'
})
</script>
