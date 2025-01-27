<template>
  <form @submit.prevent="$emit('submit')" class="space-y-4">
    <div class="grid md:grid-cols-2 gap-4">
      <UFormGroup label="First Name" required>
        <UInput v-model="address.firstName" 
          placeholder="Adınız"
          :ui="{ rounded: $settings.uiConfig.rounded }"
          :icon="'i-heroicons-user'"
          @update:model-value="updateAddressTitle" />
      </UFormGroup>
      <UFormGroup label="Last Name" required>
        <UInput v-model="address.lastName" 
          placeholder="Soyadınız"
          :ui="{ rounded: $settings.uiConfig.rounded }"
          :icon="'i-heroicons-user'" />
      </UFormGroup>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <UFormGroup label="Email" required>
        <UInput v-model="address.email" 
          type="email" 
          placeholder="ornek@email.com"
          :ui="{ rounded: $settings.uiConfig.rounded }"
          :icon="'i-heroicons-envelope'" />
      </UFormGroup>
      <UFormGroup label="Phone" required>
        <UInput v-model="address.phone" 
          placeholder="05XX XXX XX XX"
          :ui="{ rounded: $settings.uiConfig.rounded }"
          :icon="'i-heroicons-phone'" />
      </UFormGroup>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <UFormGroup label="City" required>
        <UInput v-model="address.city" 
          placeholder="İl"
          :ui="{ rounded: $settings.uiConfig.rounded }"
          :icon="'i-heroicons-building-office-2'" />
      </UFormGroup>
      <UFormGroup label="District" required>
        <UInput v-model="address.district" 
          placeholder="İlçe"
          :ui="{ rounded: $settings.uiConfig.rounded }"
          :icon="'i-heroicons-map'" />
      </UFormGroup>
      <UFormGroup label="Neighborhood" required>
        <UInput v-model="address.neighborhood" 
          placeholder="Mahalle"
          :ui="{ rounded: $settings.uiConfig.rounded }"
          :icon="'i-heroicons-home-modern'" />
      </UFormGroup>
    </div>

    <UFormGroup label="Address" required>
      <UTextarea v-model="address.address" 
        placeholder="Sokak, apartman no, daire no vb. detaylı adres bilgisi"
        :ui="{ rounded: $settings.uiConfig.rounded }"
        :icon="'i-heroicons-map-pin'"
        rows="3" />
    </UFormGroup>


    <UFormGroup label="Adres Tipi" required>
      <div class="grid grid-cols-2 gap-4">
        <UCard v-for="type in addressTypes" 
          :key="type.value"
          :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: 'none',
            ring: selectedType === type.value ? '!ring-primary-500' : '!ring-primary-500/20',
            background: selectedType === type.value ? 'bg-primary-50' : 'bg-white'
          }"
          class="cursor-pointer hover:!bg-primary-500/10 transition-all duration-200"
          @click="selectAddressType(type.value)"
        >
            <div class="flex items-center justify-center gap-2">
              <UIcon :name="type.icon" class="w-6 h-6 text-primary-500" />
              <span class="block font-medium">{{ type.label }}</span>
            </div>
        </UCard>
      </div>
    </UFormGroup>

    <UFormGroup label="Address Title">
      <UInput v-model="address.title" 
        :placeholder="generatedTitle || 'Adres başlığı otomatik oluşturulacak'"
        :ui="{ rounded: $settings.uiConfig.rounded }"
        :icon="'i-heroicons-home'"
         />
    </UFormGroup>

    <div class="flex justify-end gap-2">
      <UButton color="gray" @click="$emit('cancel')" :ui="{ rounded: $settings.uiConfig.rounded }">
        Cancel
      </UButton>
      <UButton type="submit" color="primary" :loading="loading" :ui="{ rounded: $settings.uiConfig.rounded }">
        {{ submitText }}
      </UButton>
    </div>
  </form>
</template>

<script setup>
const { $settings } = useNuxtApp()

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: 'Save Address'
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const selectedType = ref('home') // Default olarak ev seçili

const addressTypes = [
  {
    value: 'home',
    label: 'Ev',
    icon: 'i-heroicons-home'
  },
  {
    value: 'office',
    label: 'Ofis',
    icon: 'i-heroicons-building-office'
  }
]

// Adres tipini seç ve başlığı güncelle
function selectAddressType(type) {
  selectedType.value = type
  updateAddressTitle()
}

// Otomatik başlık oluştur
const generatedTitle = computed(() => {
  if (!address.value.firstName) return ''
  
  const typeLabel = addressTypes.find(t => t.value === selectedType.value)?.label || ''
  return `${address.value.firstName} ${typeLabel}`
})

// Başlığı güncelle
function updateAddressTitle() {
  if (generatedTitle.value) {
    address.value.title = generatedTitle.value
  }
}

const address = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
