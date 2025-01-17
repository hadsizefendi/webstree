<template>
  <div class="product-gallery relative">
    <!-- Vertical Thumbnails - Only Desktop -->
    <div class="hidden lg:block absolute h-full">
      <swiper :modules="[Navigation, Thumbs]" @swiper="setThumbsSwiper" :direction="'vertical'" :spaceBetween="0"
        class="h-full" :slides-per-view="7">
        <swiper-slide v-for="(item, index) in media" :key="item.url"
          class="cursor-pointer rounded-xl overflow-hidden relative">
          <template v-if="isVideo(item.url)">
            <video class="w-16 h-16 object-cover rounded-lg">
              <source :src="item.url" :type="getVideoType(item.url)">
            </video>
            <!-- Video İkonu Katmanı -->
            <div
              class="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/80 top-0 w-full h-full pb-1">
              <UIcon name="i-heroicons-play-circle-solid" class="w-8 h-8 text-primary-500" />
            </div>
          </template>
          <img v-else :src="item.url || '/images/product.webp'" :alt="`Thumbnail ${index + 1}`"
            class="w-16 h-16 object-cover rounded-lg" loading="lazy" />
        </swiper-slide>
      </swiper>
    </div>

    <!-- Main Swiper -->
    <div class="lg:pl-20">
      <swiper :modules="[Navigation, Pagination, Thumbs]" :thumbs="{ swiper: thumbsSwiper }" :pagination="{
        dynamicBullets: true,
        enabled: true,
        bulletClass: 'swiper-pagination-bullet !bg-primary-500'
      }" :navigation="{
        enabled: true
      }" @slideChange="handleSlideChange"
        class="main-swiper aspect-square rounded-2xl bg-gray-50/50 dark:bg-gray-900/50">
        <swiper-slide v-for="(item, index) in media" :key="item.url"
          class="cursor-zoom-in max-h-[50vh] overflow-hidden brightness-100" @click="openLightbox">
          <div class="w-full h-0 pb-[100%] relative">
            <template v-if="isVideo(item.url)">
              <video class="absolute w-full h-full object-cover" muted loop autoplay>
                <source :src="item.url" :type="getVideoType(item.url)">
              </video>
            </template>
            <img v-else :src="item.url || '/images/product.webp'" :alt="`Product image ${index + 1}`"
              class="absolute w-full h-full object-cover" />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- Lightbox -->
    <UModal v-model="isLightboxOpen" class="bg-black/95" :ui="{
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }">
      <div class="relative max-w-5xl mx-auto">
        <template v-if="isVideo(currentImage.url)">
          <video class="max-h-[85vh] w-auto mx-auto" controls>
            <source :src="currentImage.url" :type="getVideoType(currentImage.url)">
          </video>
        </template>
        <img v-else :src="currentImage.url || '/images/product.webp'" :alt="currentImage.alt || 'Full size image'"
          class="max-h-[85vh] w-auto mx-auto" />
        <UButton class="absolute top-4 right-4" color="white" variant="ghost" icon="i-heroicons-x-mark"
          @click="isLightboxOpen = false" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }" />
      </div>
    </UModal>
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const props = defineProps({
  media: {
    type: Array,
    default: () => []
  }
})

const currentIndex = ref(0)
const isLightboxOpen = ref(false)
const thumbsSwiper = ref(null)

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper
}

const currentImage = computed(() => {
  return props.media[currentIndex.value] || { url: '' }
})

const handleSlideChange = (swiper) => {
  currentIndex.value = swiper.activeIndex
}

const openLightbox = () => {
  isLightboxOpen.value = true
}

// Video kontrolü için yeni fonksiyonlar
const isVideo = (url) => {
  return url.match(/\.(mp4|webm|ogg)$/i);
}

const getVideoType = (url) => {
  const extension = url.split('.').pop().toLowerCase();
  const typeMap = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg'
  };
  return typeMap[extension] || 'video/mp4';
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (e) => {
    if (e.key === 'ArrowLeft') currentIndex.value = (currentIndex.value - 1 + props.media.length) % props.media.length
    if (e.key === 'ArrowRight') currentIndex.value = (currentIndex.value + 1) % props.media.length
    if (e.key === 'Escape') isLightboxOpen.value = false
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>

<style scoped>
.main-swiper {
  --swiper-navigation-size: 20px;
  --swiper-navigation-color: theme('colors.gray.800');
  --swiper-pagination-color: theme('colors.gray.800');
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  @apply bg-white/80 p-6 rounded-full backdrop-blur-sm transition-all hover:bg-white;
}

:deep(.swiper-pagination) {
  @apply bg-white/80 py-1 px-3 rounded-full backdrop-blur-sm inline-block;
}

:deep(.swiper-slide) {
  @apply transition-all duration-200;
}

:deep(.swiper-slide-thumb-active) {
  @apply opacity-100 brightness-100;
}

:deep(.swiper-slide:not(.swiper-slide-thumb-active)) {
  @apply opacity-70 hover:opacity-90;
}

/* Yeni stil eklentileri */
:deep(.swiper-slide) video {
  @apply transition-all duration-200;
}

.i-heroicons-play-circle {
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
}

/* Main swiper için yeni stiller */
.main-swiper :deep(.swiper-slide) {
  @apply brightness-100 opacity-100;
}

.main-swiper :deep(.swiper-slide img),
.main-swiper :deep(.swiper-slide video) {
  @apply brightness-100;
}
</style>
