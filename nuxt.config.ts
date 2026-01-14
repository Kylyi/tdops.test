import { createResolver } from 'nuxt/kit'
// import { generateSwaggerTypes } from './scripts/generate-swagger-types'

// https://nuxt.com/docs/api/configuration/nuxt-config
const extendOptions = { auth: import.meta.env.VITE_GITHUB_TOKEN }
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  extends: [
    // Layers
    ['github:gentlsro/lib-DynamicGrid#master', extendOptions],
  ],

  modules: [
    resolve('./modules/i18n.module'),
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/device',
    '@nuxt/eslint',
    'nuxt-echarts',
    '@nuxt/fonts',
  ],

  ssr: false,

  components: {
    dirs: [
      { path: './components', pathPrefix: false },
      { path: './widgets', pathPrefix: false, pattern: '**/*.vue' },
      { path: './libs', pathPrefix: false },
    ],
  },

  // Imports https://nuxt.com/docs/api/nuxt-config#imports
  imports: {
    imports: [],
    dirs: [
      './libs/App/constants',
      './libs/App/globals',
      './libs/App/enums',
      './libs/App/functions',
      './libs/App/composables',
      './libs/App/stores',
      './libs/Api/clients',
      './libs/Api/functions',
      './libs/**/types/**',
    ],
  },

  app: {
    head: {
      title: 'TDOPS',
    },
  },

  runtimeConfig: {
    public: {
      FILES_HOST: import.meta.env.NUXT_PUBLIC_FILES_HOST,
    },
  },

  srcDir: 'client/',

  routeRules: {
    '/*/dynamic-grids/*/email-preview': {
      ssr: true,
    },
  },

  devServer: {
    port: import.meta.env.PORT || 3000,
  },

  // Future
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-03-12',

  vite: {
    optimizeDeps: {
      include: ['mathjs', 'qrcode'],
    },
  },

  hooks: {
    'build:before': async () => {
      // await generateSwaggerTypes()
    },
  },

  echarts: {
    renderer: ['svg', 'canvas'],
    charts: ['BarChart', 'LineChart', 'PieChart'],
    components: [
      'DatasetComponent',
      'GridComponent',
      'TooltipComponent',
      'TitleComponent',
      'AxisPointerComponent',
      'LegendComponent',
    ],
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: true,
    },
  },

  fonts: {
    defaults: {
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
    },
  },

  // Modules setup
  // NOTE - There is also i18n.config.ts
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
    defaultLocale: 'sr-Cyrl',
    langDir: '../i18n',
    locales: [
      {
        code: 'en',
        file: 'en.json',
        name: 'English',
        dateFormat: 'MM/DD/YYYY',
        dateFormatBackend: 'MM/dd/yyyy HH:mm:ss',
        currency: 'USD',
        icon: 'i-twemoji:flag-united-kingdom',
      },
      {
        code: 'sr',
        file: 'sr.json',
        name: 'Srpski',
        dateFormat: 'DD.MM.YYYY',
        dateFormatBackend: 'dd.MM.yyyy. HH:mm:ss',
        currency: 'RSD',
        icon: 'i-twemoji:flag-serbia',
      },
      {
        code: 'sr-Cyrl',
        file: 'sr-Cyrl.json',
        name: 'Српски',
        dateFormat: 'DD.MM.YYYY',
        dateFormatBackend: 'dd.MM.yyyy. HH:mm:ss',
        currency: 'RSD',
        icon: 'i-twemoji:flag-serbia',
      },
    ],
  },

  unocss: {
    preflight: false,
    nuxtLayers: true,
  },
})
