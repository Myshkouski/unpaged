import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  extends: ['..'],
  modules: [
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/ui'
  ],
  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url))
    }
  },

  compatibilityDate: '2024-12-30'
})
