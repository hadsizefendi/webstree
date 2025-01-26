<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent">
          Other Products
        </h2>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-6 gap-4">
        <NuxtLink
          v-for="product in latestProducts"
          :key="product._id"
          :to="`/products/${product._id}`"
          class="group"
        >
          <UCard
            :ui="{
              body: { padding: '!p-0' },
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border
            }"
          >
            <div class="relative pb-[100%] overflow-hidden">
              <img
                :src="product.imageUrl || '/images/product.webp'"
                :alt="product.name"
                class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
              >
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            <div class="p-4">
              <h3 class="font-semibold mb-2 line-clamp-1">
                {{ product.name }}
              </h3>
              <p
                v-if="product.price"
                class="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent"
              >
                {{ formatPrice(product.price) }} ₺
              </p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
const { data: products } = await useFetch('/api/products')

// Diziyi karıştırmak için yardımcı fonksiyon
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Rastgele 6 ürün seç
const latestProducts = computed(() => {
  if (!products.value) return []
  return shuffleArray([...products.value]).slice(0, 6)
})

// Price formatter
const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}
</script>
