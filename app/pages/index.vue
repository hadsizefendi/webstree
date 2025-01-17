<script setup lang="ts">
const { $settings } = useNuxtApp()
useSeoMeta({
  title: 'Webstree Home',
  ogTitle: 'Webstree Home',
  description: 'Webstree Home Page',
  ogDescription: 'Webstree Home Page'
})
const { data: page } = await useAsyncData('index', () =>
  queryContent('/').findOne()
)
const formData = reactive({
  name: '',
  email: '',
  message: ''
})

const loading = ref(false)
const toast = useToast()

const handleSubmit = async () => {
  loading.value = true
  try {
    const { error } = await useFetch('/api/contact', {
      method: 'POST',
      body: formData
    })

    if (error.value) throw error.value

    toast.add({
      title: 'Success!',
      description: 'Your message has been sent successfully.',
      color: 'green'
    })
    formData.name = ''
    formData.email = ''
    formData.message = ''
  } catch (error: any) {
    toast.add({
      title: 'Error!',
      description: error.message || 'Failed to send message. Please try again later.',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

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
  },
  visible: {
    opacity: 1,
    x: 0
  },
  intersection: {
    threshold: 0.1
  }
})

// Slider ile ilgili tüm kodları kaldırıyoruz

</script>

<template>
  <div>
    <HomeSlider />
    <HomeCategories />
    <!-- Features Section -->
    <ULandingSection :title="page.features.title" :description="page.features.description"
      :headline="page.features.headline" class="bg-white/10 dark:bg-black/10 overflow-hidden">
      <UPageGrid id="features" class="scroll-mt-[calc(var(--header-height)+140px+128px+96px)]">
        <UCard v-for="(item, featureIndex) in page.features.items" :key="featureIndex"
          v-motion="getMotion(featureIndex)" class="group" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
          <template #default>
            <div class="flex flex-col items-center p-4">
              <UIcon :name="item.icon" class="w-12 h-12 mb-4 text-primary-500" />
              <h3 class="font-bold text-lg mb-2">{{ item.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center">{{ item.description }}</p>
            </div>
          </template>
        </UCard>
      </UPageGrid>
    </ULandingSection>
    <!-- Core Features Section -->
    <ULandingSection :title="page.hizmet.title" :headline="page.hizmet.headline"
      class="backdrop-blur-sm overflow-hidden bg-primary-50/10">
      <UPageGrid id="core-features" class="scroll-mt-[calc(var(--header-height)+140px+128px+96px)]">
        <UCard v-for="(service, serviceIndex) in page.hizmet.items" :key="serviceIndex"
          v-motion="getMotion(serviceIndex)" class="p-1 group" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
          <template #default>
            <div class="flex flex-col items-center">
              <img :src="service.image" alt="Feature image"
                class="w-full h-auto mb-4 rounded-xl group-hover:rotate-1 duration-500">
              <h3 class="font-black text-sm pb-2 text-emerald-500 dark:text-white uppercase">
                {{ service.title }}
              </h3>
              <p class="text-sm text-center">
                {{ service.description }}
              </p>
            </div>
          </template>
        </UCard>
      </UPageGrid>
    </ULandingSection>

    <!-- Contact Form -->
    <ULandingSection id="contact" title="Contact Us"
      description="Fill out the form below and we'll get back to you as soon as possible."
      class="bg-white/5 dark:bg-black/5 backdrop-blur-sm overflow-hidden">
      <!-- Google Map -->

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <!-- Form Section -->
        <div>
          <!-- Map Card -->
          <UCard class="mb-8" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            <template #default>
              <div class="relative w-full h-[320px] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48965.10632841082!2d41.222501110217905!3d39.911873610177075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406e5f26376d82a5%3A0x65d5d1ea7c043ece!2sUPCREATE.ART!5e0!3m2!1str!2str!4v1736963294560!5m2!1str!2str"
                  class="absolute inset-0 w-full h-full" style="border:0;" allowfullscreen="" loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade" />
              </div>
            </template>
          </UCard>

          <!-- Contact Form Card -->
          <UCard :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormGroup label="Full Name" required>
                  <UInput v-model="formData.name" placeholder="Enter your full name" maxlength="100" required>
                    <template #leading>
                      <UIcon name="i-heroicons-user" />
                    </template>
                    <template #trailing>
                      <span class="text-xs text-gray-500">{{ formData.name.length }}/100</span>
                    </template>
                  </UInput>
                </UFormGroup>

                <UFormGroup label="Email Address" required>
                  <UInput v-model="formData.email" type="email" placeholder="example@email.com" maxlength="100"
                    required>
                    <template #leading>
                      <UIcon name="i-heroicons-envelope" />
                    </template>
                    <template #trailing>
                      <span class="text-xs text-gray-500">{{ formData.email.length }}/100</span>
                    </template>
                  </UInput>
                </UFormGroup>
              </div>

              <UFormGroup label="Message" required>
                <UTextarea v-model="formData.message" placeholder="Type your message here..." maxlength="1000" :rows="6"
                  class="resize-none" required />
                <template #hint>
                  <div class="flex justify-end">
                    <span class="text-xs text-gray-500">{{ formData.message.length }}/1000 characters</span>
                  </div>
                </template>
              </UFormGroup>

              <div class="flex justify-end space-x-4 items-center">
                <p v-if="loading" class="text-sm text-gray-500">
                  Sending message...
                </p>
                <UButton type="submit" color="primary" :loading="loading"
                  :disabled="!formData.name || !formData.email || !formData.message" class="min-w-32">
                  <template #leading>
                    <UIcon name="i-heroicons-paper-airplane" />
                  </template>
                  Send
                </UButton>
              </div>
            </form>
          </UCard>
        </div>

        <!-- Contact Information Card -->
        <UCard class="overflow-hidden flex items-center justify-center" :ui="{
          rounded: $settings.uiConfig.rounded,
          shadow: $settings.uiConfig.shadow,
          background: $settings.uiConfig.background,
          ring: $settings.uiConfig.border
        }">
          <div>
            <!-- Decorative Background Elements -->
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-primary-200/20 dark:bg-primary-500/10 rounded-full -mr-16 -mt-16" />
            <div
              class="absolute bottom-0 left-0 w-24 h-24 bg-primary-200/30 dark:bg-primary-500/20 rounded-full -ml-12 -mb-12" />

            <div class="relative space-y-6">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                Contact Information
              </h3>

              <div class="max-w-lg mx-auto space-y-6">
                <!-- Address Card -->
                <div
                  class="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div class="flex items-start gap-4">
                    <div class="flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                      <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                        Address
                      </h4>
                      <a href="https://maps.app.goo.gl/6n3ZqQL7g68EySFN7" target="_blank"
                        class="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Ataturk University<br>
                        </p>
                        <UIcon name="i-heroicons-arrow-right"
                          class="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </div>
                  </div>
                </div>
                <!-- Phone Card -->
                <div
                  class="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div class="flex items-start gap-4">
                    <div class="flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                      <UIcon name="i-heroicons-phone" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                        Phone
                      </h4>
                      <a href="tel:+905070664411"
                        class="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
                        +90 507 066 44 11
                        <UIcon name="i-heroicons-arrow-right"
                          class="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </div>
                  </div>
                </div>

                <!-- WhatsApp Card -->
                <div
                  class="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div class="flex items-start gap-4">
                    <div class="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                      <UIcon name="i-simple-icons-whatsapp" class="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                        WhatsApp
                      </h4>
                      <a href="https://wa.me/905070664411" target="_blank"
                        class="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
                        Send Message
                        <UIcon name="i-heroicons-arrow-right"
                          class="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Working Hours Card -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                  <div class="flex items-start gap-4">
                    <div class="flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                      <UIcon name="i-heroicons-clock" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                        Working Hours
                      </h4>
                      <p class="text-gray-600 dark:text-gray-300">
                        <span class="font-medium">7/24</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </ULandingSection>
    <!-- Frequently Asked Questions (FAQ) Section -->
    <ULandingSection id="faq" :title="page.faq.title" :description="page.faq.description"
      class="scroll-mt-[var(--header-height)] backdrop-blur-sm overflow-hidden">
      <ULandingFAQ v-for="(faq, faqIndex) in page.faq.items" :key="faqIndex" v-motion="getMotion(faqIndex)"
        :items="[faq]" :ui="{
          button: {
            label: 'font-semibold',
            trailingIcon: {
              base: 'w-6 h-6'
            }
          }
        }" class="max-w-4xl mx-auto" />
    </ULandingSection>
  </div>
</template>
