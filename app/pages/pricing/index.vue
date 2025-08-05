<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
definePageMeta({
  auth: false,
  layout: false
})
const { t } = useI18n()
const { loggedIn, subscription, payment, client } = useAuth()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()
const billingPeriod = ref('monthly')

const plans = [
  {
    name: t('pricing.free.name'),
    description: t('pricing.free.description'),
    price: t('pricing.free.price'),
    period: t('pricing.free.period'),
    features: [
      t('pricing.free.feature1'),
      t('pricing.free.feature2')
    ],
    cta: t('pricing.cta.free'),
    color: 'neutral' as const,
    to: runtimeConfig.public.appRepo
  },
  {
    name: t('pricing.pro.name'),
    description: t('pricing.pro.description'),
    price: t('pricing.pro.price', { price: 10 }),
    yearPrice: t('pricing.pro.price', { price: 100 }),
    period: t('pricing.pro.period'),
    yearPeriod: t('pricing.pro.yearPeriod'),
    features: [
      t('pricing.pro.feature1'),
      t('pricing.pro.feature2')
    ],
    cta: t('pricing.cta.pro'),
    color: 'primary' as const,
    popular: true,
    click: async () => {
      if (!loggedIn.value) {
        navigateTo(localePath('/signin?redirect=/pricing'))
        return
      }
      if (payment == 'stripe') {
        const result = await subscription.upgrade({
          plan: `pro-${billingPeriod.value}`,
          successUrl: localePath('/'),
          cancelUrl: localePath('/pricing')
        })
        console.log(result)
      } else if (payment == 'polar') {
        const result = await client.checkout({
          slug: `pro-${billingPeriod.value}`
        })
        console.log(result)
      }
    }
  },
  {
    name: t('pricing.enterprise.name'),
    description: t('pricing.enterprise.description'),
    price: t('pricing.enterprise.price'),
    period: t('pricing.enterprise.period'),
    features: [
      t('pricing.enterprise.feature1'),
      t('pricing.enterprise.feature2'),
      t('pricing.enterprise.feature3')
    ],
    cta: t('pricing.cta.enterprise'),
    color: 'neutral' as const,
    to: `mailto:${runtimeConfig.public.appContactEmail}`
  }
]
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
    <UContainer class="space-y-6 pt-8 pb-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-bold">
          {{ t('pricing.title') }}
        </h1>
        <p class="text-lg text-neutral-500 dark:text-neutral-400">
          {{ t('pricing.subtitle') }}
        </p>

        <!-- Billing toggle -->
        <div class="flex items-center justify-center gap-2 pt-2">
          <URadioGroup
            v-model:model-value="billingPeriod"
            orientation="horizontal"
            size="lg"
            :items="[
              { label: t('pricing.monthly'), value: 'monthly' },
              { label: t('pricing.yearly'), value: 'yearly' }
            ]"
          />
        </div>
      </div>
      <!-- Pricing cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="relative"
        >
          <UCard
            class="h-full flex flex-col"
            :class="[
              plan.popular && 'border-primary dark:border-primary'
            ]"
          >
            <div class="flex-1 space-y-6 w-[300px]">
              <div class="space-y-2">
                <h2 class="text-2xl font-bold">
                  {{ plan.name }}
                </h2>
                <p class="text-neutral-500 dark:text-neutral-400">
                  {{ plan.description }}
                </p>
              </div>

              <div class="space-y-1">
                <div class="text-3xl font-bold">
                  {{ billingPeriod === 'yearly' ? plan.yearPrice || plan.price : plan.price }}
                </div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ billingPeriod === 'yearly' ? plan.yearPeriod || plan.period : plan.period }}
                </div>
              </div>

              <USeparator />

              <div class="space-y-4">
                <p class="font-medium">
                  {{ t('pricing.features.title') }}
                </p>
                <ul class="space-y-3">
                  <li
                    v-for="(feature, index) in plan.features"
                    :key="index"
                    class="flex items-start gap-2"
                  >
                    <UIcon
                      name="lucide:check"
                      class="flex-shrink-0 mt-1 text-green-500"
                    />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <template #footer>
              <UButton
                :color="plan.color"
                :to="plan.to"
                variant="solid"
                class="w-full justify-center"
                @click="plan.click"
              >
                {{ plan.cta }}
              </UButton>
            </template>
          </UCard>
        </div>
      </div>
    </UContainer>
  </NuxtLayout>
</template>
