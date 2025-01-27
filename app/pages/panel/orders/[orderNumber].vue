<template>
  <div class="py-8">
    <UContainer>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold">Sipariş Detayı</h1>
          <p class="text-gray-600">Sipariş No: {{ order?.orderNumber }}</p>
        </div>
        <UButton to="/shop" color="primary" :ui="{ rounded: $settings.uiConfig.rounded }">
          Alışverişe Devam Et
        </UButton>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <!-- Sipariş Durumu -->
          <UCard :ui="{ /* ...ui config... */ }">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium">Sipariş Durumu</h2>
                <UBadge :color="getStatusColor(order?.status)" size="lg">
                  {{ getStatusText(order?.status) }}
                </UBadge>
              </div>
            </template>
            <div class="space-y-4">
              <p class="text-sm text-gray-600">
                Sipariş Tarihi: {{ formatDate(order?.createdAt) }}
              </p>
              <p class="text-sm text-gray-600">
                Ödeme Yöntemi: {{ getPaymentMethodText(order?.paymentMethod) }}
              </p>
            </div>
          </UCard>

          <!-- Teslimat Adresi -->
          <UCard :ui="{ /* ...ui config... */ }">
            <template #header>
              <h2 class="text-lg font-medium">Teslimat Adresi</h2>
            </template>
            <div class="space-y-2">
              <p class="font-medium">{{ order?.shippingAddress?.title }}</p>
              <p>{{ order?.shippingAddress?.firstName }} {{ order?.shippingAddress?.lastName }}</p>
              <p class="text-sm text-gray-600">{{ order?.shippingAddress?.address }}</p>
              <p class="text-sm text-gray-600">
                {{ order?.shippingAddress?.neighborhood }}, 
                {{ order?.shippingAddress?.district }}/{{ order?.shippingAddress?.city }}
              </p>
              <p class="text-sm text-gray-600">Tel: {{ order?.shippingAddress?.phone }}</p>
            </div>
          </UCard>

          <!-- Fatura Adresi -->
          <UCard :ui="{ /* ...ui config... */ }">
            <template #header>
              <h2 class="text-lg font-medium">Fatura Adresi</h2>
            </template>
            <div class="space-y-2">
              <p class="font-medium">{{ order?.billingAddress?.title }}</p>
              <p>{{ order?.billingAddress?.firstName }} {{ order?.billingAddress?.lastName }}</p>
              <p class="text-sm text-gray-600">{{ order?.billingAddress?.address }}</p>
              <p class="text-sm text-gray-600">
                {{ order?.billingAddress?.neighborhood }}, 
                {{ order?.billingAddress?.district }}/{{ order?.billingAddress?.city }}
              </p>
              <p class="text-sm text-gray-600">Tel: {{ order?.billingAddress?.phone }}</p>
            </div>
          </UCard>
        </div>

        <!-- Sipariş Özeti -->
        <div class="space-y-6">
          <UCard :ui="{ /* ...ui config... */ }">
            <template #header>
              <h2 class="text-lg font-medium">Sipariş Özeti</h2>
            </template>
            <div class="space-y-4">
              <div v-for="item in order?.items" :key="item.productId._id" 
                class="flex justify-between items-center">
                <span class="text-gray-600">
                  {{ item.productId.name }} (x{{ item.quantity }})
                </span>
                <span class="font-medium">
                  {{ formatPrice(item.price * item.quantity) }} ₺
                </span>
              </div>
              
              <div class="pt-4 border-t">
                <div class="flex justify-between items-center mb-2">
                  <span>Ara Toplam</span>
                  <span class="font-medium">{{ formatPrice(order?.subtotal) }} ₺</span>
                </div>
                <div class="flex justify-between items-center mb-4">
                  <span>Kargo</span>
                  <span class="text-green-600">Ücretsiz</span>
                </div>
                <div class="flex justify-between items-center text-lg font-bold">
                  <span>Toplam</span>
                  <span class="text-primary-600">{{ formatPrice(order?.totalAmount) }} ₺</span>
                </div>
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
const route = useRoute()

// Sipariş detaylarını getir
const { data: order } = await useFetch(`/api/orders/${route.params.orderNumber}`)

// Helper fonksiyonlar
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
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR').format(price)
}
</script>
