import { defu } from 'defu'
import type { LocaleObject } from '@nuxtjs/i18n'
import { readFileSync } from 'node:fs'
import { addTemplate, defineNuxtModule } from 'nuxt/kit'

// The layers use a standardized prefix for locales (like en-US),
// while JAFIN uses a simpler format (like `en`). So we need to adjust them to use in JAFIN.
// The layers also provide locales that we don't really need, so we filter them out or adjust their name.
const TDOPS_LOCALES = [
  'en',
  'sr',
  'sr-Cyrl',
]

const LOCALE_MAP: Record<string, string> = {
  'en-US': 'en',
  'sr-RS': 'sr',
  'sr-Cyrl-RS': 'sr-Cyrl',
}

export default defineNuxtModule({
  setup(_, nuxt) {
    const layers = nuxt.options._layers
    const messagesByCode: IItem = {}

    layers.forEach(layer => {
      const i18n = layer.config.i18n

      if (i18n) {
        i18n.locales?.forEach(locale => {
          if (typeof locale === 'string')
            return
          const jsonData = readFileSync(`${layer.cwd}/i18n/${locale.file}`, { encoding: 'utf-8' })
          locale.code = LOCALE_MAP[locale.code] || locale.code

          messagesByCode[locale.code] = defu(JSON.parse(jsonData), messagesByCode[locale.code])
        })

        i18n.locales = (i18n.locales as LocaleObject[])?.filter(locale => {
          return TDOPS_LOCALES.includes(locale.code)
        })
      }
    })

    addTemplate({
      filename: '../client/libs/App/constants/i18n-messages.ts',
      write: true,
      getContents: () => `// @ts-nocheck
export default ${JSON.stringify(messagesByCode, null, 2)}`,
    })
  },
})
