<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12">
    <div class="w-full max-w-lg text-center space-y-8">
      <!-- Success Animation -->
      <div class="relative w-32 h-32 mx-auto">
        <div class="absolute inset-0 rounded-full bg-green-50 animate-ping-slow" />
        <div class="relative rounded-full bg-green-100 p-8">
          <UIcon name="i-heroicons-check" class="w-16 h-16 text-green-500 animate-bounce-slow" />
        </div>
      </div>

      <!-- Success Content -->
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">
          Siparişiniz Alındı!
        </h1>
        <p class="text-lg text-gray-600">
          {{ orderNumber }} numaralı siparişiniz başarıyla oluşturuldu.
          Size en kısa sürede ulaştıracağız.
        </p>
        
        <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
          <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
          <span>Sipariş detayları e-posta adresinize gönderildi.</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
        <UButton
          to="/panel/orders"
          color="primary"
          size="lg"
          :ui="{ rounded: $settings.uiConfig.rounded }"
        >
          <template #leading>
            <UIcon name="i-heroicons-clipboard-document-list" />
          </template>
          Siparişlerimi Görüntüle
        </UButton>

        <UButton
          to="/shop"
          variant="ghost"
          size="lg"
          :ui="{ rounded: $settings.uiConfig.rounded }"
        >
          <template #leading>
            <UIcon name="i-heroicons-arrow-right" />
          </template>
          Alışverişe Devam Et
        </UButton>
      </div>

      <!-- Order Summary -->
      <UCard class="mt-8" :ui="{ rounded: $settings.uiConfig.rounded }">
        <div class="flex items-center justify-between text-sm">
          <div class="space-y-1">
            <p>Sipariş Tarihi</p>
            <p class="font-medium">{{ formatDate(new Date()) }}</p>
          </div>
          <div class="space-y-1 text-right">
            <p>Toplam Tutar</p>
            <p class="font-medium text-primary-600">{{ formatPrice(orderTotal) }} ₺</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
const route = useRoute()

const orderNumber = route.query.orderNumber
const orderTotal = route.query.total


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

<style>
.animate-ping-slow {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
