<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  ogImage: 'https://webstree.com/og.webp',
  twitterImage: 'https://webstree.com/og.webp',
  twitterCard: 'summary_large_image'
})

const sounds = [
  '/sounds/c1.mp3',
  '/sounds/c2.mp3',
  '/sounds/c3.mp3',
  '/sounds/c4.mp3'
]

onMounted(() => {
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A' || target.closest('a')) {
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)]
      const audio = new Audio(randomSound)
      audio.volume = 0.05
      audio.play()
    }
  })
})

// const appConfig = useAppConfig()
// const currentTransition = computed(() => appConfig.ui?.transition || 'none')
// const { $anime } = useNuxtApp()
// watch(currentTransition, (newTransition) => { const page = document.querySelector('.page-content') if (page) { $anime({ targets: page,  opacity: [0, 1], translateY: [20, 0], duration: 800, easing: 'easeOutExpo' })}})
</script>

<template>
  <video autoplay muted loop playsinline class="bg-video opacity-20">
    <source src="/bg-3.mp4" type="video/mp4">
  </video>
  <AppHeader />
  <UMain class="overflow-x-hidden">
    <!--NuxtPage :transition="{ name: currentTransition, mode: 'out-in' }" class="page-content" /-->
    <NuxtPage />
  </UMain>
  <AppFooter />
  <UNotifications />
</template>

<style>
::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  background: #063142;
}

::-webkit-scrollbar-thumb:hover {
  background: #041228;
}

* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
}

.bg-video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -10;
}
</style>
