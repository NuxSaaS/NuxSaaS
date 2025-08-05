<script setup lang="ts">
definePageMeta({
  layout: false
})

const isLoading = ref(true)

onMounted(() => {
  nextTick(() => {
    isLoading.value = false
  })
})
</script>

<template>
  <div class="relative">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center space-y-4">
        <Icon
          name="lucide:loader-2"
          class="h-8 w-8 animate-spin text-primary"
        />
        <div class="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
          {{ $t('global.appName') }}
        </div>
      </div>
    </div>

    <!-- Main content -->
    <ClientOnly>
      <NuxtPage />
    </ClientOnly>
  </div>
</template>
