// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/motion/nuxt',
    'nuxt-file-storage',
    'nuxt-mongoose',
    '@hypernym/nuxt-anime'
  ],

  anime: {
    composables: true,
    autoImport: true
  },

  app: {
    rootId: '__up',
    rootTag: 'upcreate',
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap'
        }
      ]
    }
  },

  plugins: [
    '~/plugins/theme.ts'
  ],

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      FILE_STORAGE_PATH: process.env.FILE_STORAGE_PATH
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-11',

  typescript: {
    strict: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fileStorage: {
    mount: process.env.FILE_STORAGE_PATH
  }
})
