<template>
  <UHeader :links="links" :ui="{
    rounded: $settings.uiConfig.rounded,
  }">
    <template #logo>
      <AppLogo />
    </template>

    <template #right>
      <div class="flex items-center gap-2 p-2 backdrop-blur-2xl rounded-lg">
        <UColorModeButton />
        <AppMiniCart />
        <template v-if="authToken">
          <UButton to="/panel" variant="ghost" class="flex items-center gap-1" icon="i-heroicons-squares-2x2" :ui="{
            rounded: $settings.uiConfig.rounded,
          }">
            <span class="hidden md:inline">Panel</span>
          </UButton>
          <UButton variant="ghost" class="flex items-center gap-1" icon="i-heroicons-arrow-right-on-rectangle"
            @click="handleLogout" :ui="{
              rounded: $settings.uiConfig.rounded,
            }">
            <span class="hidden md:inline">Logout</span>
          </UButton>
        </template>
        <UButton v-else to="/panel/login" variant="ghost" class="flex items-center gap-1" icon="i-heroicons-user-circle"
          :ui="{
            rounded: $settings.uiConfig.rounded,
          }">
          <span class="hidden md:inline">Login</span>
        </UButton>
      </div>
    </template>

    <template #panel>
      <UAsideLinks :links="links" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const { $settings } = useNuxtApp()
const nuxtApp = useNuxtApp()
const route = useRoute()
const router = useRouter()
const { activeHeadings, updateHeadings } = useScrollspy()

const isHomePage = computed(() => route.path === '/')

const authToken = useCookie('auth_token')

const links = computed(() => [
  {
    label: 'Home',
    to: isHomePage.value ? '#home' : '/',
    icon: 'i-heroicons-home',
    active: isHomePage.value && activeHeadings.value.includes('home') && !activeHeadings.value.includes('features')
  },
  {
    label: 'About',
    to: isHomePage.value ? '#features' : '/#features',
    icon: 'i-heroicons-cube-transparent',
    active: isHomePage.value && activeHeadings.value.includes('features') && !activeHeadings.value.includes('core-features')
  },
  {
    label: 'Features',
    to: isHomePage.value ? '#core-features' : '/#core-features',
    icon: 'i-heroicons-credit-card',
    active: isHomePage.value && activeHeadings.value.includes('core-features')
  },
  {
    label: 'Blog',
    to: '/blog',
    icon: 'i-heroicons-document-text',
    active: route.path === '/blog'
  },
  {
    label: 'Shop',
    to: '/shop',
    icon: 'i-heroicons-shopping-bag',
    active: route.path === '/shop'
  },
  {
    label: 'Contact',
    to: isHomePage.value ? '#contact' : '/#contact',
    icon: 'i-heroicons-envelope',
    active: isHomePage.value && activeHeadings.value.includes('contact')
  }
])

const handleLogout = () => {
  authToken.value = null
  router.push('/panel/login')
}

nuxtApp.hooks.hookOnce('page:finish', () => {
  if (isHomePage.value) {
    const elements = [
      document.querySelector('#home'),
      document.querySelector('#features'),
      document.querySelector('#core-features'),
      document.querySelector('#blog'),
      document.querySelector('#shop'),
      document.querySelector('#contact')
    ].filter(el => el instanceof Element)

    if (elements.length) {
      updateHeadings(elements)
    } else {
      console.warn('Headings not found, updateHeadings not called.')
    }
  }
})
</script>
