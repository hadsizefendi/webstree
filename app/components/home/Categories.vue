<script setup lang="ts">
const { $settings } = useNuxtApp()
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const loading = ref(false)
const categories = ref([])

// Fetch categories
const loadCategories = async () => {
    loading.value = true
    try {
        const response = await $fetch('/api/categories')
        categories.value = Array.isArray(response) ? response : []
    } catch (error) {
        console.error('Categories loading error:', error)
    } finally {
        loading.value = false
    }
}

// Motion animation utility
const getMotion = (index: number) => ({
    initial: { opacity: 0, x: 20 },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            delay: index * 0.1,
            type: 'spring',
            damping: 25
        }
    }
})

onMounted(async () => {
    await loadCategories()
})
</script>

<template>
    <ULandingSection title="Browse Our Categories" description="Discover products that suit your needs"
        class="backdrop-blur-sm">
        <!-- Show loading state -->
        <div v-if="loading" class="w-full h-80 flex items-center justify-center">
            <UProgress animation="carousel" />
        </div>

        <Swiper v-else :modules="[Autoplay]" :slides-per-view="'auto'" :space-between="10" :grab-cursor="true"
            :loop="true" :autoplay="{
                delay: 1,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: false
            }" :speed="6000" :allowTouchMove="true" class="w-full overflow-hidden gradient-mask">
            <SwiperSlide v-for="(category, index) in categories" :key="category._id" class="!w-auto"
                v-motion="getMotion(index)">
                <NuxtLink :to="`/shop?category=${category._id}`" class="block">
                    <UCard
                        class="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                        :ui="{
                            body: { padding: '!p-0' },
                            rounded: $settings.uiConfig.rounded,
                            shadow: $settings.uiConfig.shadow,
                            background: $settings.uiConfig.background,
                            ring: $settings.uiConfig.border
                        }">

                        <div class="relative w-40 h-40 md:w-80 md:h-80 aspect-square">
                            <img :src="category.image || '/images/category.webp'" :alt="category.title"
                                class="w-full h-full object-cover duration-500">
                            <div
                                class="absolute inset-0 p-1 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-300" />
                            <div class="absolute inset-0 p-4 flex flex-col justify-end">
                                <p
                                    class="text-sm text-white/90 drop-shadow-xl opacity-0 group-hover:opacity-100 duration-500">
                                    {{ category.description }}
                                </p>
                                <h3 class="category-title text-xl text-white mb-2 font-black">
                                    {{ category.title }}
                                </h3>
                            </div>
                        </div>
                    </UCard>
                </NuxtLink>
            </SwiperSlide>
        </Swiper>
    </ULandingSection>
</template>

<style scoped>
/* Swiper slide geçiş animasyonunu yumuşatma */
:deep(.swiper-slide) {
    transition-timing-function: linear !important;
}

:deep(.swiper-wrapper) {
    transition-timing-function: linear !important;
    will-change: transform;
}

.gradient-mask {
    mask-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0) 100%);
    -webkit-mask-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0) 100%);
}

.category-title {
    transform: scale(1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: bottom;
    will-change: transform, font-variation-settings;
}

.group:hover .category-title {
    font-variation-settings: 'wght' 800, 'wdth' 125;
    transform: scale(1.05);
    letter-spacing: 0.02em;
}
</style>
