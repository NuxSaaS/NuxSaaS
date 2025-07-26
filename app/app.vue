<script lang="ts" setup>
import { registerTheme } from 'echarts/core'
// Credit: https://github.com/nuxt/ui/issues/978#issuecomment-3025809129
import NuxtUITheme from './assets/echarts-theme.json'

const { t } = useI18n()

// Zod locale configuration
const { locale } = useI18n()

registerTheme('nuxtui-chart', NuxtUITheme)
provide(THEME_KEY, 'nuxtui-chart')

const updateZodLocale = (newLocale: string) => {
  const localeKey = newLocale.replace('-', '') as keyof typeof zodLocales
  if (z.locales[localeKey]) {
    z.config(z.locales[localeKey]())
  } else {
    console.warn(`Zod locale "${localeKey}" not found, falling back to English.`)
    z.config(z.locales.en())
  }
}

watchEffect(() => {
  updateZodLocale(locale.value)
})

useHead({
  titleTemplate: (title) => {
    if (title) {
      if (title.includes(t('global.appName'))) {
        return title
      } else {
        return `${title} | ${t('global.appName')}`
      }
    } else {
      return t('global.appName')
    }
  }
})
useSeoMeta({
  ogSiteName: t('global.appName')
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
