<template>
          <div class="sticky bottom-4 md:top-16 h-fit">

  <UCard
    class="h-fit"
    :ui="{
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">
          Filters
        </h2>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-circle"
          label="Clear"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @click="$emit('reset')"
        />
      </div>
    </template>

    <!-- Search Box -->
    <div class="space-y-4 mb-6">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search products..."
        :ui="{
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }"
        @input="$emit('update:searchQuery', searchQuery)"
      />
    </div>

    <!-- Sorting -->
    <div class="space-y-4">
      <h3 class="font-medium text-left text-primary-500">
        Sort By
      </h3>
      <USelect
        v-model="sortOption"
        :options="[
          { label: 'Default', value: 'default' },
          { label: 'Name (A-Z)', value: 'name-asc' },
          { label: 'Name (Z-A)', value: 'name-desc' },
          { label: 'Price (Low to High)', value: 'price-asc' },
          { label: 'Price (High to Low)', value: 'price-desc' },
          { label: 'Newest', value: 'newest' }
        ]"
        :ui="{
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }"
        @update:model-value="$emit('update:sortOption', $event)"
      />
    </div>

    <!-- Price Range -->
    <div class="space-y-4 mt-6">
      <h3 class="font-medium text-left text-primary-500">
        Price Range
      </h3>
      <div class="flex items-center gap-2">
        <UInput
          v-model="localPriceRange.min"
          type="number"
          placeholder="Min"
          size="sm"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @update:model-value="updatePriceRange"
        />
        <span>-</span>
        <UInput
          v-model="localPriceRange.max"
          type="number"
          placeholder="Max"
          size="sm"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @update:model-value="updatePriceRange"
        />
      </div>
    </div>

    <!-- Categories -->
    <div class="space-y-4 mt-6">
      <h3 class="font-medium text-left text-primary-500">
        Categories
      </h3>
      <div class="space-y-1 flex flex-col items-left max-h-[40vh] overflow-y-auto">
        <UButton
          v-for="category in categories"
          :key="category._id"
          :variant="selectedCategory === category._id ? 'outline' : 'ghost'"
          :label="category.title"
          class="w-full overflow-hidden relative duration-300 transition-all transform"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"
          @click="$emit('update:selectedCategory', category._id)"
        >
          <template #leading>
            <img
              :src="category.image"
              :alt="category.title"
              class="absolute w-full h-full object-cover -z-[1] left-0 gradient-mask"
            >
          </template>
        </UButton>
      </div>
    </div>
  </UCard>
  </div>
</template>

<script setup>
const { $settings } = useNuxtApp()

const props = defineProps({
  searchQuery: String,
  sortOption: String,
  priceRange: Object,
  selectedCategory: String,
  categories: Array
})

const emit = defineEmits(['update:searchQuery', 'update:sortOption', 'update:priceRange', 'update:selectedCategory', 'reset'])

const searchQuery = ref(props.searchQuery)
const sortOption = ref(props.sortOption)
const localPriceRange = ref({ ...props.priceRange })

// Props değişikliklerini izle
watch(() => props.searchQuery, (newVal) => {
  searchQuery.value = newVal
})

watch(() => props.sortOption, (newVal) => {
  sortOption.value = newVal
})

watch(() => props.priceRange, (newVal) => {
  localPriceRange.value = { ...newVal }
}, { deep: true })

const updatePriceRange = () => {
  emit('update:priceRange', { ...localPriceRange.value })
}
</script>

<style scoped>
.gradient-mask {
  mask-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  -webkit-mask-image: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
}
</style>
