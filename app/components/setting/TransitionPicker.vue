<template>
  <div class="space-y-4 pointer-events-none opacity-20">
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-lg shadow-inner flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div class="preview-icon">
          <UIcon name="i-heroicons-sparkles" class="w-8 h-8" />
        </div>
      </div>
      <div>
        <div class="font-medium">{{ getTransitionLabel }}</div>
        <div class="text-sm text-gray-500">Animation Effect</div>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="(animations, category) in transitionGroups" :key="category" class="space-y-2">
        <div class="text-sm font-medium text-gray-500">{{ category }}</div>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="transition in animations"
            :key="transition.value"
            class="p-4 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            :class="[
              modelValue === transition.value ? 'ring-2 ring-offset-2 ring-primary-500' : ''
            ]"
            @click="selectTransition(transition)"
          >
            <div class="preview-content">
              <div class="font-medium">{{ transition.label }}</div>
            </div>
            <UIcon
              v-if="modelValue === transition.value"
              name="i-heroicons-check-circle"
              class="absolute top-2 right-2 w-5 h-5 text-primary-500"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])
const { $anime } = useNuxtApp()

const transitionGroups = {
  'Fade': [
    { label: 'Fade', value: 'fade', animation: { opacity: [0, 1] } },
    { label: 'Fade Up', value: 'fadeUp', animation: { opacity: [0, 1], translateY: [20, 0] } },
    { label: 'Fade Down', value: 'fadeDown', animation: { opacity: [0, 1], translateY: [-20, 0] } },
    { label: 'Fade Left', value: 'fadeLeft', animation: { opacity: [0, 1], translateX: [-20, 0] } },
    { label: 'Fade Right', value: 'fadeRight', animation: { opacity: [0, 1], translateX: [20, 0] } }
  ],
  'Scale': [
    { label: 'Scale', value: 'scale', animation: { scale: [0, 1] } },
    { label: 'Scale Up', value: 'scaleUp', animation: { scale: [0.5, 1], translateY: [20, 0] } },
    { label: 'Scale Down', value: 'scaleDown', animation: { scale: [1.5, 1], translateY: [-20, 0] } }
  ],
  'Slide': [
    { label: 'Slide Up', value: 'slideUp', animation: { translateY: [100, 0] } },
    { label: 'Slide Down', value: 'slideDown', animation: { translateY: [-100, 0] } },
    { label: 'Slide Left', value: 'slideLeft', animation: { translateX: [-100, 0] } },
    { label: 'Slide Right', value: 'slideRight', animation: { translateX: [100, 0] } }
  ],
  'Rotate': [
    { label: 'Rotate', value: 'rotate', animation: { rotate: [180, 0] } },
    { label: 'Rotate Left', value: 'rotateLeft', animation: { rotate: [-180, 0] } },
    { label: 'Rotate Right', value: 'rotateRight', animation: { rotate: [180, 0] } }
  ]
}

const getTransitionLabel = computed(() => {
  for (const group of Object.values(transitionGroups)) {
    const transition = group.find(t => t.value === props.modelValue)
    if (transition) return transition.label
  }
  return 'Default'
})

// Preview animasyonunu çalıştır
const previewAnimation = (animation: any) => {
  $anime({
    targets: '.preview-icon',
    ...animation,
    duration: 800,
    easing: 'easeOutExpo'
  })
}

// Seçilen transitionu güncelle ve preview göster
function selectTransition(transition: any) {
  emit('update:modelValue', transition.value)
  emit('change', transition.value)
  previewAnimation(transition.animation)
}

// Mevcut seçili animasyonu preview olarak göster
onMounted(() => {
  const currentTransition = Object.values(transitionGroups)
    .flat()
    .find(t => t.value === props.modelValue)
  
  if (currentTransition) {
    previewAnimation(currentTransition.animation)
  }
})
</script>
