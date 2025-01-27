<template>
  <div>
    <UChip :text="totalItems || ''" :show="totalItems > 0" color="primary" position="top-right" size="2xl">
      <UButton icon="i-heroicons-shopping-cart" color="gray" variant="ghost" @click="isOpen = true" :ui="{
        rounded: $settings.uiConfig.rounded,
        shadow: $settings.uiConfig.shadow
      }" />
    </UChip>

    <USlideover v-model="isOpen" side="right">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="p-4 border-b border-primary-500">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6">
              Shopping Cart ({{ totalItems }})
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isOpen = false" />
          </div>
        </div>

        <!-- Cart Items - Scrollable Area -->
        <div class="flex-1 overflow-auto">
          <div v-if="!cart?.items?.length" class="flex items-center justify-center h-full">
            <p class="text-gray-500">Your cart is empty</p>
          </div>
          <div v-else class="space-y-4 p-4">
            <UCard v-for="item in cart.items" :key="item.productId._id" class="overflow-hidden" :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border,
              body: { padding: 'p-0' }
            }">
              <div class="flex items-center gap-4 p-3">
                <!-- Ürün Görseli -->
                <NuxtImg placeholder :src="item.productId.imageUrl"
                  class="absolute inset-0 w-full h-full object-cover z-[-1] opacity-10" :alt="item.productId.name" />
                <div class="relative w-20 h-20 flex-shrink-0">
                  <NuxtImg placeholder :src="item.productId.imageUrl"
                    class="absolute inset-0 w-full h-full object-cover rounded-lg" :alt="item.productId.name" />
                </div>
                <!-- Ürün Bilgileri -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h3 class="font-medium text-sm truncate">
                        {{ item.productId.name }}
                      </h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
                        {{ formatPrice(item.productId.price) }} ₺
                      </p>
                    </div>
                    <p class="text-sm font-semibold whitespace-nowrap">
                      {{ formatPrice(item.productId.price * item.quantity) }} ₺
                    </p>
                  </div>

                  <!-- Miktar Kontrolü ve Silme -->
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center gap-1">
                      <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-minus"
                        :disabled="item.quantity <= 1" @click="updateQuantity(item, item.quantity - 1)" />
                      <span class="w-6 text-center text-xs">{{ item.quantity }}</span>
                      <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-plus"
                        @click="updateQuantity(item, item.quantity + 1)" />
                    </div>
                    <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeItem(item)" />
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Footer - Fixed at Bottom -->
        <div class="border-t border-primary-500 bg-white dark:bg-gray-900">
          <div class="p-4 space-y-4">
            <div class="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{{ formatPrice(cartTotal) }} ₺</span>
            </div>
            <UButton to="/panel/cart" block color="primary" size="lg" :ui="{ rounded: $settings.uiConfig.rounded }"
              @click="isOpen = false">
              View Cart
            </UButton>
          </div>
        </div>
      </div>
    </USlideover>
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
const { data: cartData, refresh } = await useFetch('/api/cart')
const cart = ref(cartData.value?.cart)
const isOpen = ref(false)
const toast = useToast()

const totalItems = computed(() => {
  return cart.value?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
})

const cartTotal = computed(() => {
  return cart.value?.items?.reduce((total, item) => {
    return total + (item.productId.price * item.quantity)
  }, 0) || 0
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}

async function updateQuantity(item, newQuantity) {
  if (newQuantity < 1) return

  // Önce UI'ı güncelle
  const itemIndex = cart.value.items.findIndex(i => i.productId._id === item.productId._id)
  if (itemIndex !== -1) {
    cart.value.items[itemIndex].quantity = newQuantity
  }

  try {
    await $fetch('/api/cart/update', {
      method: 'PUT',
      body: {
        productId: item.productId._id,
        quantity: newQuantity
      }
    })

    // Global cart güncelleme eventi tetikle
    nuxtApp.callHook('cart:updated')
  } catch (error) {
    // Hata durumunda eski değere geri dön
    if (itemIndex !== -1) {
      cart.value.items[itemIndex].quantity = item.quantity
    }
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to update quantity',
      color: 'red'
    })
  }
}

async function removeItem(item) {
  // Önce UI'dan kaldır
  cart.value.items = cart.value.items.filter(i => i.productId._id !== item.productId._id)

  try {
    await $fetch(`/api/cart/remove?productId=${item.productId._id}`, {
      method: 'DELETE'
    })

    // Global cart güncelleme eventi tetikle
    nuxtApp.callHook('cart:updated')

    toast.add({
      title: 'Success',
      description: 'Item removed from cart',
      color: 'green'
    })
  } catch (error) {
    // Hata durumunda item'ı geri ekle
    cart.value.items.push(item)
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to remove item',
      color: 'red'
    })
  }
}

// Cart değişikliklerini izle
watch(() => cartData.value?.cart, (newCart) => {
  cart.value = newCart
}, { deep: true })

// Global olay dinleyicisi
const nuxtApp = useNuxtApp()
nuxtApp.hook('cart:updated', refresh)

// Global cart güncellemelerini dinle
nuxtApp.hook('cart:updated', async (updatedCart) => {
  if (updatedCart) {
    // Doğrudan güncelleme
    cart.value = updatedCart
  } else {
    // API'den yeniden çek
    const { data } = await useFetch('/api/cart')
    if (data.value?.cart) {
      cart.value = data.value.cart
    }
  }
})
</script>
