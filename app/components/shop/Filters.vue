<template>
  <UCard class="h-fit" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Filters</h2>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-circle" @click="$emit('reset')" label="Clear" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"/>
      </div>
    </template>

    <!-- Search Box -->
    <div class="space-y-4 mb-6">
      <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search products..."
        @input="$emit('update:searchQuery', searchQuery)" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"/>
    </div>

    <!-- Sorting -->
    <div class="space-y-4">
      <h3 class="font-medium text-left text-primary-500">Sort By</h3>
      <USelect v-model="sortOption" :options="[
        { label: 'Default', value: 'default' },
        { label: 'Name (A-Z)', value: 'name-asc' },
        { label: 'Name (Z-A)', value: 'name-desc' },
        { label: 'Price (Low to High)', value: 'price-asc' },
        { label: 'Price (High to Low)', value: 'price-desc' },
        { label: 'Newest', value: 'newest' },
      ]" @update:model-value="$emit('update:sortOption', $event)" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"/>
    </div>

    <!-- Price Range -->
    <div class="space-y-4 mt-6">
      <h3 class="font-medium text-left text-primary-500">Price Range</h3>
      <div class="flex items-center gap-2">
        <UInput v-model="localPriceRange.min" type="number" placeholder="Min"
          size="sm" @update:model-value="updatePriceRange" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"/>
        <span>-</span>
        <UInput v-model="localPriceRange.max" type="number" placeholder="Max"
          size="sm" @update:model-value="updatePriceRange" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }"/>
      </div>
    </div>

    <!-- Categories -->
    <div class="space-y-4 mt-6">
      <h3 class="font-medium text-left text-primary-500">Categories</h3>
      <div class="space-y-1 flex flex-col items-left">
        <UButton v-for="category in categories" :key="category._id"
          :variant="selectedCategory === category._id ? 'outline' : 'ghost'" :label="category.title"
          class="w-full overflow-hidden relative" @click="$emit('update:selectedCategory', category._id)" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
          <template #leading>
            <img :src="category.image" :alt="category.title"
              class="absolute w-full h-full object-cover -z-[1] left-0 gradient-mask" />
          </template>
        </UButton>
      </div>
    </div>
  </UCard>
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
