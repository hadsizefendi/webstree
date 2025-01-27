<template>
    <div class="py-8">
        <UContainer>
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-2xl font-bold">Checkout</h1>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <div class="md:col-span-2 space-y-6">
                    <!-- Shipping Address Card -->
                    <UCard :ui="{
                        rounded: $settings.uiConfig.rounded,
                        shadow: $settings.uiConfig.shadow,
                        background: $settings.uiConfig.background,
                        ring: $settings.uiConfig.border
                    }">
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h2 class="text-lg font-medium">Teslimat Adresi</h2>
                                <UButton v-if="!showAddressForm" color="primary" variant="ghost" icon="i-heroicons-plus"
                                    @click="showAddressForm = true">
                                    Yeni Adres Ekle
                                </UButton>
                            </div>
                        </template>

                        <!-- Address Form -->
                        <UCard v-if="showAddressForm" class="mb-4" :ui="{
                            rounded: $settings.uiConfig.rounded,
                            shadow: $settings.uiConfig.shadow,
                            background: $settings.uiConfig.background,
                            ring: $settings.uiConfig.border
                        }">
                            <ShopAddressForm
                                v-model="newAddress"
                                :loading="loading"
                                submit-text="Save Address"
                                @submit="saveAddress"
                                @cancel="showAddressForm = false"
                            />
                        </UCard>

                        <!-- Address List -->
                        <div v-if="addresses.length" class="grid grid-cols-1 gap-4">
                            <UCard v-for="address in addresses" :key="address._id" :ui="{
                                rounded: $settings.uiConfig.rounded,
                                shadow: 'none',
                                ring: selectedShippingAddress === address._id ? '!ring-primary-500' : '!ring-primary-500/20',
                                background: selectedShippingAddress === address._id ? 'bg-primary-50' : 'bg-white'
                            }" class="cursor-pointer hover:!bg-primary-500/10 transition-all duration-200"
                                @click="selectedShippingAddress = address._id">
                                <div class="flex items-start gap-3">
                                    <div class="relative flex items-center mt-1">
                                        <div class="w-4 h-4 rounded-full border-2"
                                            :class="selectedShippingAddress === address._id ? 'border-primary-500' : 'border-gray-300'">
                                            <div v-if="selectedShippingAddress === address._id"
                                                class="absolute inset-0 w-2 h-2 m-auto rounded-full bg-primary-500">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-1 space-y-1">
                                        <div class="flex items-center justify-between">
                                            <p class="font-medium">{{ address.title }}</p>
                                            <UBadge v-if="address.isDefault" color="primary" variant="soft" size="sm">
                                                Varsayılan
                                            </UBadge>
                                        </div>
                                        <p class="text-sm text-gray-600">
                                            {{ address.firstName }} {{ address.lastName }}
                                        </p>
                                        <p class="text-sm text-gray-600">{{ address.address }}</p>
                                        <p class="text-sm text-gray-600">
                                            {{ address.neighborhood }}, {{ address.district }}/{{ address.city }}
                                        </p>
                                        <p class="text-sm text-gray-600">Tel: {{ address.phone }}</p>
                                    </div>
                                </div>
                            </UCard>
                        </div>

                        <!-- Fatura Adresi Seçeneği -->
                        <template #footer>
                            <UCheckbox v-model="differentBillingAddress" label="Fatura adresi farklı olsun" />
                        </template>
                    </UCard>

                    <!-- Billing Address Card - Sadece farklı fatura adresi istendiğinde göster -->
                    <UCard v-if="differentBillingAddress" :ui="{
                        rounded: $settings.uiConfig.rounded,
                        shadow: $settings.uiConfig.shadow,
                        background: $settings.uiConfig.background,
                        ring: $settings.uiConfig.border
                    }">
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h2 class="text-lg font-medium">Fatura Adresi</h2>
                                <UButton v-if="!showBillingForm" color="primary" variant="ghost" icon="i-heroicons-plus"
                                    @click="showBillingForm = true">
                                    Yeni Fatura Adresi Ekle
                                </UButton>
                            </div>
                        </template>

                        <!-- Billing Address Form -->
                        <UCard v-if="showBillingForm" class="mb-4" :ui="{
                            rounded: $settings.uiConfig.rounded,
                            shadow: $settings.uiConfig.shadow,
                            background: $settings.uiConfig.background,
                            ring: $settings.uiConfig.border
                        }">
                            <ShopAddressForm
                                v-model="newAddress"
                                :loading="loading"
                                submit-text="Save Billing Address"
                                @submit="saveBillingAddress"
                                @cancel="showBillingForm = false"
                            />
                        </UCard>

                        <!-- Billing Address List -->
                        <div v-if="billingAddresses.length" class="grid grid-cols-1 gap-4">
                            <UCard v-for="address in billingAddresses" :key="address._id" :ui="{
                                rounded: $settings.uiConfig.rounded,
                                shadow: 'none',
                                ring: selectedBillingAddress === address._id ? '!ring-primary-500' : '!ring-primary-500/20',
                                background: selectedBillingAddress === address._id ? 'bg-primary-50' : 'bg-white'
                            }" class="cursor-pointer hover:!bg-primary-500/10 transition-all duration-200"
                                @click="selectedBillingAddress = address._id">
                                <div class="flex items-start gap-3">
                                    <div class="relative flex items-center mt-1">
                                        <div class="w-4 h-4 rounded-full border-2"
                                            :class="selectedBillingAddress === address._id ? 'border-primary-500' : 'border-gray-300'">
                                            <div v-if="selectedBillingAddress === address._id"
                                                class="absolute inset-0 w-2 h-2 m-auto rounded-full bg-primary-500">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-1 space-y-1">
                                        <div class="flex items-center justify-between">
                                            <p class="font-medium">{{ address.title }}</p>
                                            <UBadge v-if="address.isDefault" color="primary" variant="soft" size="sm">
                                                Varsayılan
                                            </UBadge>
                                        </div>
                                        <p class="text-sm text-gray-600">
                                            {{ address.firstName }} {{ address.lastName }}
                                        </p>
                                        <p class="text-sm text-gray-600">{{ address.address }}</p>
                                        <p class="text-sm text-gray-600">
                                            {{ address.neighborhood }}, {{ address.district }}/{{ address.city }}
                                        </p>
                                        <p class="text-sm text-gray-600">Tel: {{ address.phone }}</p>
                                    </div>
                                </div>
                            </UCard>
                        </div>
                    </UCard>

                    <!-- Payment Method Card -->
                    <UCard :ui="{
                        rounded: $settings.uiConfig.rounded,
                        shadow: $settings.uiConfig.shadow,
                        background: $settings.uiConfig.background,
                        ring: $settings.uiConfig.border
                    }">
                        <template #header>
                            <h2 class="text-lg font-medium">Ödeme Yöntemi</h2>
                        </template>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="option in paymentOptions" :key="option.value">
                                <UCard :ui="{
                                    rounded: $settings.uiConfig.rounded,
                                    shadow: 'none',
                                    ring: paymentMethod === option.value ? '!ring-primary-500' : '!ring-primary-500/20',
                                    background: paymentMethod === option.value ? 'bg-primary-50' : 'bg-white'
                                }" class="cursor-pointer hover:!bg-primary-500/10 transition-all duration-200"
                                    @click="paymentMethod = option.value">
                                    <div class="flex items-center gap-3">
                                        <div class="flex-1">
                                            <UIcon :name="option.icon" class="w-10 h-10 text-primary-500" />
                                            <span class="block font-medium">{{ option.label }}</span>
                                            <span class="text-sm text-gray-600">{{ option.description }}</span>
                                        </div>
                                    </div>
                                </UCard>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Order Summary - Sticky -->
                <div class="sticky bottom-4 md:top-16 h-fit">
                    <UCard :ui="{
                        rounded: $settings.uiConfig.rounded,
                        shadow: 'md:' + $settings.uiConfig.shadow,
                        background: $settings.uiConfig.background,
                        ring: $settings.uiConfig.border,
                        divide: 'divide-y divide-gray-200 dark:divide-gray-800'
                    }">
                        <template #header>
                            <div class="flex items-center justify-between cursor-pointer md:cursor-default" @click="toggleSummary">
                                <div class="flex items-center gap-2">
                                    <h2 class="text-lg font-medium">Order Summary</h2>
                                    <UBadge color="primary" variant="subtle" size="sm">
                                        {{ selectedItems.length }} items
                                    </UBadge>
                                </div>
                                <UButton
                                    color="gray"
                                    variant="ghost"
                                    icon="i-heroicons-chevron-up"
                                    class="md:hidden animate-pulse"
                                    :class="{ 'rotate-180': !showSummary }"
                                />
                            </div>
                        </template>

                        <div :class="[
                            'transition-all duration-300 overflow-y-scroll',
                            showSummary ? 'max-h-[40vh] opacity-100' : 'max-h-0 opacity-0 md:max-h-[40vh] md:opacity-100'
                        ]">
                            <div class="space-y-4">
                                <div v-for="item in selectedItems" :key="item.productId._id"
                                    class="flex justify-between items-center">
                                    <span class="text-gray-600 dark:text-gray-400">
                                        {{ item.productId.name }} (x{{ item.quantity }})
                                    </span>
                                    <span class="font-medium">
                                        {{ formatPrice(item.productId.price * item.quantity) }} ₺
                                    </span>
                                </div>
                            </div>
                        </div>

                        <template #footer>
                            <div class="space-y-4">
                                <div class="flex justify-between items-center mb-2">
                                        <span>Subtotal</span>
                                        <span class="font-medium">{{ formatPrice(orderTotal) }} ₺</span>
                                    </div>
                                    <div class="flex justify-between items-center mb-4">
                                        <span>Shipping</span>
                                        <span class="text-green-600">Free</span>
                                    </div>

                                <div class="flex justify-between items-center text-lg font-bold">
                                    <span>Total</span>
                                    <span class="text-primary-600">{{ formatPrice(orderTotal) }} ₺</span>
                                </div>
                                <UButton
                                    color="primary"
                                    block
                                    size="lg"
                                    :loading="processing"
                                    :disabled="!canCompleteOrder"
                                    @click="completeOrder"
                                >
                                    Complete Order
                                </UButton>
                            </div>
                        </template>
                    </UCard>
                </div>
            </div>
        </UContainer>
    </div>
</template>

<script setup>
const { $settings } = useNuxtApp()
const toast = useToast()

// State tanımlamaları
const showAddressForm = ref(false)
const showBillingForm = ref(false)
const differentBillingAddress = ref(false)
const paymentMethod = ref('card')
const processing = ref(false)
const loading = ref(false)
const selectedShippingAddress = ref(null)
const selectedBillingAddress = ref(null)

// Form states
const addresses = ref([])
const billingAddresses = ref([])

const newAddress = ref({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    neighborhood: '',
    address: ''
})

// Get data from API and localStorage
const { data: addressesData } = await useFetch('/api/addresses')
const { data: cartData } = await useFetch('/api/cart')
const selectedItems = ref(cartData.value?.cart?.items || [])

// Update addresses from API response
addresses.value = addressesData.value?.shippingAddresses || []
billingAddresses.value = addressesData.value?.billingAddresses || []

// Calculate order total
const orderTotal = computed(() => {
    return selectedItems.value.reduce((total, item) => {
        return total + (item.productId.price * item.quantity)
    }, 0)
})

// Form validation
const canCompleteOrder = computed(() => {
    return selectedShippingAddress.value &&
        (!differentBillingAddress.value || selectedBillingAddress.value) &&
        paymentMethod.value
})

// Watch for address changes
watch([addresses, billingAddresses], () => {
    localStorage.setItem('guestAddresses', JSON.stringify({
        shipping: addresses.value,
        billing: billingAddresses.value
    }))
})

// Component lifecycle hooks
onMounted(() => {
    const savedItems = localStorage.getItem('checkoutItems')
    const savedAddresses = localStorage.getItem('guestAddresses')

    if (savedItems) {
        selectedItems.value = JSON.parse(savedItems)
        localStorage.removeItem('checkoutItems')
    }

    if (savedAddresses) {
        const { shipping, billing } = JSON.parse(savedAddresses)
        addresses.value = shipping || []
        billingAddresses.value = billing || []
    }
})

onUnmounted(() => {
    localStorage.removeItem('checkoutItems')
})

// Giriş yapılıp yapılmadığını kontrol et
const { user } = useAuth()

// Save address function güncellemesi
async function saveAddress() {
  loading.value = true
  try {
    let response
    
    if (user.value?._id) {
      // Üye kullanıcı için adres kaydet
      response = await $fetch('/api/addresses/add', {
        method: 'POST',
        body: {
          ...newAddress.value,
          type: 'shipping'
        }
      })
    } else {
      // Misafir kullanıcı için adres kaydet
      response = await $fetch('/api/addresses/guest', {
        method: 'POST',
        body: {
          ...newAddress.value,
          type: 'shipping'
        }
      })
    }
    
    addresses.value.push(response.address)
    selectedShippingAddress.value = response.address._id
    showAddressForm.value = false
    
    // LocalStorage'a kaydet
    saveAddressesToStorage()
    
    toast.add({
      title: 'Başarılı',
      description: 'Adres başarıyla kaydedildi',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Hata',
      description: error.message || 'Adres kaydedilirken bir hata oluştu',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Billing adres kaydetme fonksiyonu da benzer şekilde güncellenir
async function saveBillingAddress() {
  loading.value = true
  try {
    let response
    
    if (user.value?._id) {
      response = await $fetch('/api/addresses/add', {
        method: 'POST',
        body: {
          ...newAddress.value,
          type: 'billing'
        }
      })
    } else {
      response = await $fetch('/api/addresses/guest', {
        method: 'POST',
        body: {
          ...newAddress.value,
          type: 'billing'
        }
      })
    }
    
    billingAddresses.value.push(response.address)
    selectedBillingAddress.value = response.address._id
    showBillingForm.value = false
    
    // LocalStorage'a kaydet
    saveAddressesToStorage()
    
    toast.add({
      title: 'Başarılı',
      description: 'Fatura adresi başarıyla kaydedildi',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Hata',
      description: error.message || 'Fatura adresi kaydedilirken bir hata oluştu',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// LocalStorage'a adresleri kaydet
function saveAddressesToStorage() {
  localStorage.setItem('guestAddresses', JSON.stringify({
    shipping: addresses.value,
    billing: billingAddresses.value
  }))
}

// Sipariş tamamlama fonksiyonunu güncelle
async function completeOrder() {
  if (!canCompleteOrder.value) {
    toast.add({
      title: 'Uyarı',
      description: 'Lütfen gerekli tüm alanları doldurun',
      color: 'yellow'
    })
    return
  }

  processing.value = true
  toast.add({
    title: 'İşleniyor',
    description: 'Siparişiniz işleniyor, lütfen bekleyin...',
    color: 'blue'
  })

  try {
    const shippingAddress = addresses.value.find(a => a._id === selectedShippingAddress.value)
    const billingAddress = differentBillingAddress.value 
      ? billingAddresses.value.find(a => a._id === selectedBillingAddress.value)
      : shippingAddress

    const orderData = {
      shippingAddress,
      billingAddress,
      paymentMethod: paymentMethod.value,
      items: selectedItems.value
    }

    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: orderData
    })

    toast.add({
      title: 'Başarılı',
      description: 'Siparişiniz başarıyla oluşturuldu',
      color: 'green'
    })

    // Cart güncelleme event'ini tetikle
    const nuxtApp = useNuxtApp()
    nuxtApp.callHook('cart:updated', response.cart)

    // Başarılı sayfasına yönlendir
    navigateTo(`/panel/checkout/success?orderNumber=${response.order.orderNumber}&total=${orderTotal.value}`)

  } catch (error) {
    toast.add({
      title: 'Hata',
      description: error.message || 'Sipariş oluşturulurken bir hata oluştu',
      color: 'red'
    })
    // Hata sayfasına yönlendir
    navigateTo(`/panel/checkout/error?message=${error.message || 'Sipariş oluşturulamadı'}`)
  } finally {
    processing.value = false
  }
}

// Handle payment submission
async function handlePayment() {
    try {
        // Add payment processing logic here
        toast.add({
            title: 'Success',
            description: 'Order placed successfully',
            color: 'green'
        })
    } catch (error) {
        toast.add({
            title: 'Error',
            description: 'Payment failed',
            color: 'red'
        })
    }
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR').format(price)
}

// Payment options
const paymentOptions = [
    {
        value: 'card',
        label: 'Kredi/Banka Kartı',
        description: 'Güvenli ödeme',
        icon: 'i-heroicons-credit-card'
    },
    {
        value: 'cashOnDelivery',
        label: 'Kapıda Ödeme',
        description: 'Nakit veya kart ile kapıda ödeme',
        icon: 'i-heroicons-banknotes'
    }
]

// Mobil görünüm için summary toggle state
const showSummary = ref(false)

// Toggle summary function
function toggleSummary() {
    if (window.innerWidth < 768) { // Sadece mobilde çalışsın
        showSummary.value = !showSummary.value
    }
}

// Ekran boyutu değiştiğinde summary'yi sıfırla
onMounted(() => {
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            showSummary.value = true
        }
    })
})

// Adres seçildiğinde toast göster
watch(selectedShippingAddress, (newValue) => {
  if (newValue) {
    toast.add({
      title: 'Teslimat Adresi',
      description: 'Teslimat adresi seçildi',
      color: 'green'
    })
  }
})

watch(selectedBillingAddress, (newValue) => {
  if (newValue) {
    toast.add({
      title: 'Fatura Adresi',
      description: 'Fatura adresi seçildi',
      color: 'green'
    })
  }
})

// Ödeme yöntemi seçildiğinde toast göster
watch(paymentMethod, (newValue) => {
  const selectedOption = paymentOptions.find(opt => opt.value === newValue)
  toast.add({
    title: 'Ödeme Yöntemi',
    description: `${selectedOption.label} seçildi`,
    color: 'green'
  })
})

// differentBillingAddress değiştiğinde toast göster
watch(differentBillingAddress, (newValue) => {
  toast.add({
    title: 'Fatura Adresi',
    description: newValue ? 'Farklı fatura adresi seçildi' : 'Teslimat adresi fatura adresi olarak kullanılacak',
    color: 'blue'
  })
})
</script>
