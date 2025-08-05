<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center">
    <div class="text-center">
      <UIcon
        name="lucide:shield-alert"
        class="mx-auto h-16 w-16 text-red-500 dark:text-red-400"
      />
      <h1 class="mt-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
        {{ t('403.title') }}
      </h1>
      <p class="mt-2 text-base text-neutral-500 dark:text-neutral-400">
        {{ t('403.message') }}
      </p>
      <div class="mt-6">
        <UButton
          :to="localePath('/')"
          icon="lucide:home"
          variant="soft"
        >
          {{ t('403.back') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
