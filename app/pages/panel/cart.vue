<template>
  <div class="py-8">
    <UContainer>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Shopping Cart</h1>
        <div class="space-x-4">
          <UButton to="/panel/orders" color="gray" variant="ghost" :ui="{ rounded: $settings.uiConfig.rounded }">
            <template #leading>
              <UIcon name="i-heroicons-clock-solid" />
            </template>
            Siparişlerim
          </UButton>
        </div>
      </div>

      <div v-if="pending" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-gray-100 h-24 rounded-lg" />
      </div>

      <div v-else-if="!cart?.items?.length" class="text-center py-16">
        <p class="text-gray-500 mb-4">Your cart is empty</p>
        <UButton to="/shop" color="primary" :ui="{ rounded: $settings.uiConfig.rounded }">
          Continue Shopping
        </UButton>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-4">
          <!-- Select All Header -->
          <div class="flex items-center gap-3 p-2">
            <UCheckbox
              v-model="selectAll"
              @change="handleSelectAll"
              :ui="{ wrapper: 'cursor-pointer' }"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Select All Items ({{ selectedItems.length }}/{{ cart.items.length }})
            </span>
          </div>

          <!-- Cart Items -->
          <UCard v-for="item in cart.items" :key="item.productId._id"
            class="overflow-hidden hover:!ring-primary-500 duration-300 cursor-pointer select-none" 
            :class="{ 'opacity-60': !selectedItemIds.includes(item.productId._id) }"
            :ui="{
              rounded: $settings.uiConfig.rounded,
              shadow: $settings.uiConfig.shadow,
              background: $settings.uiConfig.background,
              ring: $settings.uiConfig.border,
              body: { padding: 'p-0' }
            }"
            @click="toggleItemSelection(item.productId._id)"
          >
            <div class="flex items-center gap-6 p-4">
              <!-- Checkbox - prevent click propagation -->
              <UCheckbox
                v-model="selectedItemIds"
                :value="item.productId._id"
                :ui="{ wrapper: 'cursor-pointer' }"
                @click.stop
              />

              <!-- Ürün Görseli -->
              <NuxtImg placeholder :src="item.productId.imageUrl"
                  class="absolute inset-0 w-full h-full object-cover z-[-1] opacity-10" :alt="item.productId.name" />
                <div class="relative w-20 h-20 flex-shrink-0">
                  <NuxtImg placeholder :src="item.productId.imageUrl"
                    class="absolute inset-0 w-full h-full rotate-y-45 object-cover rounded-lg" :alt="item.productId.name" />
                </div>
              <!-- Ürün Bilgileri -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h3 class="font-medium text-lg truncate">
                      {{ item.productId.name }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-left">
                      {{ formatPrice(item.productId.price) }} ₺
                    </p>
                  </div>
                  <UBadge variant="subtle" size="lg">
                    {{ formatPrice(item.productId.price * item.quantity) }} ₺
                  </UBadge>
                </div>

                <!-- Miktar Kontrolü ve Silme -->
                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center gap-2">
                    <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-minus"
                      :disabled="item.quantity <= 1" @click="updateQuantity(item, item.quantity - 1)" />
                    <span class="w-12 text-center">{{ item.quantity }}</span>
                    <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-plus"
                      @click="updateQuantity(item, item.quantity + 1)" />
                  </div>
                  <UButton size="sm" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeItem(item)">
                    Remove
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Sipariş Özeti - Sticky -->
        <div class="sticky bottom-4 md:top-16 h-fit">
          <UCard :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            <template #header>
              <h2 class="text-lg font-medium">Order Summary</h2>
            </template>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">
                  Selected Items ({{ selectedItems.length }})
                </span>
                <span class="font-medium">
                  {{ formatPrice(selectedTotal) }} ₺
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                <span class="font-medium text-green-600 dark:text-green-400">Free</span>
              </div>
              <div class="pt-4 border-t">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-lg font-semibold">Total</span>
                  <span class="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {{ formatPrice(selectedTotal) }} ₺
                  </span>
                </div>
                <UButton
                  color="primary"
                  block
                  size="lg"
                  :disabled="!selectedItems.length"
                  :ui="{ rounded: $settings.uiConfig.rounded }"
                  @click="handleCheckout"
                >
                  Checkout ({{ selectedItems.length }} items)
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
const toast = useToast()

// Reactive data yönetimi için composable kullan
const { data: cartData, pending } = await useFetch('/api/cart')
const cart = ref(cartData.value?.cart)

const cartTotal = computed(() => {
  return cart.value?.items?.reduce((total, item) => {
    return total + (item.productId.price * item.quantity)
  }, 0) || 0
})

// Toplam ürün sayısını hesapla
const totalItems = computed(() => {
  return cart.value?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
})

const selectedItemIds = ref([])
const selectAll = ref(true)

// Seçili ürünleri hesapla
const selectedItems = computed(() => {
  return cart.value?.items.filter(item => 
    selectedItemIds.value.includes(item.productId._id)
  ) || []
})

// Seçili ürünlerin toplamını hesapla
const selectedTotal = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + (item.productId.price * item.quantity)
  }, 0)
})

// Sayfa yüklendiğinde tüm ürünleri seç
onMounted(() => {
  if (cart.value?.items) {
    selectedItemIds.value = cart.value.items.map(item => item.productId._id)
  }
})

// Tümünü seç/kaldır
function handleSelectAll(checked) {
  if (checked) {
    selectedItemIds.value = cart.value?.items.map(item => item.productId._id) || []
  } else {
    selectedItemIds.value = []
  }
}

// Cart güncellendiğinde seçimleri güncelle
watch(() => cart.value?.items, (newItems) => {
  if (newItems) {
    // Silinmiş ürünleri seçili listeden kaldır
    selectedItemIds.value = selectedItemIds.value.filter(id => 
      newItems.some(item => item.productId._id === id)
    )
    // Seçili tüm öğelerin durumunu güncelle
    selectAll.value = selectedItemIds.value.length === newItems.length
  }
}, { deep: true })

// Seçili öğeler değiştiğinde selectAll durumunu güncelle
watch(selectedItemIds, (newSelectedIds) => {
  selectAll.value = cart.value?.items && 
    newSelectedIds.length === cart.value.items.length
}, { deep: true })

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
    const nuxtApp = useNuxtApp()
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
    const nuxtApp = useNuxtApp()
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

// Global cart güncellemelerini dinle
const nuxtApp = useNuxtApp()
nuxtApp.hook('cart:updated', async () => {
  const { data } = await useFetch('/api/cart')
  if (data.value?.cart) {
    cart.value = data.value.cart
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}

// Ürün seçimini toggle yapma
function toggleItemSelection(productId) {
  const index = selectedItemIds.value.indexOf(productId)
  if (index > -1) {
    selectedItemIds.value.splice(index, 1)
  } else {
    selectedItemIds.value.push(productId)
  }
}

// Checkout işlemini başlat
function handleCheckout() {
  // Seçili ürünleri localStorage'a kaydet
  localStorage.setItem('checkoutItems', JSON.stringify(selectedItems.value))
  // Checkout sayfasına yönlendir
  navigateTo('/panel/checkout')
}
</script>
