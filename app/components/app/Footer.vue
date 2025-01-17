<template>
  <div class="relative -mt-12 w-full px-20">
    <div class="flex flex-col items-center">
      <UIcon
        name="i-heroicons-chevron-down-solid"
        class="w-8 h-8 animate-pulse"
      />
      <NuxtLink
        to="https://upcreate.art"
        target="_blank"
        class="block text-xs text-gray-500 dark:text-gray-400"
      >
        <div class="flex items-center justify-center my-4">
          <div
            class="relative px-4 py-1 bg-transparent border border-gray-500 rounded-full hover:bg-indigo-500/10 hover:border-indigo-500 duration-1000"
          >
            <div class="flex flex-col items-center">
              Copyright - Upcreate.art
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ new Date().getFullYear() }} All rights
                reserved.</p>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
