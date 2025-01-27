<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12">
    <div class="w-full max-w-lg text-center space-y-8">
      <!-- Error Animation -->
      <div class="relative w-32 h-32 mx-auto">
        <div class="absolute inset-0 rounded-full bg-red-50 animate-pulse" />
        <div class="relative rounded-full bg-red-100 p-8">
          <UIcon name="i-heroicons-x-circle" class="w-16 h-16 text-red-500 animate-shake" />
        </div>
      </div>

      <!-- Error Content -->
      <div class="space-y-4">
        <h1 class="text-3xl font-bold">
          Bir Sorun Oluştu!
        </h1>
        <p class="text-lg text-gray-600">
          {{ errorMessage || 'Siparişiniz işlenirken bir hata oluştu.' }}
          Lütfen tekrar deneyiniz.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
        <UButton
          to="/panel/checkout"
          color="primary"
          size="lg"
          :ui="{ rounded: $settings.uiConfig.rounded }"
        >
          <template #leading>
            <UIcon name="i-heroicons-arrow-path" />
          </template>
          Tekrar Dene
        </UButton>

        <UButton
          to="/panel/cart"
          variant="ghost"
          size="lg"
          :ui="{ rounded: $settings.uiConfig.rounded }"
        >
          <template #leading>
            <UIcon name="i-heroicons-shopping-cart" />
          </template>
          Sepete Dön
        </UButton>
      </div>

      <!-- Support Info -->
      <UCard class="mt-8" :ui="{ rounded: $settings.uiConfig.rounded }">
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            Sorun devam ederse müşteri hizmetlerimizle iletişime geçebilirsiniz:
          </p>
          <div class="flex items-center justify-center gap-6">
            <a href="tel:+905070664411" class="flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <UIcon name="i-heroicons-phone" class="w-5 h-5" />
              <span>0507 066 44 11</span>
            </a>
            <a href="mailto:support@webstree.com" class="flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
              <span>support@webstree.com</span>
            </a>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
const route = useRoute()

const errorMessage = route.query.message
</script>

<style>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-2px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(2px, 0, 0);
  }
}
</style>
