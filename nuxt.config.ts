const extendOptions = { auth: import.meta.env.VITE_GITHUB_TOKEN }

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [
    // Layers
    ['github:gentlsro/lib-DynamicGrid#master', extendOptions],
  ],
  appDir: 'client'
})
