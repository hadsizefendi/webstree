<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent mb-4">
          Our Products
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          If you can't find what you're looking for, please don't hesitate to contact us!
        </p>
      </div>

      <!-- Mobil Filtre Butonu -->
      <UButton
        class="lg:hidden fixed left-4 bottom-4 z-50 w-fit h-12 shadow-lg hover:shadow-xl flex items-center justify-center"
        size="xl" label="Filters" color="primary" variant="soft" icon="i-heroicons-adjustments-horizontal" :ui="{
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }" @click="isMobileFiltersOpen = true" />

      <!-- Mobil Filtre Menüsü -->
      <Transition name="slide-left">
        <div v-if="isMobileFiltersOpen" class="fixed inset-0 z-[60]">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="isMobileFiltersOpen = false" />

          <!-- Filtre Paneli -->
          <div class="absolute top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl">
            <div class="h-full overflow-auto p-4">
              <div class="flex justify-end items-center mb-4">
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }" @click="isMobileFiltersOpen = false" />
              </div>
              <ShopFilters v-model:search-query="searchQuery" v-model:sort-option="sortOption"
                v-model:price-range="priceRange" v-model:selected-category="selectedCategory" :categories="categories"
                @reset="resetFilters" />
            </div>
          </div>
        </div>
      </Transition>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filtreler Sidebar (Desktop) -->
        <div class="hidden lg:block lg:col-span-1 sticky top-14">
          <ShopFilters v-model:search-query="searchQuery" v-model:sort-option="sortOption"
            v-model:price-range="priceRange" v-model:selected-category="selectedCategory" :categories="categories"
            @reset="resetFilters" />
        </div>

        <!-- Ürün Grid -->
        <div class="lg:col-span-3">
          <!-- Aktif Filtreler -->
          <div v-if="hasActiveFilters" class="mb-6 flex flex-wrap gap-2">
            <UBadge v-if="selectedCategory" color="primary" variant="soft" class="flex items-center gap-2" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }">
              {{ getSelectedCategoryName('main') }}
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" size="xs" :ui="{
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }" @click="selectedCategory = null" />
            </UBadge>
          </div>

          <!-- Ürünler -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <NuxtLink v-for="product in displayedProducts" :key="product._id" :to="`/products/${product._id}`"
              class="block group relative transition-transform hover:-translate-y-1 duration-200">
              <UCard class="h-full overflow-hidden" :ui="{
                body: { padding: '!p-0' },
                rounded: $settings.uiConfig.rounded,
                shadow: $settings.uiConfig.shadow,
                background: $settings.uiConfig.background,
                ring: $settings.uiConfig.border
              }">
                <div class="relative pb-[75%] overflow-hidden">
                  <img :src="product.imageUrl || '/images/product.webp'" :alt="product.name"
                    class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110">
                  <!-- Overlay with Actions -->
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="absolute right-2 top-2 flex flex-col gap-2">
                      <UButton color="white" variant="solid" size="sm" icon="i-heroicons-eye"
                        class="!rounded-full hover:!bg-primary-500 hover:!text-white"
                        @click.prevent="openQuickView(product)" />
                      <UButton color="white" variant="solid" size="sm" icon="i-heroicons-shopping-cart"
                        class="!rounded-full hover:!bg-primary-500 hover:!text-white"
                        @click.prevent="quickAddToCart(product)" />
                    </div>
                  </div>
                </div>

                <template #footer>
                  <h3 class="text-lg font-semibold mb-2 line-clamp-1" v-text="product.name" />
                  <p class="text-gray-500 text-sm mb-4 line-clamp-2" v-text="product.description" />
                  <div v-if="product.price" class="font-bold text-primary-600 text-xl">
                    {{ formatPrice(product.price) }} ₺
                  </div>
                </template>
              </UCard>
            </NuxtLink>

            <!-- Quick View Modal -->
            <UModal v-model="showQuickView" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border,
              width: 'md:max-w-3xl'
            }">
              <div v-if="selectedProduct" class="grid md:grid-cols-2 gap-6">
                <!-- Product Image -->
                <div class="relative aspect-square rounded-xl overflow-hidden">
                  <img :src="selectedProduct.imageUrl || '/images/product.webp'" :alt="selectedProduct.name"
                    class="absolute inset-0 w-full h-full object-cover">
                </div>

                <!-- Product Details -->
                <div class="space-y-4 p-10">
                  <h2 class="text-2xl font-bold">{{ selectedProduct.name }}</h2>
                  <p class="text-gray-400 text-sm">{{ selectedProduct.description }}</p>

                  <!-- Categories -->
                  <div v-if="selectedProduct.categories?.length" class="space-y-2">
                    <h3 class="text-sm font-medium text-gray-500">Categories</h3>
                    <div class="flex flex-wrap items-center justify-center gap-2">
                      <UBadge v-for="category in selectedProduct.categories"
                        :key="typeof category === 'string' ? category : category._id" color="primary" variant="soft"
                        size="sm">
                        {{ typeof category === 'string' ? category : category.title }}
                      </UBadge>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="text-3xl font-bold text-primary-600">
                    {{ formatPrice(selectedProduct.price) }} ₺
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-4 pt-4 w-full items-center justify-center">
                    <UButton color="primary" icon="i-heroicons-shopping-cart" :loading="addingToCart"
                      @click="quickAddToCart(selectedProduct)" :ui="{
                        rounded: $settings.uiConfig.rounded,
                      }">
                      Sepete Ekle
                    </UButton>
                    <UButton color="gray" variant="ghost" :to="`/products/${selectedProduct._id}`"
                      icon="i-heroicons-arrow-right" :ui="{
                        rounded: $settings.uiConfig.rounded,
                      }">
                      Detaylar
                    </UButton>
                  </div>
                </div>
              </div>
            </UModal>
          </div>

          <!-- Yükleme Göstergesi -->
          <div v-if="hasMoreProducts" ref="loadMoreTrigger" class="py-8 flex justify-center">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-600" />
          </div>

          <!-- Ürün Bulunamadı -->
          <UCard v-if="filteredProducts.length === 0" class="text-center p-8" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            <template #header>
              <div class="flex justify-center">
                <UIcon name="i-heroicons-face-frown" class="text-6xl text-gray-400" />
              </div>
            </template>
            <h3 class="text-xl font-semibold mb-2">
              No Products Found
            </h3>
            <p class="text-gray-500">
              No products match your selected filters.
              <UButton variant="link" @click="resetFilters">
                Clear filters
              </UButton>
              and try again.
            </p>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const { $settings } = useNuxtApp()
useSeoMeta({
  title: 'Shop',
  ogTitle: 'Shop',
  description: 'Shopping Page',
  ogDescription: 'Shopping Page'
})
// Mobil filtre state
const isMobileFiltersOpen = ref(false)

// Filtre state'leri
const selectedCategory = ref(null)

// Sıralama state'i
const sortOption = ref('default')
const priceRange = ref({
  min: null,
  max: null
})

// Arama state'i
const searchQuery = ref('')

// Aktif filtre durumu
const hasActiveFilters = computed(() => {
  return selectedCategory.value
})

// Filtre seçenekleri
const { data: categories } = await useFetch('/api/categories')

// Seçili kategori ismini getir
const getSelectedCategoryName = (type) => {
  switch (type) {
    case 'main':
      return categories.value.find(c => c._id === selectedCategory.value)?.title
    default:
      return ''
  }
}

// Filtreleri sıfırla
const resetFilters = () => {
  selectedCategory.value = null
  sortOption.value = 'default'
  priceRange.value = { min: null, max: null }
  searchQuery.value = ''
  isMobileFiltersOpen.value = false
}

// Ürünleri getir
const { data: products } = await useFetch('/api/products')

// Fiyat formatlama fonksiyonu
const formatPrice = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Metin temizleme fonksiyonu
const sanitizeText = (text) => {
  if (!text) return ''
  return text.trim().replace(/\s+/g, ' ')
}

// Filtrelenmiş ve sıralanmış ürünleri hesapla
const filteredProducts = computed(() => {
  if (!products.value) return []

  const filtered = products.value.map(product => ({
    ...product,
    name: sanitizeText(product.name),
    description: sanitizeText(product.description)
  })).filter((product) => {
    // Arama filtresi
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch
        = product.name.toLowerCase().includes(query)
        || product.description.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Kategori filtresi
    if (selectedCategory.value && !product.categories.includes(selectedCategory.value)) {
      return false
    }

    // Fiyat aralığı filtresi
    if (priceRange.value.min && product.price < priceRange.value.min) {
      return false
    }
    if (priceRange.value.max && product.price > priceRange.value.max) {
      return false
    }

    return true
  })

  // Sıralama
  return filtered.sort((a, b) => {
    switch (sortOption.value) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'price-asc':
        return (a.price || 0) - (b.price || 0)
      case 'price-desc':
        return (b.price || 0) - (a.price || 0)
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })
})

// Pagination state
const visibleProducts = ref(12)

// Pagination computed properties
const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, visibleProducts.value)
})

const hasMoreProducts = computed(() => {
  return filteredProducts.value.length > visibleProducts.value
})

const remainingProducts = computed(() => {
  return filteredProducts.value.length - visibleProducts.value
})

// Infinite scroll için ref
const loadMoreTrigger = ref(null)
const loading = ref(false)

// Intersection Observer kurulumu
onMounted(() => {
  const observer = new IntersectionObserver(
    async (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMoreProducts.value && !loading.value) {
        loading.value = true
        await loadMore()
        loading.value = false
      }
    },
    {
      rootMargin: '100px'
    }
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }

  // Component unmount olduğunda observer'ı temizle
  onUnmounted(() => {
    if (loadMoreTrigger.value) {
      observer.unobserve(loadMoreTrigger.value)
    }
  })
})

// Load more products
const loadMore = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)) // Yükleme animasyonunu görebilmek için küçük gecikme
  visibleProducts.value += 12
}

// Reset pagination when filters change
watch([selectedCategory, sortOption, priceRange], () => {
  visibleProducts.value = 12
  isMobileFiltersOpen.value = false
})

// Watch fonksiyonları
watch([selectedCategory], () => {
  // Filtre değiştiğinde drawer'ı kapat
  isMobileFiltersOpen.value = false
})

// Watch additional filters
watch([selectedCategory, sortOption, priceRange, searchQuery], () => {
  visibleProducts.value = 12
})

// Route'dan kategori parametresini izle
const route = useRoute()

// URL'den gelen kategoriyi otomatik seç
watchEffect(() => {
  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
})

// Quick view state
const showQuickView = ref(false)
const selectedProduct = ref(null)
const addingToCart = ref(false)
const toast = useToast()

// Quick view functions - update openQuickView to fetch full product data
async function openQuickView(product) {
  try {
    // Fetch full product data with populated categories
    const { data } = await useFetch(`/api/products/${product._id}`)
    selectedProduct.value = data.value
    showQuickView.value = true
  } catch (error) {
    toast.add({
      title: 'Hata',
      description: 'Ürün detayları yüklenirken bir hata oluştu',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
  }
}

async function quickAddToCart(product) {
  addingToCart.value = true
  try {
    await $fetch('/api/cart/add', {
      method: 'POST',
      body: {
        productId: product._id,
        quantity: 1
      }
    })

    toast.add({
      title: 'Başarılı',
      description: 'Ürün sepete eklendi',
      color: 'green',
      icon: 'i-heroicons-check-circle',
      timeout: 2000
    })

    // Update mini cart
    const nuxtApp = useNuxtApp()
    nuxtApp.callHook('cart:updated')

    // Close modal if open
    showQuickView.value = false
  } catch (error) {
    toast.add({
      title: 'Hata',
      description: 'Ürün sepete eklenirken bir hata oluştu',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
      timeout: 3000
    })
  } finally {
    addingToCart.value = false
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gradient-mask {
  mask-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  -webkit-mask-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
