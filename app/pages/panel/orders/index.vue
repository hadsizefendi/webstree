<template>
  <div class="py-8">
    <UContainer>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold">Siparişlerim</h1>
          <p v-if="!user" class="text-sm text-gray-500 mt-1">
            Misafir olarak verdiğiniz siparişleriniz bu tarayıcıda saklanmaktadır
          </p>
        </div>
        <UButton to="/shop" color="primary" :ui="{ rounded: $settings.uiConfig.rounded }">
          Alışverişe Devam Et
        </UButton>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-gray-100 h-24 rounded-lg" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!orders.length" class="text-center py-16">
        <p class="text-gray-500 mb-4">Henüz bir siparişiniz bulunmuyor</p>
        <UButton to="/shop" color="primary" :ui="{ rounded: $settings.uiConfig.rounded }">
          Alışverişe Başla
        </UButton>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <UCard v-for="order in orders" :key="order.orderNumber"
          class="hover:!ring-primary-500/20 transition-all duration-200"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
        >
          <!-- Order Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
            @click="toggleOrder(order.orderNumber)">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <p class="font-medium">Sipariş No: {{ order.orderNumber }}</p>
                <UBadge :color="getStatusColor(order.status)" size="sm">
                  {{ getStatusText(order.status) }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <UIcon :name="getPaymentIcon(order.paymentMethod)" class="w-4 h-4" />
                <span>{{ getPaymentMethodText(order.paymentMethod) }}</span>
              </div>
            </div>

            <div class="text-right flex items-center gap-4">
              <div>
                <p class="text-lg font-bold text-primary-600">
                  {{ formatPrice(order.totalAmount) }} ₺
                </p>
                <p class="text-sm text-gray-600">
                  {{ order.items?.length || 0 }} Ürün
                </p>
              </div>
              <UIcon 
                :name="expandedOrders.includes(order.orderNumber) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                class="w-5 h-5 text-gray-400"
              />
            </div>
          </div>

          <!-- Order Details - Expand/Collapse -->
          <div v-if="expandedOrders.includes(order.orderNumber)"
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <!-- Products List -->
            <div class="space-y-3">
              <div v-for="item in order.items" :key="item._id" 
                class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div class="flex items-center gap-3">
                  <UAvatar
                    v-if="item.productId?.imageUrl"
                    :src="item.productId.imageUrl"
                    size="lg"
                    :alt="item.productId.name"
                    :ui="{ rounded: $settings.uiConfig.rounded }"
                  />
                  <div class="text-sm">
                    <p class="font-medium">{{ item.productId?.name }}</p>
                    <p class="text-gray-600">Birim Fiyat: {{ formatPrice(item.price) }} ₺</p>
                    <p v-if="item.variant" class="text-gray-600">Varyant: {{ item.variant }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium">{{ formatPrice(item.total) }} ₺</p>
                  <p class="text-sm text-gray-600">Adet: {{ item.quantity }}</p>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Ara Toplam</span>
                  <span>{{ formatPrice(order.subtotal) }} ₺</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Kargo</span>
                  <span class="text-green-600">Ücretsiz</span>
                </div>
                <div class="flex justify-between font-medium">
                  <span>Toplam</span>
                  <span class="text-primary-600">{{ formatPrice(order.totalAmount) }} ₺</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>

  <!-- Debug için hata gösterimi ekle -->
  <div v-if="error" class="text-red-500 p-4">
    Error: {{ error.message }}
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
const { user } = useAuth()
const sessionId = useCookie('cart_session')

const { data: orders, pending, error } = await useFetch('/api/orders', {
  headers: {
    'cart-session': sessionId.value
  },
  transform: (data) => {
    return data?.map(order => ({
      ...order,
      createdAt: new Date(order.createdAt),
      items: order.items?.map(item => ({
        ...item,
        total: item.price * item.quantity
      }))
    })) || []
  }
})

// Expand/Collapse state
const expandedOrders = ref([])

// Toggle order expansion
function toggleOrder(orderNumber) {
  const index = expandedOrders.value.indexOf(orderNumber)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderNumber)
  }
}

// Helper functions
function getPaymentIcon(method) {
  return method === 'card' ? 'i-heroicons-credit-card' : 'i-heroicons-banknotes'
}

function getStatusColor(status) {
  const colors = {
    pending: 'yellow',
    processing: 'blue',
    shipped: 'primary',
    delivered: 'green',
    cancelled: 'red'
  }
  return colors[status] || 'gray'
}

function getStatusText(status) {
  const texts = {
    pending: 'Beklemede',
    processing: 'İşleniyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi'
  }
  return texts[status] || status
}

function getPaymentMethodText(method) {
  const texts = {
    card: 'Kredi/Banka Kartı',
    cashOnDelivery: 'Kapıda Ödeme'
  }
  return texts[method] || method
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  if (!price || isNaN(price)) return '0'
  return new Intl.NumberFormat('tr-TR').format(price)
}
</script>