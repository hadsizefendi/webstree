<template>
  <div class="space-y-4">
    <!-- Color Preview and Selected Color -->
    <div class="flex items-center gap-4">
      <div
        class="w-16 h-16 rounded-lg shadow-inner"
        :class="`bg-${modelValue}-${selectedTone}`"
      />
      <div>
        <div class="font-medium capitalize">
          {{ modelValue }}-{{ selectedTone }}
        </div>
      </div>
    </div>

    <!-- Color Grid -->
    <div class="space-y-4">
      <div
        v-for="(colors, groupName) in colorGroups"
        :key="groupName"
        class="space-y-2"
      >
        <div class="text-sm font-medium text-gray-500">
          {{ groupName }}
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in colors"
            :key="color"
            class="w-10 h-10 transition-transform hover:scale-110 hover:shadow-lg relative"
            :class="[
              `bg-${color}-${selectedTone} ring-1`,
              modelValue === color ? 'ring-2 ring-offset-2 ring-gray-700' : ''
            ]"
            @click="selectColor(color)"
          >
            <UIcon
              v-if="modelValue === color"
              name="i-heroicons-check"
              class="absolute inset-0 m-auto w-5 h-5 text-white"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Tone Selector -->
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <div class="text-sm font-medium text-gray-500">
          Tone
        </div>
        <div class="text-sm font-medium">
          {{ selectedTone }}
        </div>
      </div>
      <URange
        v-model="selectedTone"
        :min="100"
        :max="900"
        :step="100"
        class="max-w-full"
        @change="selectTone"
      >
        <template #track>
          <div
            class="h-2 rounded-full"
            :class="`bg-${modelValue}-${selectedTone}`"
          />
        </template>
      </URange>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  defaultTone?: number
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const colorGroups = {
  'Base Colors': ['red', 'orange', 'amber', 'yellow', 'lime', 'green'],
  'Nature Colors': ['emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo'],
  'Vibrant Colors': ['violet', 'purple', 'fuchsia', 'pink', 'rose'],
  'Gray Scale': ['slate', 'zinc', 'neutral', 'stone']
}

const selectedTone = ref(props.defaultTone || 500)

const selectColor = (color: string) => {
  emit('update:modelValue', color)
  emit('change')
}

const selectTone = () => {
  emit('change')
}

watch(() => props.defaultTone, (newTone) => {
  if (newTone) {
    selectedTone.value = newTone
  }
})
</script>
