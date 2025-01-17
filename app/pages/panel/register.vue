<script setup lang="ts">

definePageMeta({
  middleware: ['auth']
})
useSeoMeta({
  title: 'Register - WebsTree',
  ogTitle: 'Register - WebsTree',
  description: 'Registration Panel',
  ogDescription: 'Registration Panel'
})
const { $settings } = useNuxtApp()
import { useRouter } from 'vue-router'
const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })
    success.value = response.message
    error.value = ''
    username.value = ''
    password.value = ''
    confirmPassword.value = ''
  } catch (e) {
    error.value = e.data?.message || 'Registration failed'
    success.value = ''
  }
}
</script>

<template>
  <div>
    <UContainer class="min-h-screen flex items-center justify-center">
      <UCard class="w-full max-w-md backdrop-blur-xl !bg-opacity-0" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
        <template #header>
          <h1 class="text-2xl font-bold">
            Register
          </h1>
        </template>

        <form class="space-y-4" @submit.prevent="handleRegister">
          <UFormGroup label="Username">
            <UInput v-model="username" placeholder="Enter username" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }" />
          </UFormGroup>

          <UFormGroup label="Password">
            <UInput v-model="password" type="password" placeholder="Enter password" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }" />
          </UFormGroup>

          <UFormGroup label="Confirm Password">
            <UInput v-model="confirmPassword" type="password" placeholder="Confirm password" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }" />
          </UFormGroup>

          <p v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </p>
          <p v-if="success" class="text-green-500 text-sm">
            {{ success }}
          </p>

          <UButton type="submit" color="primary" block :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
            Register
          </UButton>
        </form>
      </UCard>
    </UContainer>
  </div>
</template>
