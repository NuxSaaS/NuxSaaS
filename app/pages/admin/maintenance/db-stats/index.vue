<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
const { t } = useI18n()
const { data: dbStats } = await useFetch('/api/admin/maintenance/db-stats')

// Format bytes to human readable format
function formatBytes(bytes: number) {
  if (bytes === 0)
    return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}
</script>

<template>
  <NuxtLayout name="admin">
    <UCard class="mt-4">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="lucide:bar-chart" />
          <span>{{ t('dbStats.performance') }}</span>
        </div>
      </template>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UCard>
          <div class="space-y-4">
            <div>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                {{ t('dbStats.activeBackends') }}
              </div>
              <div class="text-xl">
                {{ dbStats?.activeBackends }}
              </div>
            </div>

            <USeparator />

            <div>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                {{ t('dbStats.transactions') }}
              </div>
              <div class="mt-1 grid grid-cols-2 gap-2">
                <div>
                  <div class="text-sm text-success-500">
                    {{ t('dbStats.commits') }}
                  </div>
                  <div>{{ dbStats?.transactions.commits }}</div>
                </div>
                <div>
                  <div class="text-sm text-error-500">
                    {{ t('dbStats.rollbacks') }}
                  </div>
                  <div>{{ dbStats?.transactions.rollbacks }}</div>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="space-y-4">
            <div>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                {{ t('dbStats.tuples') }}
              </div>
              <div class="mt-1 grid grid-cols-3 gap-2">
                <div>
                  <div class="text-sm text-success-500">
                    {{ t('dbStats.inserted') }}
                  </div>
                  <div>{{ dbStats?.tuples.inserted }}</div>
                </div>
                <div>
                  <div class="text-sm text-warning-500">
                    {{ t('dbStats.updated') }}
                  </div>
                  <div>{{ dbStats?.tuples.updated }}</div>
                </div>
                <div>
                  <div class="text-sm text-error-500">
                    {{ t('dbStats.deleted') }}
                  </div>
                  <div>{{ dbStats?.tuples.deleted }}</div>
                </div>
              </div>
            </div>

            <USeparator />

            <div>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                {{ t('dbStats.cacheHitRatio') }}
              </div>
              <div class="text-xl">
                {{ dbStats?.cacheHitRatio }}%
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="space-y-4">
            <div>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">
                {{ t('dbStats.tempFiles') }}
              </div>
              <div class="mt-1">
                <div class="text-xl">
                  {{ dbStats?.tempFiles.count }}
                </div>
                <div
                  v-if="dbStats?.tempFiles.bytes"
                  class="text-sm text-neutral-500 dark:text-neutral-400"
                >
                  {{ formatBytes(dbStats.tempFiles.bytes) }}
                </div>
              </div>
            </div>

            <USeparator />

            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ t('dbStats.conflicts') }}
                </div>
                <div class="text-xl text-warning-500">
                  {{ dbStats?.conflicts }}
                </div>
              </div>
              <div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ t('dbStats.deadlocks') }}
                </div>
                <div class="text-xl text-error-500">
                  {{ dbStats?.deadlocks }}
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <div
        v-if="!dbStats"
        class="text-center"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="animate-spin"
        />
      </div>
    </UCard>
  </NuxtLayout>
</template>
