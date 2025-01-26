<script setup lang="ts">
const { $settings } = useNuxtApp()
const loading = ref(false)
const sliders = ref([])
const activeSlider = ref(null)
const carouselRef = ref()

// Load slider data
const loadSliders = async () => {
  loading.value = true
  try {
    // First get all settings
    const settings = await $fetch('/api/settings')
    const activeSliderSetting = settings.find((s: any) => s.key === 'activeSlider')

    // Then get all sliders
    const response = await $fetch('/api/sliders')
    sliders.value = Array.isArray(response) ? response : []

    // Find active slider
    if (activeSliderSetting?.value) {
      activeSlider.value = sliders.value.find(s => s._id === activeSliderSetting.value)
    }
  } catch (error) {
    console.error('Slider loading error:', error)
  } finally {
    loading.value = false
  }
}

// Computed property for slider items
const sliderItems = computed(() => activeSlider.value?.items || [])

// Motion animation utility
const getMotion = (index: number) => ({
  initial: {
    opacity: 0,
    x: index % 2 === 0 ? -100 : 100
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.2,
      type: 'spring'
    }
  }
})

// Initialize on mount
onMounted(async () => {
  await loadSliders()

  // Interval for autoplay
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 5000)
})
</script>

<template>
  <div>
    <div class="relative h-screen top-0 right-0 m-0 p-0" />
    <div
      id="home"
      class="overflow-hidden p-0 m-0 top-0 absolute w-full"
    >
      <UCarousel
        ref="carouselRef"
        v-slot="{ item, index }"
        :items="sliderItems"
        :ui="{ item: 'basis-full' }"
        indicators
        class="pointer-events-none"
      >
        <div class="relative w-screen h-screen top-0">
          <!-- Medya -->
          <div class="absolute inset-0">
            <video
              v-if="item.type === 'video'"
              :src="item.url"
              class="w-full h-full object-cover"
              autoplay
              muted
              loop
              playsinline
            />
            <img
              v-else
              :src="item.url"
              class="w-full h-full object-cover"
              :alt="item.title"
            >
          </div>

          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-white/90 via-dark/80 dark:from-black/90 dark:via-black/80 to-transparent"
          />

          <!-- Content -->
          <div class="relative container mx-auto h-full flex items-center justify-center">
            <div class="max-w-3xl text-gray dark:text-white p-8">
              <UBadge
                v-if="item.subtitle"
                v-motion="getMotion(0)"
                variant="subtle"
                size="lg"
                class="mb-4"
                :label="item.subtitle"
                :ui="{
                  rounded: $settings.uiConfig.rounded,
                  shadow: $settings.uiConfig.shadow,
                  background: $settings.uiConfig.background,
                  ring: $settings.uiConfig.border
                }"
              />

              <h2
                v-motion="getMotion(1)"
                class="text-4xl md:text-6xl font-bold mb-4"
              >
                {{ item.title }}
              </h2>

              <p
                v-motion="getMotion(2)"
                class="text-lg text-gray/80 dark:text-white/80"
              >
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </UCarousel>
    </div>
  </div>
</template>
