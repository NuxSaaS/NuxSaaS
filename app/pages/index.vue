<i18n src="./index.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false,
  layout: false
})

const { t } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()

const title = `${t('global.appName')}: ${t('home.slogan')}`
const desc = t('home.slogan')

useSeoMeta({
  title,
  description: desc,
  // Facebook
  ogTitle: title,
  ogDescription: desc,
  ogImage: '/screenshots/home.webp',
  // twitter
  twitterTitle: title,
  twitterDescription: desc,
  twitterImage: '/screenshots/home.webp'
})

const features = {
  foundation: [
    {
      icon: 'i-lucide-layout-template',
      title: t('home.features.items.modernTechStack.title'),
      description: t('home.features.items.modernTechStack.description')
    },
    {
      icon: 'i-lucide-shield-check',
      title: t('home.features.items.secureAuth.title'),
      description: t('home.features.items.secureAuth.description')
    },
    {
      icon: 'i-lucide-database',
      title: t('home.features.items.enterpriseDatabase.title'),
      description: t('home.features.items.enterpriseDatabase.description')
    }
  ],
  integration: [
    {
      icon: 'i-lucide-mail',
      title: t('home.features.items.emailIntegration.title'),
      description: t('home.features.items.emailIntegration.description')
    },
    {
      icon: 'i-lucide-credit-card',
      title: t('home.features.items.paymentReady.title'),
      description: t('home.features.items.paymentReady.description')
    },
    {
      icon: 'i-lucide-box',
      title: t('home.features.items.noVendorLockIn.title'),
      description: t('home.features.items.noVendorLockIn.description')
    }
  ],
  admin: [
    {
      icon: 'i-lucide-grid',
      title: t('home.features.items.dashboard.title'),
      description: t('home.features.items.dashboard.description')
    },
    {
      icon: 'i-lucide-users',
      title: t('home.features.items.advancedTables.title'),
      description: t('home.features.items.advancedTables.description')
    },
    {
      icon: 'i-lucide-file-text',
      title: t('home.features.items.userSubscriptionManagement.title'),
      description: t('home.features.items.userSubscriptionManagement.description')
    }
  ],
  experience: [
    {
      icon: 'i-lucide-palette',
      title: t('home.features.items.modernUIDesign.title'),
      description: t('home.features.items.modernUIDesign.description')
    },
    {
      icon: 'i-lucide-languages',
      title: t('home.features.items.i18nReady.title'),
      description: t('home.features.items.i18nReady.description')
    },
    {
      icon: 'i-lucide-smartphone',
      title: t('home.features.items.responsiveLayout.title'),
      description: t('home.features.items.responsiveLayout.description')
    }
  ],
  developer: [
    {
      icon: 'i-lucide-code',
      title: t('home.features.items.developerFriendly.title'),
      description: t('home.features.items.developerFriendly.description')
    },
    {
      icon: 'i-lucide-timer',
      title: t('home.features.items.quickSetup.title'),
      description: t('home.features.items.quickSetup.description')
    },
    {
      icon: 'i-lucide-settings',
      title: t('home.features.items.customizable.title'),
      description: t('home.features.items.customizable.description')
    }
  ]
}

const screenshots = [
  {
    label: t('home.screenshots.dashboard'),
    key: 'dashboard',
    src: '/screenshots/dashboard.webp'
  },
  {
    label: t('home.screenshots.users'),
    key: 'users',
    src: '/screenshots/users.webp'
  },
  {
    label: t('home.screenshots.subscription'),
    key: 'subscription',
    src: '/screenshots/subscription.webp'
  },
  {
    label: t('home.screenshots.pricing'),
    key: 'pricing',
    src: '/screenshots/pricing.webp'
  },
  {
    label: t('home.screenshots.signin'),
    key: 'signin',
    src: '/screenshots/signin.webp'
  }
]
const activeScreenshot = ref('0')
</script>

<template>
  <NuxtLayout name="default">
    <template #nav-center>
      <SiteNavigation
        mode="desktop"
        class="hidden sm:flex"
      />
    </template>
    <template #nav-right>
      <div class="flex items-center gap-2">
        <UserNavigation />
        <SiteNavigation
          mode="mobile"
          class="flex sm:hidden"
        />
      </div>
    </template>
    <div class="pt-16">
      <div class="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white dark:from-neutral-900 dark:to-neutral-800" />
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl opacity-50" />
        <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl -ml-32 -mt-32 opacity-30" />
      </div>
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <UContainer class="relative py-24">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight sm:text-7xl mb-6">
              {{ t('global.appName') }}
            </h1>
            <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              {{ t('home.slogan') }}
            </p>
            <div class="flex gap-4 justify-center">
              <UButton
                :to="localePath('/signin')"
                color="primary"
                size="lg"
              >
                {{ t('home.getStarted') }}
              </UButton>
              <UButton
                :to="runtimeConfig.public.appRepo"
                target="_blank"
                color="neutral"
                variant="outline"
                size="lg"
                icon="i-simple-icons-github"
              >
                {{ t('home.viewOnGithub') }}
              </UButton>
            </div>
          </div>
        </UContainer>
      </section>

      <!-- Screenshots Section -->
      <section class="relative mt-20">
        <UContainer>
          <div class="text-center mb-4">
            <h2 class="text-3xl font-bold">
              {{ t('home.screenshots.title') }}
            </h2>
          </div>
          <UTabs
            :items="screenshots"
            class="w-full hidden sm:block"
          >
            <template #content="{ item }">
              <div class="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg">
                <img
                  :src="item.src"
                  :alt="item.label"
                  class="w-full h-auto"
                  loading="lazy"
                >
              </div>
            </template>
          </UTabs>
          <UAccordion
            v-model="activeScreenshot"
            :items="screenshots"
            class="w-full block sm:hidden"
          >
            <template #content="{ item }">
              <div class="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg">
                <img
                  :src="item.src"
                  :alt="item.label"
                  class="w-full h-auto"
                  loading="lazy"
                >
              </div>
            </template>
          </UAccordion>
        </UContainer>
      </section>

      <!-- Features Section -->
      <section
        id="features"
        class="relative py-24 bg-neutral-50/50 dark:bg-neutral-900/50"
      >
        <UContainer>
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold">
              {{ t('home.features.title') }}
            </h2>
          </div>
          <!-- Feature Groups -->
          <div class="space-y-24">
            <div
              v-for="(group, key) in features"
              :key="key"
              class="space-y-8"
            >
              <h3 class="text-xl font-semibold capitalize text-center">
                {{ t(`home.features.categories.${key}`) }}
              </h3>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <UCard
                  v-for="feature in group"
                  :key="feature.title"
                  class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur border-0 shadow hover:shadow-lg transition-shadow duration-200"
                >
                  <div class="flex gap-4 items-start p-2">
                    <div class="shrink-0">
                      <div class="p-3 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
                        <UIcon
                          :name="feature.icon"
                          class="text-primary-500 w-5 h-5"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="font-medium mb-2">
                        {{ feature.title }}
                      </h4>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400">
                        {{ feature.description }}
                      </p>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </UContainer>
      </section>
    </div>
  </NuxtLayout>
</template>
