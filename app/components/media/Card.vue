<template>
  <UCard
    class="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative"
    :ui="{
      body: { padding: '!p-0' },
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }"
  >
    <div class="relative w-full h-full">
      <div
        class="absolute top-2 left-2 z-20 bg-black/50 flex items-center justify-center p-1 rounded-md backdrop-blur-md"
      >
        <UIcon
          :name="item.type === 'image' ? 'i-heroicons-photo' : 'i-heroicons-film'"
          class="w-5 h-5 text-white"
        />
      </div>
      <img
        v-if="item.type === 'image'"
        :src="item.url"
        :alt="item.title"
        class="w-40 h-40 object-cover"
      >
      <video
        v-else
        ref="videoRef"
        :src="item.url"
        class="w-40 h-40 object-cover"
        muted
        loop
        @mouseenter="playVideo"
        @mouseleave="stopVideo"
      />
      <div
        v-if="isSelected"
        class="absolute top-2 right-2 text-yellow-500"
      >
        <UIcon
          name="i-heroicons-check-circle-20-solid"
          class="w-6 h-6"
        />
      </div>
    </div>
    <div
      class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
    >
      <div class="absolute w-full grid grid-cols-3 bottom-0 pointer-events-auto">
        <UButton
          block
          color="blue"
          variant="ghost"
          icon="i-heroicons-eye"
          size="xs"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @click.stop="$emit('preview')"
        />
        <UButton
          block
          color="red"
          variant="ghost"
          icon="i-heroicons-trash"
          size="xs"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @click.stop="$emit('delete')"
        />
        <UButton
          block
          :color="isSelected ? 'amber' : 'yellow'"
          variant="ghost"
          :icon="isSelected ? 'i-heroicons-plus-circle' : 'i-heroicons-check-circle'"
          size="xs"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @click.stop="(e) => $emit('toggle-select', e)"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { $settings } = useNuxtApp()
const _props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['preview', 'delete', 'toggle-select'])

const videoRef = ref(null)

const playVideo = () => {
  if (videoRef.value) {
    videoRef.value.play()
  }
}

const stopVideo = () => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
}
</script>
