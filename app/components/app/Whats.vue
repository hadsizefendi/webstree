<!-- WhatsApp Button Component -->
<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
  >
    <UIcon
      name="i-simple-icons-whatsapp"
      class="w-8 h-8"
    />

    <!-- Hover Tooltip -->
    <span class="absolute right-16 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
      Send Message via WhatsApp
    </span>
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  phoneNumber: {
    type: String,
    default: '905070664411'
  },
  message: {
    type: String,
    default: 'Hello, I would like to get information.'
  }
})

const whatsappUrl = computed(() => {
  const encodedMessage = encodeURIComponent(props.message)
  return `https://wa.me/${props.phoneNumber}?text=${encodedMessage}`
})
</script>
