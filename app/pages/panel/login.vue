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

import { useRouter } from 'vue-router'
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })
    await router.push('/panel')
  } catch (e) {
    error.value = e.data?.message || 'Login failed'
  }
}
</script>

<template>
  <UContainer class="w-full h-screen flex items-center justify-center">
    <UCard class="w-full max-w-md" :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
      <template #header>
        <h1 class="text-2xl font-bold">
          Admin Login
        </h1>
      </template>

      <form class="space-y-4" @submit.prevent="handleLogin">
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

        <p v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </p>

        <UButton type="submit" color="primary" block :ui="{
            rounded: $settings.uiConfig.rounded,
            shadow: $settings.uiConfig.shadow,
            background: $settings.uiConfig.background,
            ring: $settings.uiConfig.border
          }">
          Login
        </UButton>
      </form>
    </UCard>
  </UContainer>
</template>
