<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

useSeoMeta({
  title: 'Login - WebsTree',
  ogTitle: 'Login - WebsTree',
  description: 'Login Panel - WebsTree',
  ogDescription: 'Login Panel - WebsTree'
})

const { $settings } = useNuxtApp()
const router = useRouter()
const toast = useToast()

// Form States - değişiklik burada
const activeTab = ref('login') // Yeni eklendi
const loading = ref(false)
const showVerificationModal = ref(false)
const verificationCode = ref('')
const verificationEmail = ref('')

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const forgotForm = reactive({
  email: ''
})

const resendTimer = ref(0)
const resendLoading = ref(false)

// Şifre sıfırlama için yeni state'ler
const showResetPasswordModal = ref(false)
const resetToken = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

// URL parametrelerini kontrol et
onMounted(() => {
  const route = useRoute()

  // Şifre sıfırlama token'ı
  const token = route.query.token
  if (token) {
    resetToken.value = token as string
    showResetPasswordModal.value = true
  }

  // Email doğrulama token'ı
  const verifyToken = route.query.verifyToken
  if (verifyToken) {
    verifyEmail(verifyToken as string)
  }
})

async function handleLogin() {
  if (!loginForm.email || !loginForm.password) {
    toast.add({ title: 'Error', description: 'Please fill all fields', color: 'red' })
    return
  }

  loading.value = true
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: loginForm
    })

    // Eğer doğrulama gerekiyorsa
    if (response.requireVerification) {
      verificationEmail.value = loginForm.email
      showVerificationModal.value = true
      toast.add({
        title: 'Doğrulama Gerekli',
        description: 'Lütfen hesabınızı doğrulamak için email adresinize daha önce gönderilen kodu giriniz veya yeni kod talep ediniz',
        color: 'yellow'
      })
    } else {
      // Doğrulama gerekmiyorsa normal login
      await router.push('/panel')
    }
  } catch (e) {
    toast.add({
      title: 'Hata',
      description: e.data?.message || 'Giriş başarısız',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (registerForm.password !== registerForm.confirmPassword) {
    toast.add({ title: 'Error', description: 'Passwords do not match', color: 'red' })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: registerForm.email,
        password: registerForm.password
      }
    })

    // Sadece email'i kaydet ve modalı aç
    verificationEmail.value = registerForm.email
    showVerificationModal.value = true

    // Form reset
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''

    toast.add({
      title: 'Success',
      description: 'Account created successfully. Please check your email for verification code.',
      color: 'green'
    })
  } catch (e) {
    toast.add({
      title: 'Error',
      description: e.data?.message || 'Registration failed',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// handleForgotPassword fonksiyonunda güncelleme
async function handleForgotPassword() {
  if (!forgotForm.email) {
    toast.add({ title: 'Error', description: 'Please enter your email', color: 'red' })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: forgotForm.email }
    })

    toast.add({
      title: 'Success',
      description: 'Password reset instructions sent to your email',
      color: 'green'
    })

    showForgotPasswordModal.value = false
    activeTab.value = 'login' // activeForm.value = 'login' yerine
    forgotForm.email = ''
  } catch (e) {
    toast.add({
      title: 'Error',
      description: e.data?.message || 'Failed to process request',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

async function verifyEmail(code?: string) {
  // Eğer code parametresi bir obje ise (event object)
  if (typeof code === 'object') {
    code = undefined;
  }

  if (!code && !verificationCode.value) {
    toast.add({ title: 'Error', description: 'Please enter verification code', color: 'red' })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: {
        email: verificationEmail.value,
        code: code || verificationCode.value
      }
    })

    showVerificationModal.value = false
    activeTab.value = 'login'
    verificationCode.value = '' // Kodu temizle
    toast.add({
      title: 'Success',
      description: 'Email verified successfully. You can now login.',
      color: 'green'
    })
  } catch (e) {
    toast.add({
      title: 'Error',
      description: e.data?.message || 'Verification failed',
      color: 'red'
    })
    // Link ile gelen doğrulama başarısız olursa modalı göster
    if (code) {
      verificationEmail.value = email
      showVerificationModal.value = true
    }
  } finally {
    loading.value = false
  }
}

async function resendVerificationCode() {
  resendLoading.value = true
  try {
    await $fetch('/api/auth/resend-verification', {
      method: 'POST',
      body: { email: verificationEmail.value }
    })

    // Kodu otomatik doldurmayı kaldır

    // Timer'ı başlat
    resendTimer.value = 60
    const timer = setInterval(() => {
      resendTimer.value--
      if (resendTimer.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    toast.add({
      title: 'Başarılı',
      description: 'Yeni doğrulama kodu email adresinize gönderildi',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Hata',
      description: error.data?.message || 'Kod gönderme başarısız',
      color: 'red'
    })
  } finally {
    resendLoading.value = false
  }
}

// Şifre sıfırlama işlemi
async function handleResetPassword() {
  if (!newPassword.value || !confirmNewPassword.value) {
    toast.add({ title: 'Hata', description: 'Lütfen tüm alanları doldurun', color: 'red' })
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    toast.add({ title: 'Hata', description: 'Şifreler eşleşmiyor', color: 'red' })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: resetToken.value,
        password: newPassword.value
      }
    })

    showResetPasswordModal.value = false
    resetToken.value = ''
    newPassword.value = ''
    confirmNewPassword.value = ''

    toast.add({
      title: 'Başarılı',
      description: 'Şifreniz başarıyla güncellendi',
      color: 'green'
    })

    activeTab.value = 'login' // activeForm.value = 'login' yerine
  } catch (error) {
    toast.add({
      title: 'Hata',
      description: error.data?.message || 'Şifre sıfırlama başarısız oldu',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

// Tab items güncellemesi
const tabs = [
  {
    key: 'login',
    label: 'Login',
    icon: 'i-line-md-log-in',
    description: 'Sign in to your account'
  },
  {
    key: 'register',
    label: 'Register',
    icon: 'i-line-md-account-add',
    description: 'Create a new account'
  }
]

// Yeni state
const showForgotPasswordModal = ref(false)
</script>

<template>
  <UContainer class="w-full min-h-screen flex items-center justify-center">
    <UCard class="w-full max-w-md overflow-hidden" :ui="{
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }">
      <!-- Custom Tab Navigation -->
      <div class="flex border overflow-hidden mb-6" :class="$settings.uiConfig.rounded">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex-1 p-3 transition-colors duration-200 relative"
          :class="{
            'bg-primary-500 text-white': activeTab === tab.key,
            'hover:bg-gray-100 dark:hover:bg-gray-800': activeTab !== tab.key
          }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Forms Container -->
      <div class="relative min-h-[450px]">
        <!-- Login Form -->
        <div 
          class="absolute w-full transition-all duration-300 ease-in-out"
          :class="{
            'translate-x-0 opacity-100': activeTab === 'login',
            '-translate-x-full opacity-0': activeTab === 'register'
          }"
        >
          <div class="flex flex-col items-center mb-6">
            <UIcon :name="tabs[0].icon" class="w-16 h-16 text-primary-500 mb-4" />
            <p class="text-base font-semibold leading-6 mb-1">{{ tabs[0].label }}</p>
            <p class="text-sm text-gray-500">{{ tabs[0].description }}</p>
          </div>
          <form class="space-y-4" @submit.prevent="handleLogin">
            <UFormGroup label="Email">
              <UInput v-model="loginForm.email" type="email" placeholder="Enter your email"
                :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-envelope" />
            </UFormGroup>

            <UFormGroup label="Password">
              <UInput v-model="loginForm.password" type="password" placeholder="Enter your password"
                :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-key" />
            </UFormGroup>

            <div class="flex flex-col gap-4">
              <UButton type="submit" block color="primary" :loading="loading"
                :ui="{ rounded: $settings.uiConfig.rounded }">
                Login
              </UButton>

              <button type="button" class="text-sm text-gray-500 hover:text-primary-500 text-center"
                @click="showForgotPasswordModal = true">
                Forgot your password?
              </button>
            </div>
          </form>
        </div>

        <!-- Register Form -->
        <div 
          class="absolute w-full transition-all duration-300 ease-in-out"
          :class="{
            'translate-x-0 opacity-100': activeTab === 'register',
            'translate-x-full opacity-0': activeTab === 'login'
          }"
        >
          <div class="flex flex-col items-center mb-6">
            <UIcon :name="tabs[1].icon" class="w-16 h-16 text-primary-500 mb-4" />
            <p class="text-base font-semibold leading-6 mb-1">{{ tabs[1].label }}</p>
            <p class="text-sm text-gray-500">{{ tabs[1].description }}</p>
          </div>
          <form class="space-y-4" @submit.prevent="handleRegister">
            <UFormGroup label="Email">
              <UInput v-model="registerForm.email" type="email" placeholder="Enter your email"
                :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-envelope" />
            </UFormGroup>

            <UFormGroup label="Password">
              <UInput v-model="registerForm.password" type="password" placeholder="Choose a password"
                :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-key" />
            </UFormGroup>

            <UFormGroup label="Confirm Password">
              <UInput v-model="registerForm.confirmPassword" type="password" placeholder="Confirm your password"
                :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-key" />
            </UFormGroup>

            <UButton type="submit" block color="primary" :loading="loading"
              :ui="{ rounded: $settings.uiConfig.rounded }">
              Register
            </UButton>
          </form>
        </div>
      </div>
    </UCard>

    <!-- Forgot Password Modal -->
    <UModal v-model="showForgotPasswordModal" :ui="{
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }">
      <div class="p-6">
        <div class="flex flex-col items-center mb-6">
          <UIcon 
            name="i-line-md-email-plus-twotone"
            class="w-16 h-16 text-primary-500 mb-4"
          />
          <h3 class="text-lg font-semibold">
            Forgot Password
          </h3>
          <p class="text-gray-600 text-center">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <UFormGroup label="Email">
            <UInput v-model="forgotForm.email" type="email" placeholder="Enter your email"
              :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-envelope" />
          </UFormGroup>

          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="soft" @click="showForgotPasswordModal = false"
              :ui="{ rounded: $settings.uiConfig.rounded }">
              Cancel
            </UButton>
            <UButton type="submit" color="primary" :loading="loading" :ui="{ rounded: $settings.uiConfig.rounded }">
              Send Instructions
            </UButton>
          </div>
        </form>
      </div>
    </UModal>

    <!-- Verification Modal -->
    <UModal v-model="showVerificationModal" prevent-close :ui="{
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }">
      <div class="p-6">
        <div class="flex flex-col items-center mb-6">
          <UIcon 
            name="i-line-md-email-check-twotone"
            class="w-16 h-16 text-primary-500 mb-4"
          />
          <h3 class="text-lg font-semibold">
            Email Doğrulama
          </h3>
          <p class="text-gray-600 text-center">
            Hesabınızı kullanmaya başlamak için email adresinizi doğrulamanız gerekiyor.
          </p>
        </div>

        <UFormGroup label="Doğrulama Kodu">
          <UInput v-model="verificationCode" placeholder="Doğrulama kodunu giriniz" class="mb-2"
            :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-shield-check" />
          <div class="flex justify-end">
            <UButton v-if="!resendTimer" size="sm" variant="ghost" color="primary" :loading="resendLoading"
              @click="resendVerificationCode" :ui="{ rounded: $settings.uiConfig.rounded }">
              Yeni Kod Gönder
            </UButton>
            <p v-else class="text-sm text-gray-500">
              {{ resendTimer }} saniye sonra yeni kod isteyebilirsiniz
            </p>
          </div>
        </UFormGroup>

        <div class="flex justify-end gap-2 mt-4">
          <UButton color="gray" variant="soft" @click="showVerificationModal = false"
            :ui="{ rounded: $settings.uiConfig.rounded }">
            Kapat
          </UButton>
          <UButton color="primary" :loading="loading" @click="verifyEmail"
            :ui="{ rounded: $settings.uiConfig.rounded }">
            Doğrula
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Password Reset Modal -->
    <UModal v-model="showResetPasswordModal" prevent-close :ui="{
      rounded: $settings.uiConfig.rounded,
      shadow: $settings.uiConfig.shadow,
      background: $settings.uiConfig.background,
      ring: $settings.uiConfig.border
    }">
      <div class="p-6">
        <div class="flex flex-col items-center mb-6">
          <UIcon 
            name="i-line-md-edit-full-twotone"
            class="w-16 h-16 text-primary-500 mb-4"
          />
          <h3 class="text-lg font-semibold">
            Yeni Şifre Belirleme
          </h3>
          <p class="text-gray-600 text-center">
            Lütfen yeni şifrenizi belirleyin.
          </p>
        </div>

        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <UFormGroup label="Yeni Şifre">
            <UInput v-model="newPassword" type="password" placeholder="Yeni şifrenizi girin"
              :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-key" />
          </UFormGroup>

          <UFormGroup label="Şifre Tekrar">
            <UInput v-model="confirmNewPassword" type="password" placeholder="Şifrenizi tekrar girin"
              :ui="{ rounded: $settings.uiConfig.rounded }" icon="i-heroicons-key" />
          </UFormGroup>

          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="soft" @click="showResetPasswordModal = false"
              :ui="{ rounded: $settings.uiConfig.rounded }">
              İptal
            </UButton>
            <UButton type="submit" color="primary" :loading="loading" :ui="{ rounded: $settings.uiConfig.rounded }">
              Şifreyi Güncelle
            </UButton>
          </div>
        </form>
      </div>
    </UModal>
  </UContainer>
</template>

<style scoped>
.translate-x-full {
  transform: translateX(100%);
}

.-translate-x-full {
  transform: translateX(-100%);
}
.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
