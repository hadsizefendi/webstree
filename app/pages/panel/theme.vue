<template>
  <div class="min-h-screen">
    <UContainer class="py-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-arrow-left"
            color="white"
            variant="ghost"
            size="sm"
            :ui="{ rounded: settings.uiConfig.rounded }"
            class="!rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="navigateTo('/panel')"
          />
          <div>
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-600 bg-clip-text text-transparent"
            >
              Theme Settings
            </h1>
            <div
              class="hidden
bg-inherit bg-current bg-transparent bg-black bg-white bg-slate-50 bg-slate-100 bg-slate-200 bg-slate-300 bg-slate-400 bg-slate-500 bg-slate-600 bg-slate-700 bg-slate-800 bg-slate-900 bg-slate-950 bg-gray-50 bg-gray-100 bg-gray-200 bg-gray-300 bg-gray-400 bg-gray-500 bg-gray-600 bg-gray-700 bg-gray-800 bg-gray-900 bg-gray-950 bg-zinc-50 bg-zinc-100 bg-zinc-200 bg-zinc-300 bg-zinc-400 bg-zinc-500 bg-zinc-600 bg-zinc-700 bg-zinc-800 bg-zinc-900 bg-zinc-950 bg-neutral-50 bg-neutral-100 bg-neutral-200 bg-neutral-300 bg-neutral-400 bg-neutral-500 bg-neutral-600 bg-neutral-700 bg-neutral-800 bg-neutral-900 bg-neutral-950 bg-stone-50 bg-stone-100 bg-stone-200 bg-stone-300 bg-stone-400 bg-stone-500 bg-stone-600 bg-stone-700 bg-stone-800 bg-stone-900 bg-stone-950 bg-red-50 bg-red-100 bg-red-200 bg-red-300 bg-red-400 bg-red-500 bg-red-600 bg-red-700 bg-red-800 bg-red-900 bg-red-950 bg-orange-50 bg-orange-100 bg-orange-200 bg-orange-300 bg-orange-400 bg-orange-500 bg-orange-600 bg-orange-700 bg-orange-800 bg-orange-900 bg-orange-950 bg-amber-50 bg-amber-100 bg-amber-200 bg-amber-300 bg-amber-400 bg-amber-500 bg-amber-600 bg-amber-700 bg-amber-800 bg-amber-900 bg-amber-950 bg-yellow-50 bg-yellow-100 bg-yellow-200 bg-yellow-300 bg-yellow-400 bg-yellow-500 bg-yellow-600 bg-yellow-700 bg-yellow-800 bg-yellow-900 bg-yellow-950 bg-lime-50 bg-lime-100 bg-lime-200 bg-lime-300 bg-lime-400 bg-lime-500 bg-lime-600 bg-lime-700 bg-lime-800 bg-lime-900 bg-lime-950 bg-green-50 bg-green-100 bg-green-200 bg-green-300 bg-green-400 bg-green-500 bg-green-600 bg-green-700 bg-green-800 bg-green-900 bg-green-950 bg-emerald-50 bg-emerald-100 bg-emerald-200 bg-emerald-300 bg-emerald-400 bg-emerald-500 bg-emerald-600 bg-emerald-700 bg-emerald-800 bg-emerald-900 bg-emerald-950 bg-teal-50 bg-teal-100 bg-teal-200 bg-teal-300 bg-teal-400 bg-teal-500 bg-teal-600 bg-teal-700 bg-teal-800 bg-teal-900 bg-teal-950 bg-cyan-50 bg-cyan-100 bg-cyan-200 bg-cyan-300 bg-cyan-400 bg-cyan-500 bg-cyan-600 bg-cyan-700 bg-cyan-800 bg-cyan-900 bg-cyan-950 bg-sky-50 bg-sky-100 bg-sky-200 bg-sky-300 bg-sky-400 bg-sky-500 bg-sky-600 bg-sky-700 bg-sky-800 bg-sky-900 bg-sky-950 bg-blue-50 bg-blue-100 bg-blue-200 bg-blue-300 bg-blue-400 bg-blue-500 bg-blue-600 bg-blue-700 bg-blue-800 bg-blue-900 bg-blue-950 bg-indigo-50 bg-indigo-100 bg-indigo-200 bg-indigo-300 bg-indigo-400 bg-indigo-500 bg-indigo-600 bg-indigo-700 bg-indigo-800 bg-indigo-900 bg-indigo-950 bg-violet-50 bg-violet-100 bg-violet-200 bg-violet-300 bg-violet-400 bg-violet-500 bg-violet-600 bg-violet-700 bg-violet-800 bg-violet-900 bg-violet-950 bg-purple-50 bg-purple-100 bg-purple-200 bg-purple-300 bg-purple-400 bg-purple-500 bg-purple-600 bg-purple-700 bg-purple-800 bg-purple-900 bg-purple-950 bg-fuchsia-50 bg-fuchsia-100 bg-fuchsia-200 bg-fuchsia-300 bg-fuchsia-400 bg-fuchsia-500 bg-fuchsia-600 bg-fuchsia-700 bg-fuchsia-800 bg-fuchsia-900 bg-fuchsia-950 bg-pink-50 bg-pink-100 bg-pink-200 bg-pink-300 bg-pink-400 bg-pink-500 bg-pink-600 bg-pink-700 bg-pink-800 bg-pink-900 bg-pink-950 bg-rose-50 bg-rose-100 bg-rose-200 bg-rose-300 bg-rose-400 bg-rose-500 bg-rose-600 bg-rose-700 bg-rose-800 bg-rose-900"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-6">
        <!-- Color Settings -->
        <UCard
          :ui="{
            rounded: settings.uiConfig.rounded,
            shadow: settings.uiConfig.shadow,
            background: settings.uiConfig.background,
            ring: settings.uiConfig.border
          }"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-swatch"
                class="w-5 h-5"
              />
              <h3 class="text-lg font-semibold">
                Color Settings
              </h3>
            </div>
          </template>

          <div class="space-y-6">
            <!-- Primary Color -->
            <div class="space-y-2">
              <UDivider>Primary</UDivider>
              <SettingColorPicker
                v-model="settings.primary"
                :default-tone="500"
                @change="updateConfig"
              />
            </div>

            <!-- Gray Color -->
            <div class="space-y-2">
              <UDivider>Secondary</UDivider>
              <SettingColorPicker
                v-model="settings.gray"
                :default-tone="500"
                @change="updateConfig"
              />
            </div>
          </div>
        </UCard>

        <!-- UI Configuration -->
        <UCard
          :ui="{
            rounded: settings.uiConfig.rounded,
            shadow: settings.uiConfig.shadow,
            background: settings.uiConfig.background,
            ring: settings.uiConfig.border
          }"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-cog-6-tooth"
                class="w-5 h-5"
              />
              <h3 class="text-lg font-semibold">
                UI Configuration
              </h3>
            </div>
          </template>

          <div class="space-y-4 pb-6">
            <UDivider>Preview</UDivider>
            <!-- Preview Card -->
            <UCard
              :ui="{
                rounded: settings.uiConfig.rounded,
                shadow: settings.uiConfig.shadow,
                background: settings.uiConfig.background,
                border: settings.uiConfig.border
              }"
            >
              <div class="space-y-4">
                <!-- Buttons Preview -->
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-2">
                    <UButton
                      color="primary"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    >
                      Primary
                    </UButton>
                    <UButton
                      color="gray"
                      variant="solid"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    >
                      Gray
                    </UButton>
                    <UButton
                      variant="soft"
                      color="primary"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    >
                      Soft
                    </UButton>
                    <UButton
                      variant="outline"
                      color="primary"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    >
                      Outline
                    </UButton>
                    <UButton
                      variant="ghost"
                      color="primary"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    >
                      Ghost
                    </UButton>
                  </div>
                </div>

                <!-- Inputs Preview -->
                <div class="space-y-2">
                  <div class="grid gap-4">
                    <UInput
                      placeholder="Default input example"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    />
                    <UInput
                      placeholder="Input with icon"
                      icon="i-heroicons-magnifying-glass"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    />
                    <UTextarea
                      placeholder="Textarea example"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    />
                    <USelect
                      :options="['Option 1', 'Option 2', 'Option 3']"
                      placeholder="Select example"
                      :ui="{ rounded: settings.uiConfig.rounded }"
                    />
                  </div>
                </div>
              </div>
            </UCard>

            <UDivider>Settings</UDivider>

            <!-- Settings -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-left">Rounded</label>
                <SettingRoundedPicker
                  v-model="settings.uiConfig.rounded"
                  @change="updateConfig"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-left">Shadow</label>
                <SettingShadowPicker
                  v-model="settings.uiConfig.shadow"
                  @change="updateConfig"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-left">Background</label>
                <SettingBackgroundPicker
                  v-model="settings.uiConfig.background"
                  @change="updateConfig"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-left">Border</label>
                <SettingBorderPicker
                  v-model="settings.uiConfig.border"
                  @change="updateConfig"
                />
              </div>
            </div>
          </div>
        </UCard>
        <UCard
          :ui="{
            rounded: settings.uiConfig.rounded,
            shadow: settings.uiConfig.shadow,
            background: settings.uiConfig.background,
            ring: settings.uiConfig.border
          }"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-cog-6-tooth"
                class="w-5 h-5"
              />
              <h3 class="text-lg font-semibold">
                Page Transition
              </h3>
            </div>
          </template>
          <label class="block text-sm font-medium">Transition</label>
          <SettingTransitionPicker
            v-model="settings.uiConfig.transition"
            @change="updateConfig"
          />
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
useSeoMeta({
  title: 'Theme Settings',
  ogTitle: 'Theme Settings',
  description: 'Customize your website theme',
  ogDescription: 'Customize your website theme'
})
const settings = useState('settings')
const toast = useToast()
const appConfig = useAppConfig()

const updateConfig = async () => {
  try {
    const themeSettings = {
      primary: settings.value.primary,
      gray: settings.value.gray,
      uiConfig: {
        rounded: settings.value.uiConfig.rounded,
        shadow: settings.value.uiConfig.shadow,
        background: settings.value.uiConfig.background,
        border: settings.value.uiConfig.border,
        transition: settings.value.uiConfig.transition
      }
    }

    await $fetch('/api/settings/theme', {
      method: 'POST',
      body: themeSettings
    })

    appConfig.ui = {
      ...appConfig.ui,
      primary: settings.value.primary,
      gray: settings.value.gray,
      rounded: settings.value.uiConfig.rounded,
      shadow: settings.value.uiConfig.shadow,
      background: settings.value.uiConfig.background,
      border: settings.value.uiConfig.border,
      transition: settings.value.uiConfig.transition
    }

    toast.add({
      title: 'Success',
      description: 'Theme settings updated successfully',
      color: 'green'
    })
  } catch (error) {
    console.error('Theme update error:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update theme settings',
      color: 'red'
    })
  }
}
</script>
